import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'

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
    const { success, error } = await c.env.DB
      .prepare('SELECT * FROM users WHERE email = ?')
      .bind(email)
      .first()

    if (error) {
      return c.json({ success: false, message: '数据库查询错误' }, 500)
    }

    // 验证密码（实际应使用安全的密码哈希）
    if (!user || user.password !== password) {
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

export default app
