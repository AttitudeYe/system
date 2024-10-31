"use client";
import React from "react";
import { message } from "antd";

const SignForm = (props: any) => {
  const { setKey } = props;
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const username = formData.get('username');
    const password = formData.get('password');
    // 一个接口，区分注册和登录
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json()).then(res => {
      if (res.status === 200) {
        message.open({
          type: 'success',
          content: '注册成功',
        });
        setKey('logIn');
      } else {
        message.open({
          type: 'error',
          content: res.error,
        });
      }
    }).catch(err => {
      message.open({
        type: 'error',
        content: err.error,
      });
    }
    )
  }

  return (<form action="#" method="POST" className="space-y-4" onSubmit={submit}>
    <div>
      <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
      <input required type="text" id="username" name="username" className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
    </div>
    <div>
      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
      <input required type="password" id="password" name="password" className="mt-1 p-2 w-full border rounded-md focus:border-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-300" />
    </div>
    <button type="submit" className="w-full bg-black text-white p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors duration-300">注册</button>

  </form>)
}

export default SignForm;
