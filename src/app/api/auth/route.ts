import connectDB from '../../../../mongoose';
import { cookies } from 'next/headers';
import { UserModel } from '@/app/models/Model';
import { get } from '@/app/actions';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

connectDB();

export async function GET(req, res) {
	try {
		const user = cookies().get('name')?.value
		if (user) {
			const result = await UserModel.findOne({ username: user });
			if (result) {
				return Response.json({ status: 200, data: {
					username: result.username,
					permission: result.permission
				} });
			} else {
				return Response.json({ status: 404, error: '获取信息失败' });
			}
		}

	} catch (error) {
		return Response.json({ status: 500, error: '获取信息失败' });
	}
}
