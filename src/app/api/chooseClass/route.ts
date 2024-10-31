import connectDB from '../../../../mongoose';
import { ChooseClassModel, UserModel, CourseInfoModel } from '@/app/models/Model';

connectDB();

// 查询
export async function POST(req, res) {
    try {
        const body = await req.json();
        const {
            current,
            pageSize,
            studentId,
            subjectId,
        } = body || {};
        // 分页参数
        const page = parseInt(current) || 1; // 从请求中获取当前页码
        const limit = parseInt(pageSize) || 10; // 从请求中获取每页记录数
        const skip = (page - 1) * limit; // 计算跳过的记录数
        const result = await ChooseClassModel.find((subjectId && studentId) ? {
            author: studentId,
            $or: [
                { courseId: subjectId },
                { classId: subjectId },
            ],
        } : {})
            .populate('author', 'username')
            .populate('courseId', 'subject')
            .populate('classId', 'subject')
            .skip(skip) // 跳过的记录数
            .limit(limit) // 限制每页的记录数
            .exec()
        const formatResult = result.map((item) => {
            return {
                username: item.author.username,
                usernameId: item.author._id,
                subject: item.courseId.subject,
                subjectId: item.courseId._id,
                classId: item.classId.subject,
                classNo: item.classId._id,
            }
        })

        return Response.json({
            status: 200,
            message: '查询成功',
            data: formatResult ?? []
        })
    } catch (error) {
        return Response.json({
            status: 500,
            message: 'error',
            success: false,
        })
    }
}



export async function DELETE(req: Request) {

    try {

        const body = await req.json();
        const {
            current,
            pageSize,
            usernameId,
            subjectId,
            classNo,
        } = body || {};
        console.log('body', body)

        // 分页参数
        const page = parseInt(current) || 1; // 从请求中获取当前页码
        const limit = parseInt(pageSize) || 10; // 从请求中获取每页记录数
        const skip = (page - 1) * limit; // 计算跳过的记录数

        const result = await ChooseClassModel.findOneAndDelete({
            author: usernameId,
            courseId: subjectId,
            classId: classNo,
        })

        console.log(result, '--->>.delte')

        if (result) {
            return Response.json({
                status: 200,
                message: '删除成功',
                success: true,
            })
        } else {
            return Response.json({
                status: 200,
                message: '删除失败',
                success: false,
            })
        }

    } catch (error) {
        return Response.json({
            status: 500,
            message: 'error',
            success: false,
        })
    }
}


