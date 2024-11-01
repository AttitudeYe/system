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
      title: '成员',
      dataIndex: 'classMember',
    },
    {
      title: '社团名称',
      dataIndex: 'className',
    },
    {
      title: '社团简介',
      dataIndex: 'classIntro',
    },
  ];

  const advanceSearchForm = (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label="成员名称" name="title">
            <Input placeholder="成员名称" />
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

  // 新增公告
  const addNotice = () => {
    setOpen(true)
  };

  return (
    <div>
      {advanceSearchForm}
      <Table columns={columns} rowKey="email" style={{ overflow: 'auto' }} {...tableProps} />
    </div>
  );
};

export default NoticePage;