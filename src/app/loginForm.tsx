"use client";
import React, { useEffect } from "react";
// import { signIn } from "next-auth/react";
import useFormState from "./hooks";
import { message } from 'antd';
import logIn from "./utils/logIn";
import { useRouter } from "next/navigation";
// import bcrypt from 'bcrypt';

const LoginForm = (props: any) => {
  const router = useRouter();
  const { state, error, actions } = useFormState(logIn, {
    onSuccess: () => {
      router.push('/')
    }
  })


  return (
    <form action="#" method="POST" className="space-y-4" onSubmit={actions} >
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">用户名:</label>
        <input required type="text" id="username" name="username" className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">密码:</label>
        <input required type="password" id="password" name="password" className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
      </div>
      {
        error && <div className="text-red-500">{error}</div>
      }
      <>
        <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">登录</button>
        <p className="
            items-center
            justify-center
            mt-10
            text-center text-md text-gray-500
        ">
          <span>还没有账号？</span>
          <span
            className="
            text-indigo-400
            hover:text-blue-500
            no-underline
            hover:underline
            cursor-pointer
            transition
            ease-in
            duration-300
          "
            onClick={() => {
              props.setKey('logIn')
            }}
          >
            立即注册
          </span>
        </p></>

    </form>
  )
}
export default LoginForm;
