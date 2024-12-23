import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { z } from 'zod'

type Bindings = {
  DB: D1Database
  JWT_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 跨域配置
app.use('*', cors())

// 登录路由
app.post('/api/login', async (c) => {
  const { email, password } = await c.req.json()
  
  try {
    // 查询用户
    const user = await c.env.DB
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first()

    if (!user) {
      return c.json({ success: false, message: '无效的邮箱或密码' }, 401)
    }

    // 验证密码（实际应使用安全的密码哈希）
    if (user.password !== password) {
      return c.json({ success: false, message: '无效的邮箱或密码' }, 401)
    }

    // 生成 JWT
    const token = await jwt.sign(
      { 
        id: user.id, 
        email: user.email 
      }, 
      c.env.JWT_SECRET
    )

    return c.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    })
  } catch (err) {
    return c.json({ success: false, message: '登录时发生错误' }, 500)
  }
})

// 注册路由
app.post('/api/register', async (c) => {
  const { username, email, password } = await c.req.json()
  
  try {
    // 检查用户是否已存在
    const existingUser = await c.env.DB
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first()

    if (existingUser) {
      return c.json({ success: false, message: '该邮箱已注册' }, 400)
    }

    // 插入新用户（实际应使用安全的密码哈希）
    const result = await c.env.DB
      .prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)')
      .bind(username, email, password)
      .run()

    if (result.error) {
      return c.json({ success: false, message: '注册失败' }, 500)
    }

    return c.json({
      success: true,
      message: '注册成功'
    })
  } catch (err) {
    return c.json({ success: false, message: '注册时发生错误' }, 500)
  }
})

// 获取博客文章列表
app.get('/api/posts', async (c) => {
  try {
    const { results } = await c.env.DB
      .prepare('SELECT * FROM posts ORDER BY created_at DESC LIMIT 10')
      .all()

    return c.json({
      success: true,
      posts: results
    })
  } catch (err) {
    return c.json({ success: false, message: '获取文章列表失败' }, 500)
  }
})

// 获取单篇博客文章
app.get('/api/posts/:id', async (c) => {
  const postId = c.req.param('id')

  try {
    const post = await c.env.DB
      .prepare('SELECT * FROM posts WHERE id = ?')
      .bind(postId)
      .first()

    if (!post) {
      return c.json({ success: false, message: '文章不存在' }, 404)
    }

    return c.json({
      success: true,
      post
    })
  } catch (err) {
    return c.json({ success: false, message: '获取文章详情失败' }, 500)
  }
})

// 获取文章归档
app.get('/api/posts/archives', async (c) => {
  try {
    const { results } = await c.env.DB
      .prepare(`
        SELECT 
          strftime('%Y', created_at) as year, 
          strftime('%m', created_at) as month, 
          COUNT(*) as post_count 
        FROM posts 
        GROUP BY year, month 
        ORDER BY year DESC, month DESC
      `)
      .all()

    return c.json({
      success: true,
      archives: results
    })
  } catch (err) {
    return c.json({ success: false, message: '获取文章归档失败' }, 500)
  }
})

export default app
