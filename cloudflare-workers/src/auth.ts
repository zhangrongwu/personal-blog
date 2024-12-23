import { D1Database } from '@cloudflare/workers-types';
import * as jose from 'jose';
import * as bcrypt from 'bcryptjs';

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

    // 哈希密码
    const hashedPassword = await bcrypt.hash(user.password, 10);

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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return { success: false, message: '密码错误' };
    }

    // 生成 JWT
    const token = await new jose.SignJWT({ 
      userId: user.id, 
      email: user.email 
    })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('2h')
    .sign(new TextEncoder().encode('your-256-bit-secret'));

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

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jose.jwtVerify(
      token, 
      new TextEncoder().encode('your-256-bit-secret')
    );
    return { valid: true, payload };
  } catch {
    return { valid: false, payload: null };
  }
}
