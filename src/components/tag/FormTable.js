import React, { Component } from 'react';
import { Table, Icon,Button} from 'antd';
import moment from 'moment';

export default class FormTable extends Component{
    constructor(props){
        super(props);
        this.state={
            auth:true,
            pass:false
        }
    }

    selectRow = (record) => {
        const selectedRowKeys = [...this.state.selectedRowKeys];
        if (selectedRowKeys.indexOf(record.key) >= 0) {
            selectedRowKeys.splice(selectedRowKeys.indexOf(record.key), 1);
        } else {
            selectedRowKeys.push(record.key);
        }
        this.setState({ selectedRowKeys });
    }
    render(){
        const {auth,checkChange,onPass,detailTag, pagination, dataSource, loading ,showDetail} = this.props;
        const rowSelection = {
            onChange: checkChange,
            getCheckboxProps: record => ({
                disabled: record.name === 'Disabled User',
            }),
        };
        var columns=[];

        if(showDetail){
            columns=[
                {
                    title: '用户ID',
                    dataIndex: 'uid',
                    width:120,
                }, {
                    title: '用户名',
                    dataIndex: 'name',
                    width:80,
                },{
                    title: '公司名+职位',
                    dataIndex: 'CompanyAndPosition',
                    width: 80,
                }, {
                    title: '认可数',
                    dataIndex: 'tagTimes',
                    width: 70,
                },
                {
                    title: '审核操作',
                    dataIndex: 'opera',
                    width:80,
                    className:'imgtd',
                    render:(text, record) =>
                        <div className='opera'>
                            <div style={{textAlign:"center",width:"100%"}}>
                                <Button type="default" onClick={() => onPass(record.uid,record.company,record.position,record.tagTimes,record.name,record.tag)} style={{width:'30%'}}>
                                    通过
                                </Button>
                            </div>
                        </div>

                }]
        }else{
            if(auth){
                columns=[
                    {
                        title: '用户ID',
                        dataIndex: 'uid',
                        width:120,
                    }, {
                        title: '用户名',
                        dataIndex: 'name',
                        width:80,
                    },{
                        title: '公司名+职位',
                        dataIndex: 'CompanyAndPosition',
                        width: 80,
                    }, {
                        title: '最多认可数',
                        dataIndex: 'tagTimes',
                        width: 70,
                    }, {
                        title: '审核操作',
                        dataIndex: 'opera',
                        width:80,
                        className:'imgtd',
                        render:(text, record) =>
                            <div className='opera'>
                                <div style={{textAlign:"center",width:"100%"}}>
                                    {/*<Button type="default" onClick={() => onPass(record.key,record.company,record.position,record.tagTimes,record.name)} style={{width:'30%'}}>*/}
                                        {/*通过*/}
                                    {/*</Button>*/}
                                    <Button type="default" onClick={() => detailTag(record.key)} style={{width:'30%',marginLeft:20}}>
                                        查看详情
                                    </Button>
                                </div>
                            </div>

                    }]
            }else {
                columns=[
                    {
                        title: '审核人员ID',
                        dataIndex: 'authId',
                        width:120,
                    }, {
                        title: '审核时间',
                        dataIndex: 'authTime',
                        width:80,
                    },{
                        title: '用户ID',
                        dataIndex: 'uid',
                        width:120,
                    }, {
                        title: '用户名',
                        dataIndex: 'name',
                        width:80,
                    },{
                        title: '公司名+职位',
                        dataIndex: 'CompanyAndPosition',
                        width: 80,
                    },{
                        title: '标签',
                        dataIndex: 'tag',
                        width: 80,
                    }]
            }
        }
        return(
            <Table
                    onPass ={onPass}
                    detailTag ={detailTag}
                    columns={columns}
                    dataSource={dataSource}
                    bordered={true}
                    scroll={{x:'100%'}}
                    className='formTable'
                    loading={loading}
                    scroll={{ x: 1000 }}
                    pagination={!showDetail?pagination:false}
                    onRow={(record) => ({
                        onClick: () => {
                            this.selectRow(record);
                        },
                    })}
                />

        )
    }
}