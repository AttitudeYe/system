import connectDB from '../../../../mongoose';
import { ChooseClassModel, UserModel } from '@/app/models/Model';

connectDB();

// 查询
export async function POST(req, res) {
    try {
        const body = await req.json();
        const {
            current,
            pageSize,
            subject1,
            subject2,
            username,
        } = body || {};
        // 分页参数
        const page = parseInt(current) || 1; // 从请求中获取当前页码
        const limit = parseInt(pageSize) || 10; // 从请求中获取每页记录数
        const skip = (page - 1) * limit; // 计算跳过的记录数
        console.log(res, '--->>>')
        const bixiu = await ChooseClassModel.find({
            author: username,
            courseId: subject1,
        })
        console.log(bixiu, '--->>>2')
        const xuanxiu = await ChooseClassModel.find({
            author: username,
            classId: subject2,
        })

        console.log(bixiu, xuanxiu, '--->>>3')
        if (!bixiu.length && !xuanxiu.length) {
            const result = new ChooseClassModel({
                author: username,
                courseId: subject1,
                classId: subject2,
            })
            await result.save();

            return Response.json({
                status: 200,
                message: '新增成功',
                success: true,
            })
        } else if (bixiu.length && xuanxiu.length) {
            return Response.json({
                status: 500,
                message: '这两门课都选过啦',
                success: false,
            })
        } else if (!bixiu) {
            return Response.json({
                status: 400,
                message: '必修课已选',
                success: false,
            })
        } else  {
            return Response.json({
                status: 400,
                message: '选修课已选',
                success: false,
            })
        }

    } catch (error) {
        console.log(error, '---error')
        return Response.json({
            status: 500,
            message: 'error',
            success: false,
        })
    }
}


