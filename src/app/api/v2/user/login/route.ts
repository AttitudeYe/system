import type { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { createEdgeRouter } from "next-connect";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import prisma from "../../../../utils/db";


interface RequestContext {
  body: {
    username: string
    password: string
  }
}

const router = createEdgeRouter<NextRequest, RequestContext>();

router
  .post(async (req) => {
    // console.log(prisma)
    const hashedPassword = await bcrypt.hash('admin', 10);

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        username: "admin",
        password: hashedPassword,
      },
    });
    // conosle.log(req.body)
    // const { username, password } = req.body;
    // const user = await prisma.user.findUnique({ where: { username } });

    // if (!user || !bcrypt.compareSync(password, user.password)) {
    //   return NextResponse.json({ message: '密码错误' });
    // }

    // const token = jwt.sign({ userId: user.id }, 'SG-1453', { expiresIn: '24h' });

    return Response.json({ code: 0 })
  })

export async function POST(request: NextRequest, ctx: RequestContext) {
  return router.run(request, ctx);
}