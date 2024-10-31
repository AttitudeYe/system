import connectDB from '../../../../mongoose';
import { NoticeModel } from '@/app/models/Model';
import bcrypt from 'bcrypt';

connectDB();

// 查询
export async function POST(req, res) {
  try {
    const body = await req.json();
    const { type, _id } = body || {};
    switch (type) {
      case 'search':
        const { creator, title, current, pageSize } = body || {};
        const query = {};
        // 检查传入的条件并构建查询对象
        if (creator) {
          query.creator = creator; // 假设 creator 是传入的条件
        }
        if (title) {
          query.title = title; // 假设 title 是传入的条件
        }
        // 如果没有任何条件，给出默认值以过滤掉不存在的文档
        if (Object.keys(query).length === 0) {
          query.creator = { $exists: false }; // 这里可以根据需要调整
          query.title = { $exists: false };
          // 这里可以根据需要调整
        }

        // 分页参数
        const page = parseInt(current) || 1; // 从请求中获取当前页码
        const limit = parseInt(pageSize) || 10; // 从请求中获取每页记录数
        const skip = (page - 1) * limit; // 计算跳过的记录数
        if (creator || title) {
          const result = await NoticeModel.find({
            ...query
          })
              .skip(skip) // 跳过的记录数
              .limit(limit) // 限制每页的记录数
              .exec()
          return Response.json({
            message: '查询成功',
            data: result ?? []
          })
        } else {
          const result = await NoticeModel.find().skip(skip) // 跳过的记录数
              .limit(limit) // 限制每页的记录数
              .exec();
          const totalCount = await NoticeModel.countDocuments().exec();
          // 返回结果和分页信息
          return Response.json({
            status: 200,
            message: '查询成功',
            data: result ?? [],
            total: totalCount,
          })
        }
      case 'create':
        try {
          await NoticeModel.create({
            ...body || {}
          })
          const result = await NoticeModel.find({});
          if (result) {
            return  Response.json({
              status: 200,
              message: '新增成功',
              success: true,
            })
          } else {
            return Response.json({
              status: 404,
              message: '新增失败',
              success: false,
            })
          }
        } catch (error) {
          return Response.json({
            status: 404,
            message: error,
            success: false,
          })
        }
      case 'update':
        try {
          const { title, content, creator, time } = body || {}
          const updateResult = await NoticeModel.findOneAndUpdate({
            _id: _id
          }, { title, content, creator, time });
          if (updateResult) { // 检查是否有文档被更新
            const result = await NoticeModel.find({});
            return Response.json({
              status: 200,
              message: '更新成功',
              data: result, // 返回更新后的数据
              success: true,
            });
          } else {
            return Response.json({
              status: 404,
              message: '没有找到要更新的记录',
              success: false,
            });
          }
        } catch (error) {
          return Response.json({
            status: 500, // 通常更新错误是 500 状态
            message: error.message || '更新失败',
            success: false,
          });
        }
    }
  } catch (error) {

    return Response.json({
      status: 500,
      message: '新增失败',
      success: false,
    })
  }
}

// 删除
export async function DELETE(req: Request) {
  const { _id } = await req.json();
  try {
    const result = await NoticeModel.findByIdAndDelete(_id);
    if (!result) {
      return Response.json({
        status: 404,
        message: '删除失败',
        success: false,
      })
    }
    return Response.json({
      status: 200,
      message: '删除成功',
      success: true,
    })
  } catch (error) {
    return Response.json({
      status: 500,
      message: error,
      success: false,
    })
  }
}

