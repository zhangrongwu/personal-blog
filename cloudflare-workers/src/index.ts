import { Hono } from 'hono';
import { cors } from 'hono/cors';

type Bindings = {
  DB: D1Database;
  BLOG_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// 跨域配置
app.use('*', cors({
  origin: [
    'http://localhost:5173',  // 本地开发
    'https://personal-blog-593.pages.dev',  // Pages 部署域名
    'https://personal-blog-workers.your-account.workers.dev'  // Workers 域名
  ],
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  exposeHeaders: ['Content-Length'],
  maxAge: 600,
}));

// 初始化数据库
app.get('/init', async (c) => {
  const { DB } = c.env;
  
  // 创建博客文章表
  await DB.prepare(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      summary TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // 插入初始数据
  const insertPost = DB.prepare(
    'INSERT OR IGNORE INTO posts (title, summary, content) VALUES (?, ?, ?)'
  );

  await insertPost.bind('我的第一篇博客', '记录技术成长之路', '博客内容详情...').run();
  await insertPost.bind('React学习心得', '分享React学习经验', 'React学习详细内容...').run();

  return c.json({ message: '数据库初始化成功' });
});

// 获取所有博客文章
app.get('/api/posts', async (c) => {
  try {
    const { DB } = c.env;
    const { results } = await DB.prepare(
      'SELECT id, title, summary, created_at FROM posts ORDER BY created_at DESC'
    ).all();
    return c.json(results);
  } catch (error) {
    return c.json({ error: 'Failed to fetch posts' }, 500);
  }
});

// 获取特定博客文章
app.get('/api/posts/:id', async (c) => {
  const { DB } = c.env;
  const id = c.req.param('id');
  
  try {
    const { results } = await DB.prepare(
      'SELECT * FROM posts WHERE id = ?'
    ).bind(id).all();
    
    if (results.length === 0) {
      return c.json({ error: 'Post not found' }, 404);
    }
    
    return c.json(results[0]);
  } catch (error) {
    return c.json({ error: 'Failed to fetch post' }, 500);
  }
});

// 创建博客文章（管理员使用）
app.post('/api/posts', async (c) => {
  try {
    const { DB } = c.env;
    const { title, content, summary } = await c.req.json();
    
    const { success } = await DB.prepare(
      'INSERT INTO posts (title, content, summary, created_at) VALUES (?, ?, ?, ?)'
    ).bind(
      title, 
      content, 
      summary, 
      new Date().toISOString()
    ).run();
    
    return c.json({ success });
  } catch (error) {
    return c.json({ error: 'Failed to create post' }, 500);
  }
});

// 上传博客文章
app.post('/api/posts', async (c) => {
  const { DB } = c.env;
  const { title, summary, content } = await c.req.json();

  const result = await DB.prepare(
    'INSERT INTO posts (title, summary, content) VALUES (?, ?, ?)'
  ).bind(title, summary, content).run();

  return c.json({ 
    id: result.lastRowId, 
    message: '文章创建成功' 
  });
});

// 上传文件到R2
app.post('/api/upload', async (c) => {
  const { BLOG_BUCKET } = c.env;
  const file = await c.req.formData();
  const uploadedFile = file.get('file') as File;

  if (!uploadedFile) {
    return c.json({ message: '未上传文件' }, 400);
  }

  const arrayBuffer = await uploadedFile.arrayBuffer();
  const objectKey = `uploads/${Date.now()}_${uploadedFile.name}`;

  await BLOG_BUCKET.put(objectKey, arrayBuffer);

  return c.json({ 
    url: `/api/files/${objectKey}`, 
    message: '文件上传成功' 
  });
});

// 获取R2文件
app.get('/api/files/:key', async (c) => {
  const { BLOG_BUCKET } = c.env;
  const key = c.req.param('key');

  const object = await BLOG_BUCKET.get(key);

  if (!object) {
    return c.json({ message: '文件未找到' }, 404);
  }

  const headers = new Headers();
  object.writeHttpHeaders(headers);
  return new Response(object.body, { headers });
});

export default app;
