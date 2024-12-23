import { D1Database } from '@cloudflare/workers-types';
import { verifyJWT } from './auth';

export interface Comment {
  id?: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at?: string;
  updated_at?: string;
}

export async function createComment(
  db: D1Database, 
  postId: number, 
  userId: number, 
  content: string
) {
  try {
    const result = await db.prepare(
      'INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)'
    ).bind(postId, userId, content).run();

    return { 
      success: true, 
      message: '评论发布成功', 
      commentId: result.lastRowId 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `评论发布失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function getCommentsByPostId(
  db: D1Database, 
  postId: number, 
  options: { 
    page?: number, 
    pageSize?: number 
  } = {}
) {
  try {
    const page = options.page || 1;
    const pageSize = options.pageSize || 10;
    const offset = (page - 1) * pageSize;

    // 获取评论和用户信息
    const query = `
      SELECT 
        comments.id, 
        comments.content, 
        comments.created_at,
        users.username,
        users.avatar
      FROM comments
      JOIN users ON comments.user_id = users.id
      WHERE comments.post_id = ?
      ORDER BY comments.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const result = await db.prepare(query).bind(postId, pageSize, offset).all();

    // 获取总数
    const countQuery = `
      SELECT COUNT(*) as total 
      FROM comments 
      WHERE post_id = ?
    `;
    const totalResult = await db.prepare(countQuery).bind(postId).first();

    return {
      success: true,
      comments: result.results.map((comment: any) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        user: {
          username: comment.username,
          avatar: comment.avatar
        }
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
      message: `获取评论失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function updateComment(
  db: D1Database, 
  commentId: number, 
  userId: number, 
  content: string
) {
  try {
    // 先检查评论是否属于当前用户
    const checkOwnership = await db.prepare(
      'SELECT user_id FROM comments WHERE id = ?'
    ).bind(commentId).first();

    if (!checkOwnership || checkOwnership.user_id !== userId) {
      return { 
        success: false, 
        message: '无权修改此评论' 
      };
    }

    const result = await db.prepare(
      'UPDATE comments SET content = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).bind(content, commentId).run();

    return { 
      success: true, 
      message: '评论更新成功' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `评论更新失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}

export async function deleteComment(
  db: D1Database, 
  commentId: number, 
  userId: number
) {
  try {
    // 先检查评论是否属于当前用户
    const checkOwnership = await db.prepare(
      'SELECT user_id FROM comments WHERE id = ?'
    ).bind(commentId).first();

    if (!checkOwnership || checkOwnership.user_id !== userId) {
      return { 
        success: false, 
        message: '无权删除此评论' 
      };
    }

    await db.prepare(
      'DELETE FROM comments WHERE id = ?'
    ).bind(commentId).run();

    return { 
      success: true, 
      message: '评论删除成功' 
    };
  } catch (error) {
    return { 
      success: false, 
      message: `评论删除失败: ${error instanceof Error ? error.message : '未知错误'}` 
    };
  }
}
