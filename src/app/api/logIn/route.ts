import connectDB from '../../../../mongoose';
import { UserModel } from '../../models/Model';
import bcrypt from 'bcrypt';
import { NextApiRequest, NextApiResponse } from 'next';
import { create, remove } from '@/app/actions';


export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const body = await req.json();
    const { type } = body
    if (type) {
      const { username, newPassword, currentPassword } = body;

      const user = await UserModel.findOne({ username });
      if (!user) {
        throw new Error('用户未找到');
      }
      // 验证当前密码
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return Response.json({ status: 404, message: '当前密码不正确' });
      }
      // 哈希新密码
      const hashedPassword = bcrypt.hashSync(newPassword, 10);
      const res = bcrypt.compareSync(newPassword, hashedPassword)
      // 更新密码
      try {
        const result = await UserModel.findOneAndUpdate(
          { username },
          { password: hashedPassword },
          { new: true, runValidators: true } // 返回更新后的文档并运行验证
        ).exec();
        
        if (result) {
          remove()
        }
        // 返回更新后的用户信息
        return Response.json({ status: 200, message: '密码更新成功' });
      } catch (error) {
        return Response.json({ status: 500, message: '密码更新失败，请稍后再试' });
      }
    } else {
      const { username, password } = body || {};
      const result = await UserModel.findOne({ username }).exec();
      const isMatch = bcrypt.compareSync(password, result.password);
      console.log(password, result.password);

      if (!!result && !!isMatch) {
        create(result);
        return Response.json({ status: 200, message: '登陆成功', })
      } else {
        return Response.json({ status: 401, message: '用户名或密码错误' });
      }
    }
  } catch (error) {
    return Response.json({ status: 500, message: '登陆失败，请稍后再试' });
  }
}
