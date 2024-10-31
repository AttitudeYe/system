import connectDB from '../../../../mongoose';
import { UserModel } from '../../models/Model';
import { NextApiRequest, NextApiResponse } from 'next';


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const { url } = req;
    const param = new URLSearchParams(url?.split('?')[1]).get('username')
    try {
        const result = await UserModel.find({ username: param });
        return Response.json({ status: 200, message: '查询成功', data: result[0] });
    } catch (error) {
        return Response.json({ status: 500, message: '查询失败，请稍后再试' });
    }
}

export async function POST(req: Request) {
    await connectDB();
    const { url } = req;
    const body = await req.json();
    const param = new URLSearchParams(url?.split('?')[1]).get('username')
    try {
        const result = await UserModel.findOneAndUpdate({ username: param }, {
            ...body
        }, { new: true });
        console.log(result, body, '----ste');
        return Response.json({ status: 200, message: '更新成功', success: true, data: result });

    } catch (error) {
        return Response.json({ status: 500, message: '查询失败，请稍后再试', success: false });
    }
}
