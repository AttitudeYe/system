"use client";
import React, { useEffect, useState } from 'react'
import { parse } from 'cookie'
import { Input, Button, Modal, Form, Upload, message, Avatar } from 'antd'

const constant = [
  {
    label: '头像：',
    value: 'avatar'
  },
  {
    label: '学生姓名：',
    value: 'username'
  },
  {
    label: '年级：',
    value: 'grade'
  },
  {
    label: '性别：',
    value: 'sex'
  },
  {
    label: '手机号码：',
    value: 'telphone'
  },
  {
    label: '邮箱地址：',
    value: 'email'
  },
  {
    label: '家庭住址：',
    value: 'address'
  },
  {
    label: '政治面貌：',
    value: 'politicalAffiliation'
  },
]


const cookies = parse(document?.cookie || '')



const ModalForm = ({ dataSource, setOpen }) => {

  const [form] = Form.useForm();

  const [fileList, setFileList] = useState<any>([])
  // const [thumbUrl, setThumbUrl] = useState<any>(null)
  const [fileUrl, setFileUrl] = useState<any>(null)

  useEffect(() => {
    form.setFieldsValue(dataSource)
    setFileList([
      {
        uid: '-1',
        name: dataSource.avatar,
        status: 'done',
        url: dataSource.avatar,
        thumbUrl: dataSource.avatar,
      },
    ])
    setFileUrl(dataSource.avatar)
  },[dataSource,setOpen])
  const submit = (values) => {
    console.log(values, '--->>>>')
    fetch(`/api/userInfo?username=${cookies.name}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...values,
        avatar: fileUrl
      })
    }).then(res => res.json()).then((res) => {
      if (res.success) {
        setOpen(false);
        setFileUrl(null)
        message.success(res.message)
      }
    })
  }
  const handleClick = (file) => {
    console.log(file)
    const formData = new FormData();
    formData.append('file', file?.originFileObj);
    fetch('api/uploads', {
      method: 'POST',
      body: formData,
    }).then(res => res.json()).then(res => {
      setFileUrl(res.fileUrl)
      if (file) {
        file.status = 'done';
      }
    }
    )
  }

  return <Form form={form} onFinish={submit} >

    <Form.Item rules={[{ required: true, message: '请上传头像' }]} label="头像">
      <Upload
        action='api/upload'
        onChange={(info) => {
          setFileList(info.fileList);
          handleClick(info.file)
        }}
        method='post'
        fileList={fileList}
        listType="picture-circle"
        maxCount={1}
      >
        <Button>上传头像</Button>
      </Upload>
      {/* {thumbUrl && <img src={thumbUrl} alt="Uploaded Image" />} */}
      {/* <input type="file" onChange={(e) => {
        console.log(e, '---eee')
        handleClick(e?.target?.files[0])
      }} */}
    </Form.Item>
    <Form.Item rules={[{ required: true, message: '请填写年级' }]} label="年级" name="grade">
      <Input placeholder="年级" />
    </Form.Item>
    <Form.Item rules={[{ required: true, message: '请填写性别' }]} label="性别" name="sex">
      <Input placeholder="性别" />
    </Form.Item>
    <Form.Item rules={[{ required: true, message: '请填写手机号码' }]} label="手机号码" name="telphone">
      <Input placeholder="手机号码" />
    </Form.Item>
    <Form.Item rules={[{ required: true, message: '请填写邮箱地址' }]} label="邮箱地址" name="email">
      <Input placeholder="邮箱地址" />
    </Form.Item>
    <Form.Item rules={[{ required: true, message: '请填写家庭地址' }]} label="家庭地址" name="address">
      <Input placeholder="家庭地址" />
    </Form.Item>
    <Form.Item rules={[{ required: true, message: '请填写政治面貌' }]} label="政治面貌" name="politicalAffiliation">
      <Input placeholder="政治面貌" />
    </Form.Item>
    <Form.Item>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Button type="primary" htmlType="submit" style={{ marginRight: 20 }}>
          提交
        </Button>
        <Button onClick={() => form.resetFields()}>
          重置
        </Button>
      </div>
    </Form.Item>
  </Form>
}


const Users = () => {
  const [dataSource, setDataSource] = useState<any>([])
  const [open, setOpen] = useState(false)
  useEffect(() => {
    fetch(`/api/userInfo?username=${cookies.name}`).then(res => res.json()).then(data => {
      setDataSource(data.data)
    })
  }, [open])


  return <div>
    <h3 style={{ fontSize: '30px', margin: '10px 0' }}>个人信息</h3>
    {
      constant.map((item, index) => {
        if (item.value === 'avatar') {
          return <div key={index}>
            {/* <p style={{ fontSize: '20px', margin: '10px 0' }}>{item.label}{dataSource[item.value]}</p> */}
            <img src={dataSource[item.value]} alt="avatar" style={{ width: '100px', height: '100px' }} />
          </div>
        }
        return <div key={index}>
          <p style={{ fontSize: '20px', margin: '10px 0' }}>{item.label}{dataSource[item.value]}</p>
        </div>
      })
    }
    <Button type='primary' onClick={() => setOpen(true)} >编辑基本信息</Button>
    <Modal
      title='编辑基本信息'
      open={open}
      footer={false}
      onCancel={() => {
        setOpen(false)
        // setFileList([])
        // setFileUrl(null)
      }}
    >
      <ModalForm dataSource={dataSource} setOpen={setOpen}/>
    </Modal>
  </div>
}

export default Users