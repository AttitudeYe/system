import connectDB from '../../../../mongoose';
import { UserModel } from '@/app/models/Model';
import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { errors as formidableErrors } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: Request) {

    await connectDB();
    const { url } = req;
    const param = new URLSearchParams(url?.split('?')[1]).get('username')
    const form = formidable({
        multiples: true,
    });

    try {
        const [fields, files] = await form.parse(await req.arrayBuffer());
        const contentLength = req.headers.get('content-length');
        if (!contentLength) {
            return Response.json({ message: 'xxx', status: 500, success: false });
        }
        console.log(fields, files, '----222')
    } catch (err) {
        // example to check for a very specific error
        // if (err.code === formidableErrors.maxFieldsExceeded) {

        // }
        console.error(err, '---err');
        return;
    }
    // form.parse(req, async (err, fields, files) => {
    //     console.log(req, 'reqqqq');
    //     if (err) {
    //         return Response.json({ message: 'Error parsing form data', status: 500, success: false });
    //     }

    //     const file = files.file as formidable.File;

    //     if (!file) {
    //         return Response.json({ message: 'No file uploaded', status: 400, success: false });
    //     }

    //     const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    //     const filePath = path.join(uploadDir, file.name);

    //     // 创建上传目录（如果不存在）
    //     if (!fs.existsSync(uploadDir)) {
    //         fs.mkdirSync(uploadDir, { recursive: true });
    //     }

    //     // 将文件移动到上传目录
    //     fs.renameSync(file.path, filePath);

    //     // 返回文件的 URL
    //     const fileUrl = `/uploads/${file.name}`;
    //     Response.json({ message: '上传成功', status: 200, success: true, fileUrl });
    // });
}