"use client"
import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button, Layout, Menu, theme, Dropdown, Space, message, Modal, Form, Input } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import { useRouter } from "next/navigation";
import { parse } from 'cookie'
import { remove } from '../actions';

const items = [
  {
    label: '退出登陆',
    key: 'signOut',
  },
  {
    label: '修改密码',
    key: 'editInfo',
  },
];

const { Header, Sider, Content } = Layout;
const App = (props: any) => {
  const { children } = props;
  const [collapsed, setCollapsed] = useState(false);
  const [visible, setVisible] = useState(false)
  const router = useRouter();
  const pathname = usePathname().replace(/\//, '');

  useEffect(() => {
    fetch('/api/auth').then(res => res.json()).then(res => {
      if (res.status !== 200) {
        router.push('/signIn')
      } else {
        localStorage.setItem('permission', res.data.permission)
      }
    })
  }, [])

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const showDialog = () => {
    setVisible(true)
  }

  const cookies = parse(document?.cookie || '')

  const onClick = async ({ key }) => {
    switch (key) {
      case 'signOut':
        await remove()
        router.push('/signIn');
        break;
      case 'editInfo':
        showDialog();
        break;
      default:
        break;
    }
  };

  const submit = async (values) => {
    const { password, newPassword, confirmPassword, currentPassword } = values
    if (confirmPassword !== newPassword) {
      message.error('两次密码不一致，请重新输入')
      return
    }

    const result = fetch('/api/logIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: cookies?.name,
        newPassword,
        password,
        currentPassword,
        type: 'modifyPassword'
      })
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          message.success(res.message)
          setVisible(false)
          router.push('/signIn')
        } 
        else {
          message.error(res.message)
          console.log(1111);
          
        }
      })
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          items={[
            {
              key: 'notice',
              icon: <UserOutlined />,
              label: <Link href='/notice'>公告信息</Link>,
            },
            {
              key: 'student',
              icon: <VideoCameraOutlined />,
              label: <Link href='/student'>学生信息</Link>,
            },
            {
              key: 'users',
              icon: <UploadOutlined />,
              label: <Link href='/users'>基本信息</Link>,
            },
            {
              key: 'course',
              icon: <UploadOutlined />,
              label: <Link href='/course'>课程信息</Link>,
            },
            {
              key: 'score',
              icon: <UploadOutlined />,
              label: <Link href='/score'>成绩管理</Link>,
            },
            {
              key: 'chooseClass',
              icon: <UploadOutlined />,
              label: <Link href='/chooseClass'>选课管理</Link>,
            },
            {
              key: 'class',
              icon: <UploadOutlined />,
              label: <Link href='/class'>班级管理</Link>,
            },
            // {
            //   key: 'auth',
            //   icon: <UploadOutlined />,
            //   label: <Link href='/auth'>权限管理</Link>,
            // },
          ]}
          selectedKeys={[pathname]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <Dropdown
              menu={{
                items, onClick
              }}>
              <Space style={{
                marginRight: 20,
              }}>
                <SettingOutlined />设置
              </Space>
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 800,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Modal footer={false} onCancel={() => setVisible(false)} title='修改密码' open={visible}>
          <Form onFinish={submit}>
            <Form.Item label='用户名' name='username'>
              <Input defaultValue={cookies?.name} disabled />
            </Form.Item>
            <Form.Item label='当前密码' name='currentPassword'>
              <Input.Password />
            </Form.Item>
            <Form.Item label='新密码' name='newPassword'>
              <Input.Password />
            </Form.Item>
            <Form.Item label='确认密码' name='confirmPassword'>
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                确认
              </Button>
              <Button onClick={() => setVisible(false)}>
                取消
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
    </Layout >
  );
};

export default App;
