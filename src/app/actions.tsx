'use server'

import { cookies } from 'next/headers'

export async function create(data: any) {
  const date = new Date(Date.now() + 60 * 60 * 2) // 2 hours
  cookies().set('name', data.username, {
    maxAge: date.getTime(),
    path: '/',
    sameSite: 'lax',
    secure: true,
  })
  cookies().set('id', data._id)
}

export async function get() {
  const cookieStore = cookies()
  const data = cookieStore.getAll()
  return data
}

export async function has(param: any) {
  const cookieStore = cookies()
  const res = await cookieStore.has(param)
  return res
}

export async function remove() {
  const cookieStore = cookies()
  const res = await cookieStore.delete('name')
  return res
}


