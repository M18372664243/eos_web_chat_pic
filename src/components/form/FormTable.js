import React, { Component } from 'react';
import { Table, Icon, Popconfirm } from 'antd';
import moment from 'moment';

export default class FormTable extends Component{
    constructor(props){
        super(props);

    }

    componentDidMount(){

    }


    render(){
        const { authRequest,passRequest,rejectRequest,checkChange, onDelete, editClick, dataSource, loading } = this.props;
        const rowSelection = {
            onChange: checkChange,
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };
        /*const columns = [
            {
                title: '提交时间',
                dataIndex: 'committime',
                sorter: (a, b) => moment(a.committime) - moment(b.committime),
                width:150,
            }, {
                title: '账号',
                dataIndex: 'account',
                sorter: (a, b) => moment(a.account) - moment(b.account),
                width:150,
            },{
                title: '姓名',
                dataIndex: 'name',
                width: 100,
            }, {
                title: '性别',
                dataIndex: 'sex',
                filters: [
                    { text: '男', value: '男' },
                    { text: '女', value: '女' },
                ],
                onFilter: (value, record) => record.sex.indexOf(value) === 0,
                width: 70,
            }, {
                title: '公司名',
                dataIndex: 'companyname',
                width: 100,
            },{
                title: '职位',
                dataIndex: 'position',
                width: 100,
            }, {
                title: '证明图片',
                dataIndex: 'provimg',
                width: 100,
            },/!*{
                title: '审核人',
                dataIndex: 'auditman',
                width: 100,
            },*!//!*{
                title: '审核时间',
                dataIndex: 'audittime',
                width: 150,
            },*!//!*{
            title: '年龄',
            dataIndex: 'age',
            sorter: (a, b) => a.age - b.age,
            width: 70,
        },{
            title: '地址',
            dataIndex: 'address',
            width: 200,
        },{
            title: '手机号',
            dataIndex: 'phone',
            width: 100,
        },{
            title: '邮箱',
            dataIndex: 'email',
            width:120,
        },{
            title: '网址',
            dataIndex: 'website',
            width:120,
        },{
            title: '创建时间',
            dataIndex: 'createtime',
            sorter: (a, b) => moment(a.createtime) - moment(b.createtime),
            width:150,
        },*!//!*{
                title: '操作',
                dataIndex: 'opera',
                width:100,
                render: (text, record) =>
                    <div className='opera'>
                    <span onClick={() => onDelete(record.key)}>
                         <Icon type="check" /> 通过
                    </span><br />
                        <span onClick={() => onDelete(record.key)}>
                            <Icon type="close" /> 拒绝
                        </span>
                    </div>
            }*!/];*/
        var columns=[];
        if(authRequest){
            columns=[
                {
                    title: '提交时间',
                    dataIndex: 'committime',
                    sorter: (a, b) => moment(a.committime) - moment(b.committime),
                    width:150,
                }, {
                    title: '账号',
                    dataIndex: 'account',
                    sorter: (a, b) => moment(a.account) - moment(b.account),
                    width:150,
                },{
                    title: '姓名',
                    dataIndex: 'name',
                    width: 100,
                }, {
                    title: '性别',
                    dataIndex: 'sex',
                    filters: [
                        { text: '男', value: '男' },
                        { text: '女', value: '女' },
                    ],
                    onFilter: (value, record) => record.sex.indexOf(value) === 0,
                    width: 70,
                }, {
                    title: '公司名',
                    dataIndex: 'companyname',
                    width: 100,
                },{
                    title: '职位',
                    dataIndex: 'position',
                    width: 100,
                }, {
                    title: '证明图片',
                    dataIndex: 'provimg',
                    width: 100,
                },{
                    title: '操作',
                    dataIndex: 'opera',
                    width:100,
                    render: (text, record) =>
                        <div className='opera'>
                    <span onClick={() => onDelete(record.key)}>
                         <Icon type="check" /> 通过
                    </span><br />
                            <span onClick={() => onDelete(record.key)}>
                            <Icon type="close" /> 拒绝
                        </span>
                        </div>
                }]
        }else if(passRequest || rejectRequest){
            columns=[
                {
                    title: '提交时间',
                    dataIndex: 'committime',
                    sorter: (a, b) => moment(a.committime) - moment(b.committime),
                    width:150,
                }, {
                    title: '账号',
                    dataIndex: 'account',
                    sorter: (a, b) => moment(a.account) - moment(b.account),
                    width:150,
                },{
                    title: '姓名',
                    dataIndex: 'name',
                    width: 100,
                }, {
                    title: '性别',
                    dataIndex: 'sex',
                    filters: [
                        { text: '男', value: '男' },
                        { text: '女', value: '女' },
                    ],
                    onFilter: (value, record) => record.sex.indexOf(value) === 0,
                    width: 70,
                }, {
                    title: '公司名',
                    dataIndex: 'companyname',
                    width: 100,
                },{
                    title: '职位',
                    dataIndex: 'position',
                    width: 100,
                }, {
                    title: '证明图片',
                    dataIndex: 'provimg',
                    width: 100,
                },{
                    title: '审核人',
                    dataIndex: 'auditman',
                    width: 100,
                },{
                    title: '审核时间',
                    dataIndex: 'audittime',
                    width: 150,
                }]
        }
        return(
            <Table
                /*rowSelection={rowSelection}*/
                columns={columns}
                dataSource={dataSource}
                bordered={true}
                scroll={{x:'100%'}}
                className='formTable'
                loading={loading}
            />
        )
    }
}