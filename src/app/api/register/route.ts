import connectDB from '../../../../mongoose';
import { UserModel } from '@/app/models/Model';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

connectDB();

export async function POST(req, res) {
  try {
    // if (req.method === 'POST') {
    const body = await req.json();
    const { username, password } = body || {};
    const result = await UserModel.findOne({ username }).exec();
    if (result) {
      return Response.json({
        status: 400,
        error: '用户名已存在'
      })
    } else {
      const createdUser = new UserModel({
        username,
        password,
      });
      await createdUser.save(); // 保存到数据库\
      return Response.json({
        status: 200, error: '注册成功'
      })
        ;
    }
  } catch (error) {
    return Response.json({ status: 500, error: '注册失败' });
  }
}
