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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {


    const form = formidable({
        uploadDir: path.join(process.cwd(), 'public', 'uploads'), // 设置上传目录
        keepExtensions: true, // 保留文件扩展名
        maxFileSize: 5 * 1024 * 1024, // 设置最大文件大小为 5MB
    });

    return new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            console.log(fields, files, 'reqqqq');
            const fileUrl = `/uploads/${files.file?.[0]?.newFilename}`;
            resolve(res.status(200).json({ message: '上传成功', fileUrl }));
        });
    })
}