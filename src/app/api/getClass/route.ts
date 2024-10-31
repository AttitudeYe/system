import connectDB from '../../../../mongoose';
import { CourseInfoModel } from '../../models/Model';
import { NextApiRequest, NextApiResponse } from 'next';


export async function GET(req: NextApiRequest, res: NextApiResponse) {
    await connectDB();
    const { url } = req;
    const param = new URLSearchParams(url?.split('?')[1]).get('isMandatory')

    try {
        const result = await CourseInfoModel.find(param ? { isMandatory: param } : {});
        

        const formatUserRes = result.map((item) => {
            return {
                value: item._id,
                label: item.subject
            }
        })
        return Response.json({ status: 200, message: '查询成功', data: formatUserRes ?? [] });
    } catch (error) {
        return Response.json({ status: 500, message: '登陆失败，请稍后再试' });
    }
}
