import React, { Component } from 'react';
import { Table, Icon,Button} from 'antd';
import moment from 'moment';

export default class FormTable extends Component{
    constructor(props){
        super(props);
        this.state={
            choose:true,
            rejectAuth:false,
            passAuth:false,
        }
    }

    componentDidMount(){

    }

    chooseAuth(){

    }
    authDiv(){

    }
    render(){
        const { authRequest,passRequest,rejectRequest,checkChange,onResolve,onReject,getImg, onDelete, editClick,pagination, dataSource, loading } = this.props;
        const rowSelection = {
            onChange: checkChange,
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User', // Column configuration not to be checked
            }),
        };
        var columns=[];
        if(authRequest){
            columns=[
                {
                    title: '提交时间',
                    dataIndex: 'committime',
                    sorter: (a, b) => moment(a.committime) - moment(b.committime),
                    width:120,
                }, {
                    title: '账号',
                    dataIndex: 'account',
                    sorter: (a, b) => moment(a.account) - moment(b.account),
                    width:80,
                },{
                    title: '姓名',
                    dataIndex: 'name',
                    width: 80,
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
                    width: 80,
                    className:'imgtd',
                    render:(text, record) =>
                        <Button type="primary" onClick={() => getImg(record.key,record.name,record.companyname)}>查看图片</Button>
                },{
                    title: '审核操作',
                    dataIndex: 'opera',
                    width:80,
                    className:'imgtd',
                    render:(text, record) =>
                        <div className='opera'>
                            <span onClick={() => onDelete(record.key,record.auditstate)}>
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
                    width:120,
                }, {
                    title: '账号',
                    dataIndex: 'account',
                    sorter: (a, b) => moment(a.account) - moment(b.account),
                    width:80,
                },{
                    title: '姓名',
                    dataIndex: 'name',
                    width: 80,
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
                    width:80,

                    className:'imgtd',
                    render:(text, record) =>
                        <Button type="primary" icon="search" size="small" onClick={() => getImg(record.key)}>查看图片</Button>
                },{
                    title: '审核人',
                    dataIndex: 'auditman',
                    width: 100,
                },{
                    title: '审核时间',
                    dataIndex: 'audittime',
                    width: 120,
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
                scroll={{ x: 1000 }}
                pagination={pagination}
            />
        )
    }
}