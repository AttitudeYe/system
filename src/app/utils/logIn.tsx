'use client';
import React from "react";
import { message } from "antd";

const logIn = async (formData: FormData) => {
  try {
    const username = formData.get('username')
    const password = formData.get('password') as string

    if (!username || !password) {
      // throw new Error('Please fill in all fields')
      return {
        error: '用户名或密码不能为空'
      }
    }

    const result = await fetch('/api/logIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    }).then(res => res.json())
    .then(res => {
      return {
        status: res.status,
        message: res.message
      }
      ;
    })
    return result

  } catch (error) {
    return {
      status: 500,
      message: '服务器错误'
    }
  }
}

export default logIn;
