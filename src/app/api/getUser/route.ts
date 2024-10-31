import connectDB from '../../../../mongoose';
import { UserModel } from '../../models/Model';
import { NextApiRequest, NextApiResponse } from 'next';


export async function GET(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  try {
    const result = await UserModel.find();
    const formatUserRes = result.map((item) => {
        return {
            value: item._id,
            label: item.username
        }
    })
    return Response.json({ status: 200, message: '查询成功', data: formatUserRes ?? [] });
  } catch (error) {
    return Response.json({ status: 500, message: '登陆失败，请稍后再试' });
  }
}
