"use client";
import React, { Fragment, useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Modal, Select, message } from 'antd';
import { useAntdTable } from 'ahooks';

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

const permission = localStorage.getItem('permission');

const getTableData = ({ current, pageSize }, formData: Object,): Promise<Result> => {

  return fetch('/api/course', {
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
    fetch('/api/course', {
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
    })
    setIsModify(true)
  }

  const columns = [
    {
      title: '课程名称',
      dataIndex: 'subject',
    },
    {
      title: '授课教师',
      dataIndex: 'teacher',
    },
    {
      title: '课程编号',
      dataIndex: 'subjectNo',
    },
    {
      title: '学分',
      dataIndex: 'credits',
    },
    {
      title: '课程简介',
      dataIndex: 'courseOverview',
    },
    {
      title: '上课地点',
      dataIndex: 'address',
    },
    {
      title: '考试形式',
      dataIndex: 'examinationFormat',
    },
    {
      title: '操作',
      render: (value, record) => {
        return <Fragment>
          <Button disabled={permission === 'student'} onClick={() => { remove(record) }} type={'link'}>删除</Button>
          <Button disabled={permission === 'student'} type={'link'} onClick={() => { edit(record) }}>编辑</Button>
        </Fragment>
      }
    },
  ];

  const advanceSearchForm = (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="课程名称" name="subject">
            <Input placeholder="课程名称" />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="授课老师" name="teacher">
            <Input placeholder="授课老师" />
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
      fetch('/api/course', {
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
      <Form.Item rules={[{ required: true, message: '请填写课程名称' }]} label="课程名称" name="subject">
        <Input placeholder="课程名称" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写课程编号' }]} label="课程编号" name="subjectNo">
        <Input placeholder="课程编号" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写授课老师' }]} label="授课老师" name="teacher">
        <Input placeholder="请填写授课老师" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写课程学分' }]} label="课程学分" name="credits">
        <Select placeholder="请填写课程学分" options={[...Array(5).keys()].map((item) => ({ label: item + 1, value: item + 1 }))} />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请选择是否必修' }]} label="是否必修" name="isMandatory">
        <Select placeholder="是否必修"  options={[{ label: '必修', value: '1' }, { label: '选修', value: '0' }]} />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写课程简介' }]} label="课程简介" name="courseOverview">
        <Input placeholder="课程简介" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写上课地点' }]} label="上课地点" name="address">
        <Input placeholder="上课地点" />
      </Form.Item>
      <Form.Item rules={[{ required: true, message: '请填写考试形式' }]} label="考试形式" name="examinationFormat">
        <Select placeholder="考试形式" options={[{ label: '闭卷', value: '1' }, { label: '开卷', value: '2' }]} />
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
      {permission === 'admin' && <Button type='primary' style={{
        marginBottom: 6
      }} onClick={() => {
        addNotice()
        setIsModify(false)
        setInitialValue({})
      }}>新建</Button>}
      <Table columns={columns} rowKey="email" style={{ overflow: 'auto' }} {...tableProps} />
      <Modal
        title={!isModify ? '新增课程' : '编辑课程'}
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