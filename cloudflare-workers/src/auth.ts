import { D1Database } from '@cloudflare/workers-types';
import * as jose from 'jose';

interface User {
  id?: number;
  username: string;
  email: string;
  password: string;
}

export async function registerUser(db: D1Database, user: User) {
  try {
    // 检查用户是否已存在
    const existingUser = await db.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(user.email).first();

    if (existingUser) {
      return { success: false, message: '用户已存在' };
    }

    // 密码哈希（使用 Cloudflare Workers 推荐的 crypto API）
    const hashedPassword = await hashPassword(user.password);

    // 插入新用户
    const result = await db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    ).bind(user.username, user.email, hashedPassword).run();

    return { 
      success: true, 
      message: '注册成功',
      userId: result.lastRowId 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `注册失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function loginUser(db: D1Database, email: string, password: string) {
  try {
    // 查找用户
    const user = await db.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first() as User;

    if (!user) {
      return { success: false, message: '用户不存在' };
    }

    // 验证密码
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: '密码错误' };
    }

    // 生成 JWT
    const token = await generateJWT(user);

    return { 
      success: true, 
      message: '登录成功', 
      token,
      user: { id: user.id, username: user.username, email: user.email }
    };
  } catch (error) {
    return { 
      success: false, 
      message: `登录失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

async function verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
  const hashedInput = await hashPassword(inputPassword);
  return hashedInput === storedHash;
}

async function generateJWT(user: User) {
  const secret = new TextEncoder().encode(
    // 建议从环境变量获取
    'your-256-bit-secret'
  );

  const jwt = await new jose.SignJWT({ 
    userId: user.id, 
    email: user.email 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(secret);

  return jwt;
}

export async function verifyJWT(token: string) {
  try {
    const secret = new TextEncoder().encode('your-256-bit-secret');
    const { payload } = await jose.jwtVerify(token, secret);
    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}
