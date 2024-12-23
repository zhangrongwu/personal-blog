import { D1Database } from '@cloudflare/workers-types';

export interface BlogPost {
  id?: number;
  title: string;
  content: string;
  author_id: number;
  created_at?: string;
  updated_at?: string;
  tags?: string[];
  status?: 'draft' | 'published';
}

export async function createPost(db: D1Database, post: BlogPost) {
  try {
    const result = await db.prepare(
      'INSERT INTO blog_posts (title, content, author_id, tags, status) VALUES (?, ?, ?, ?, ?)'
    ).bind(
      post.title, 
      post.content, 
      post.author_id, 
      JSON.stringify(post.tags || []), 
      post.status || 'draft'
    ).run();

    return { 
      success: true, 
      message: '文章创建成功', 
      postId: result.lastRowId 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `文章创建失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function getPosts(
  db: D1Database, 
  options: { 
    page?: number, 
    pageSize?: number, 
    status?: 'draft' | 'published', 
    tags?: string[], 
    searchQuery?: string 
  } = {}
) {
  try {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const offset = (page - 1) * pageSize;

    // 构建动态查询条件
    let query = `
      SELECT 
        blog_posts.id, 
        blog_posts.title, 
        blog_posts.content, 
        blog_posts.status,
        blog_posts.created_at,
        blog_posts.author_id,
        users.username as author_name,
        GROUP_CONCAT(DISTINCT tags.name) as tags
      FROM blog_posts
      LEFT JOIN users ON blog_posts.author_id = users.id
      LEFT JOIN post_tags ON blog_posts.id = post_tags.post_id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      WHERE 1=1
    `;

    const params: any[] = [];

    // 状态过滤
    if (options.status) {
      query += ' AND blog_posts.status = ?';
      params.push(options.status);
    }

    // 标签过滤
    if (options.tags && options.tags.length > 0) {
      query += ` AND tags.name IN (${options.tags.map(() => '?').join(',')})`;
      params.push(...options.tags);
    }

    // 搜索查询
    if (options.searchQuery) {
      query += ` AND (
        blog_posts.title LIKE ? OR 
        blog_posts.content LIKE ? OR 
        users.username LIKE ?
      )`;
      const searchParam = `%${options.searchQuery}%`;
      params.push(searchParam, searchParam, searchParam);
    }

    query += `
      GROUP BY blog_posts.id, blog_posts.title, blog_posts.content, 
               blog_posts.status, blog_posts.created_at, blog_posts.author_id, 
               users.username
      ORDER BY blog_posts.created_at DESC
      LIMIT ? OFFSET ?
    `;

    params.push(pageSize, offset);

    const result = await db.prepare(query).bind(...params).all();

    // 获取总数的查询
    let countQuery = `
      SELECT COUNT(DISTINCT blog_posts.id) as total 
      FROM blog_posts
      LEFT JOIN users ON blog_posts.author_id = users.id
      LEFT JOIN post_tags ON blog_posts.id = post_tags.post_id
      LEFT JOIN tags ON post_tags.tag_id = tags.id
      WHERE 1=1
    `;

    const countParams: any[] = [];

    // 复制之前的过滤条件
    if (options.status) {
      countQuery += ' AND blog_posts.status = ?';
      countParams.push(options.status);
    }

    if (options.tags && options.tags.length > 0) {
      countQuery += ` AND tags.name IN (${options.tags.map(() => '?').join(',')})`;
      countParams.push(...options.tags);
    }

    if (options.searchQuery) {
      countQuery += ` AND (
        blog_posts.title LIKE ? OR 
        blog_posts.content LIKE ? OR 
        users.username LIKE ?
      )`;
      const searchParam = `%${options.searchQuery}%`;
      countParams.push(searchParam, searchParam, searchParam);
    }

    const totalResult = await db.prepare(countQuery).bind(...countParams).first();

    return {
      success: true,
      posts: result.results.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        status: post.status,
        created_at: post.created_at,
        author_id: post.author_id,
        author_name: post.author_name,
        tags: post.tags ? post.tags.split(',') : []
      })),
      pagination: {
        page,
        pageSize,
        total: totalResult.total
      }
    };
  } catch (error) {
    return { 
      success: false, 
      message: `获取文章失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function getAllTags(db: D1Database) {
  try {
    const query = `
      SELECT DISTINCT name 
      FROM tags 
      ORDER BY name
    `;

    const result = await db.prepare(query).all();

    return {
      success: true,
      tags: result.results.map((tag: any) => tag.name)
    };
  } catch (error) {
    return { 
      success: false, 
      message: `获取标签失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function getPostById(db: D1Database, postId: number) {
  try {
    const post = await db.prepare(
      'SELECT * FROM blog_posts WHERE id = ?'
    ).bind(postId).first();

    if (!post) {
      return { 
        success: false, 
        message: '文章不存在' 
      };
    }

    return { 
      success: true, 
      post: {
        ...post,
        tags: JSON.parse(post.tags || '[]')
      }
    };
  } catch (error) {
    return { 
      success: false, 
      message: `获取文章失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function updatePost(db: D1Database, postId: number, post: Partial<BlogPost>) {
  try {
    const updateFields: string[] = [];
    const params: any[] = [];

    if (post.title) {
      updateFields.push('title = ?');
      params.push(post.title);
    }

    if (post.content) {
      updateFields.push('content = ?');
      params.push(post.content);
    }

    if (post.tags) {
      updateFields.push('tags = ?');
      params.push(JSON.stringify(post.tags));
    }

    if (post.status) {
      updateFields.push('status = ?');
      params.push(post.status);
    }

    updateFields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(postId);

    const result = await db.prepare(
      `UPDATE blog_posts SET ${updateFields.join(', ')} WHERE id = ?`
    ).bind(...params).run();

    return { 
      success: true, 
      message: '文章更新成功' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `文章更新失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function deletePost(db: D1Database, postId: number) {
  try {
    await db.prepare(
      'DELETE FROM blog_posts WHERE id = ?'
    ).bind(postId).run();

    return { 
      success: true, 
      message: '文章删除成功' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `文章删除失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function getPostArchives(db: D1Database) {
  try {
    const query = `
      SELECT 
        strftime('%Y', created_at) as year,
        strftime('%m', created_at) as month,
        COUNT(*) as post_count,
        GROUP_CONCAT(
          json_object(
            'id', id, 
            'title', title, 
            'created_at', created_at
          )
        ) as posts
      FROM blog_posts
      WHERE status = 'published'
      GROUP BY year, month
      ORDER BY year DESC, month DESC
    `;

    const result = await db.prepare(query).all();

    return {
      success: true,
      archives: result.results.map((archive: any) => ({
        year: archive.year,
        month: archive.month,
        postCount: archive.post_count,
        posts: JSON.parse(`[${archive.posts}]`)
      }))
    };
  } catch (error) {
    return { 
      success: false, 
      message: `获取文章归档失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function getPostsByYearMonth(
  db: D1Database, 
  year: string, 
  month: string
) {
  try {
    const query = `
      SELECT 
        id, 
        title, 
        content, 
        created_at,
        (SELECT GROUP_CONCAT(tags.name) 
         FROM post_tags 
         JOIN tags ON post_tags.tag_id = tags.id 
         WHERE post_tags.post_id = blog_posts.id
        ) as tags
      FROM blog_posts
      WHERE 
        status = 'published' AND
        strftime('%Y', created_at) = ? AND 
        strftime('%m', created_at) = ?
      ORDER BY created_at DESC
    `;

    const result = await db.prepare(query).bind(year, month).all();

    return {
      success: true,
      posts: result.results.map((post: any) => ({
        id: post.id,
        title: post.title,
        content: post.content,
        created_at: post.created_at,
        tags: post.tags ? post.tags.split(',') : []
      }))
    };
  } catch (error) {
    return { 
      success: false, 
      message: `获取指定年月文章失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

// 性能优化：缓存热门文章和标签
export async function getPopularPosts(
  db: D1Database, 
  limit: number = 5
) {
  try {
    const query = `
      SELECT 
        id, 
        title, 
        (SELECT COUNT(*) FROM comments WHERE comments.post_id = blog_posts.id) as comment_count
      FROM blog_posts
      WHERE status = 'published'
      ORDER BY comment_count DESC
      LIMIT ?
    `;

    const result = await db.prepare(query).bind(limit).all();

    return {
      success: true,
      popularPosts: result.results
    };
  } catch (error) {
    return { 
      success: false, 
      message: `获取热门文章失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function getPopularTags(
  db: D1Database, 
  limit: number = 10
) {
  try {
    const query = `
      SELECT 
        tags.name, 
        COUNT(post_tags.post_id) as post_count
      FROM tags
      JOIN post_tags ON tags.id = post_tags.tag_id
      JOIN blog_posts ON post_tags.post_id = blog_posts.id
      WHERE blog_posts.status = 'published'
      GROUP BY tags.name
      ORDER BY post_count DESC
      LIMIT ?
    `;

    const result = await db.prepare(query).bind(limit).all();

    return {
      success: true,
      popularTags: result.results.map((tag: any) => ({
        name: tag.name,
        count: tag.post_count
      }))
    };
  } catch (error) {
    return { 
      success: false, 
      message: `获取热门标签失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}
