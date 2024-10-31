"use client";
import React, { Fragment, useEffect, useState } from 'react';
import { Button, Col, Form, Input, Row, Table, Modal, DatePicker, message, Select } from 'antd';
import { useAntdTable } from 'ahooks';
import dayjs from "dayjs";
import { parse } from 'cookie'
import { gradeOptions, subjectOptions, teacherOptions } from './constant';

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
const cookies = parse(document?.cookie || '')

const getTableData = ({ current, pageSize }, formData: Object,): Promise<Result> => {

    return fetch('/api/chooseClass', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...formData,
            username: cookies?.name,
            current,
            pageSize,
            permission,
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

const ChooseClass = () => {
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [allClass, setAllClass] = useState([]);
    const [compulsory, setCompulsory] = useState([]);
    const [take, setTake] = useState([]);
    const [isModify, setIsModify] = useState(false);

    const { tableProps, search, params } = useAntdTable(getTableData, {
        defaultPageSize: 5,
        form,
    });
    const { changeType, submit, reset } = search;

    const remove = (record: any, submit) => {
       const { usernameId, subjectId, classNo } = record;
        fetch('/api/chooseClass', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usernameId,
                subjectId,
                classNo,
            })
        }).then(res => res.json())
            .then(res => {
                if (res.success) {
                    message.success('删除成功');
                    submit();
                } else {
                    message.error('删除失败');
                }
            })
    }

    const columns = [
        {
            title: '学员',
            dataIndex: 'username',
        },
        {
            title: '必修课',
            dataIndex: 'subject',
        },
        {
            title: '选修课',
            dataIndex: 'classId',
        },
        {
            title: '操作',
            render: (value, record) => {
                return <Fragment>
                    <Button type={'link'} onClick={() => { remove(record, submit) }}>删除</Button>
                </Fragment>
            }
        },
    ];

    useEffect(() => {
        fetch('api/getUser').then(res => res.json()).then(data => {
            setData(data.data)
        })
        fetch('api/getClass?isMandatory=1').then(res => res.json()).then(data => {
            setCompulsory(data.data)
        })
        fetch('api/getClass?isMandatory=0').then(res => res.json()).then(data => {
            setTake(data.data)
        })
        fetch('api/getClass').then(res => res.json()).then(data => {
            setAllClass(data.data)
        })
    }, [])

    const advanceSearchForm = (
        <Form form={form}>
            <Row gutter={24}>
                <Col span={8}>
                    <Form.Item label="学生姓名" name="studentId">
                        <Select placeholder="学生姓名" options={data} />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="课程" name="subjectId">
                        <Select placeholder="课程" options={allClass} />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24} justify="end" style={{ marginBottom: 24 }}>
                <Button type='primary' onClick={() => { setOpen(true) }}>选课</Button>
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
            fetch('/api/addClass', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...values,
                    username: values?.username || cookies?.id,
                    type: 'chooseClass',
                })
            }).then(res => res.json()).then((res) => {
                if (res.success) {
                    setOpen(false);
                    refresh()
                    message.success(res.message)
                } else {
                    message.error(res.message)
                }
            }).catch((err) => {
                message.error(err.message)
            })
        }
        return <Form form={form} onFinish={submit} >
            {
                permission === 'admin' && <Form.Item rules={[{ required: true, message: '请选择学生姓名' }]} label="学生姓名" name="username">
                    <Select placeholder="学生姓名" options={data} allowClear />
                </Form.Item>
            }
            <Form.Item rules={[{ required: true, message: '请选择课程' }]} label="必修课程" name="subject1">
                <Select placeholder="必修课程" options={compulsory} allowClear />
            </Form.Item>
            <Form.Item rules={[{ required: true, message: '请选择课程' }]} label="选修课程" name="subject2">
                <Select placeholder="选修课程" options={take} allowClear />
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
            <Table columns={columns} rowKey="email" style={{ overflow: 'auto' }} {...tableProps} />
            <Modal
                title='选课'
                open={open}
                footer={false}
                onCancel={() => setOpen(false)}
            >
                <ModalForm refresh={submit} />
            </Modal>
        </div>
    );
};

export default ChooseClass;