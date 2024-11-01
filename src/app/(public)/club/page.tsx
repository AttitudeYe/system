"use client";
import React, { Fragment, useCallback, useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Modal, Select, message } from 'antd';
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

  return fetch('/api/notice', {
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

const NoticePage = () => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const [initialValue, setInitialValue] = useState({});
  const [isModify, setIsModify] = useState(false);

  const { tableProps, search, params } = useAntdTable(getTableData, {
    defaultPageSize: 5,
    form,
  });
  const { changeType, submit, reset } = search;

  const remove = (record: any) => {
    const { _id } = record;
    fetch('/api/notice', {
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
      title: '社团名称',
      dataIndex: 'clubName',
    },
    {
      title: '社团成员',
      dataIndex: 'clubMember',
    },
    {
      title: '社团简介',
      dataIndex: 'clubIntro',
    },
    {
      title: '操作',
      render: (value, record) => {
        return <Fragment>
          <Button onClick={() => { remove(record) }} type={'link'}>删除</Button>
          <Button type={'link'} onClick={() => { edit(record) }}>编辑</Button>
        </Fragment>
      }
    },
  ];

  const advanceSearchForm = (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="社团名称" name="clubName">
            <Input placeholder="社团名称" />
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
      <Form.Item rules={[{ required: true, message: '请填写社团名称' }]} label="社团名称" name="clubName">
        <Input placeholder="社团名称" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写社团简介' }]} label="社团简介" name="clubIntro">
        <Input placeholder="社团简介" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写社团成员' }]} label="社团成员" name="classMember">
        <Input placeholder="社团成员" />
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
        title='新建社团'
        open={open}
        footer={false}
        onCancel={() => setOpen(false)}
      >
        <ModalForm refresh={submit} />
      </Modal>
    </div>
  );
};

export default NoticePage;