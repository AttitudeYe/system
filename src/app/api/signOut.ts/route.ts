import { remove } from '@/app/actions';

/**
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */

export async function POST(req, res) {
  try {
    const res = await remove()
    console.log(res, '--->>>res');
    
    return Response.json({
      status: 200,
      message: '退出成功'
    })
  } catch(err) {
    return Response.json({
      status: 500,
      message: err
    })
  }
}
