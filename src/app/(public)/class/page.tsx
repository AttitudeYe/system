"use client";
import React, { Fragment, useCallback, useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Modal, DatePicker, message } from 'antd';
import { useAntdTable } from 'ahooks';
import dayjs from "dayjs";

interface Item {
  name: {
    last: string;
  };
  email: string;
  phone: string;
  gender: 'male' | 'female';
}

interface Result {
  total: number;
  list: Item[];
}

const getTableData = ({ current, pageSize }, formData: Object,): Promise<Result> => {

  return fetch('/api/class', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...formData,
      current,
      pageSize,
      type: 'search'
    })
  })
    .then((res) => res.json())
    .then((res) => {
      return {
        total: res.total,
        list: res.data,
      }
    });
};

const ClassPage = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [isModify, setIsModify] = useState(false);

  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });
  const { submit, reset } = search;

  const remove = (record: any) => {
    const { _id } = record;
    fetch('/api/class', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        _id
      })
    }).then(res => res.json()).then((res) => {
      if (res.success) {
        message.success(res.message)
      } else {
        message.error(res.message)
      }
      submit()
      return {
        total: res.total,
        list: res.data,
      }
    })
  }

  const edit = (record: any) => {
    setOpen(true);
    setInitialValue({
      ...record,
      time: dayjs(record.time)
    })
    setIsModify(true)
  }

  const columns = [
    {
      title: '学号',
      dataIndex: 'studentId',
      fixed: 'left',
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      fixed: 'left',
    },
    {
      title: '班级',
      dataIndex: 'class',
    },
    {
      title: '专业',
      dataIndex: 'major',
    },
    {
      title: '联系方式',
      dataIndex: 'telphone',
    },
    {
      title: '班主任',
      dataIndex: 'teacher',
    },
    {
      title: '年级段',
      dataIndex: 'grade',
    },
    {
      title: '操作',
      fixed: 'right',
      render: (text, record) => {
        return (
          <Fragment>
            <Button onClick={() => { remove(record) }} type={'link'}>删除</Button>
            <Button type={'link'} onClick={() => { edit(record) }}>编辑</Button>
          </Fragment>
        )
      }
    },
  ];

  const advanceSearchForm = (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="班级" name="class">
            <Input placeholder="班级" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="班主任" name="teacher">
            <Input placeholder="班主任" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="专业" name="major">
            <Input placeholder="专业" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="学生姓名" name="studentName">
            <Input placeholder="学生姓名" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24} justify="end" style={{ marginBottom: 24 }}>
        <Button type="primary" onClick={submit}>
          查询
        </Button>
        <Button onClick={reset} style={{ marginLeft: 16 }}>
          重置
        </Button>
        {/* <Button type="link" onClick={changeType}>
            高级搜索
          </Button> */}
      </Row>
    </Form>
  );

  const ModalForm = ({ refresh }) => {
    const [form] = Form.useForm();
    const submit = (values) => {
      fetch('/api/notice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: isModify ? 'update' : 'create',
          ...values,
          _id: initialValue?._id || null
        })
      }).then(res => res.json()).then((res) => {
        if (res.success) {
          setOpen(false);
          refresh()
          message.success(res.message)
        }
      })
    }
    return <Form initialValues={initialValue} form={form} onFinish={submit} >
      <Form.Item rules={[{ required: true, message: '请填写标题名称' }]} label="标题名称" name="title">
        <Input placeholder="标题名称" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写创建人' }]} label="创建人" name="creator">
        <Input placeholder="创建人" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写内容' }]} label="内容" name="content">
        <Input placeholder="创建人" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写创建时间' }]} label="创建时间" name="time">
        <DatePicker style={{
          width: '100%'
        }} placeholder="创建时间" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
        <Button onClick={() => form.resetFields()}>
          Reset
        </Button>
      </Form.Item>
    </Form>
  }

  // 新增公告
  const addNotice = () => {
    setOpen(true)
  };

  return (
    <div>
      {advanceSearchForm}
      <Button type='primary' style={{
        marginBottom: 6
      }} onClick={() => {
        addNotice()
        setIsModify(false)
        setInitialValue({})
      }}>新建</Button>
      <Table columns={columns} rowKey="email" style={{ overflow: 'auto' }} {...tableProps} />
      <Modal
        title={isModify ? '编辑公告' : '创建公告'}
        open={open}
        footer={false}
        onCancel={() => setOpen(false)}
      >
        <ModalForm refresh={submit} />
      </Modal>
    </div>
  );
};

export default ClassPage;