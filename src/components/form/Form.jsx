import React, { Component } from 'react';
import './form.less';
import axios from 'axios';
import qs from 'qs';
import Mock from 'mockjs';
import moment from 'moment';
import { Row, Col, Input, Icon, Cascader, DatePicker, Button, Tooltip, Popconfirm ,Radio,Modal} from 'antd';

import BreadcrumbCustom from '../common/BreadcrumbCustom';
import address from './request/address.json';
import data from './request/data.json';
import CollectionCreateForm from './CustomizedForm';
import SureMessageForm from './SureMessage';
import ProveImgForm from './ProveImg';
import FormTable from './FormTable';
import config from '../config/config';
const Search = Input.Search;
const InputGroup = Input.Group;
const options = [];
const { RangePicker } = DatePicker;
var RadioButton = Radio.Button;
var RadioGroup = Radio.Group;
Mock.mock('/address', address);
Mock.mock('/data', data);
var dataSourceAll = []
var imgSrc=''
//数组中是否包含某项
function isContains(arr, item){
    arr.map(function (ar) {
        if(ar === item){
            return true;
        }
    });
    return false;
}
//找到对应元素的索引
function catchIndex(arr, key){ //获取INDEX
    arr.map(function (ar, index) {
        if(ar.key === key){
            return index;
        }
    });
    return 0;
}
//替换数组的对应项
function replace(arr, item, place){ //arr 数组,item 数组其中一项, place 替换项
    arr.map(function (ar) {
        if(ar.key === item){
            arr.splice(arr.indexOf(ar),1,place)
        }
    });
    return arr;
}

export default class UForm extends Component{
    constructor(props) {
        super(props);
        const { location,params } = this.props;
        this.state = {
            total:10,
            page:1,
            size:3,
            userName: '',
            address: '',
            timeRange: '',
            visible: false, //新建窗口隐藏
            dataSource: [],
            count: data.length,
            data:data,
            selectedRowKeys: [],
            tableRowKey: 0,
            isUpdate: false,
            isSure:false,
            loading: true,
            authRequest:true,
            passRequest:false,
            rejectRequest:false,
            imgSrc:'',
            imgVisible:false,
            key:'',
            companyname:'',
            name:'',
        };
    }
    getData = (type,offset) => {
        var params;
        if(type ==undefined || type==null){
            type=1
        }
        params = "type="+type;
        if (offset ==undefined || offset == null){
            offset =0;
        }
        params ="?"+params+"&offset="+offset;

        axios.get(config.baseUrl+params,{"Content-Type":'application/json'}).then(function (response){
            if(response.data.data.result>0){

                var dataArr = response.data.data.userInfo;
                var userInfo =[{
                    "committime":"2016-11-11 11:11:11",
                    "account":123234531,
                    "key": 0,
                    "name": "123",
                    "sex": "女",
                    "companyname":"火币网",
                    "position":"副经理",
                    "provimg":"",
                    "auditman":"张三",
                    "audittime":"2017-11-11 11:11:11",
                    "auditstate":-1,
                    "age": "23",
                    "address": "江苏省 / 南京市 / 栖霞区",
                    "phone": "17322103020",
                    "email": "wy0611@163.com",
                    "website": "wy0611.net",
                    "createtime": "2017-11-11 11:11:11"
                }];
                var data =[];

                for(var i =0;i <dataArr.length;i++){

                    var user ={}
                    user.committime=this.parseDate(dataArr[i].submitTime);
                    user.account = dataArr[i].uid;
                    user.name = dataArr[i].userInfoEntity.name;
                    if(dataArr[i].userInfoEntity.gender==0){
                        user.sex="男";
                    }
                    if(dataArr[i].userInfoEntity.gender==1){
                        user.sex="女";
                    }
                    //user.companyname =dataArr[i]

                }
                this.setState({
                    dataSource: userInfo,
                    loading:false
                })
            }else {
                alert(response.data.msg);
            }
        }.bind(this)).catch(function (err) {
            console.log("err:"+err)
        })
    };

    parseDate = (timeStamp) =>{
        var date= new Date(timeStamp*1000)
        var year =date.getFullYear()+ '-';
        var month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var day = date.getDate() + ' ';
        return year+month+day;
    }

    //查看图片
    getImg = (value,name,companyname) => {
        axios.get('/data')
            .then(function (response) {
                // console.log(response.data);
                imgSrc = response.data;
                this.setState({
                    name:name,
                    companyname:companyname,
                    imgSrc:'imgSrc',
                    imgVisible:true
                })
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            })
    };
    //用户名输入
    /*onChangeUserName = (e) => {
        
        const value = e.target.value;
        this.setState({
            userName: value,
        })
    };*/
    //用户名搜索
    /*onSearchUserName = (value) => {
        console.log(value);
        const { dataSource } = this.state;
        this.setState({
            dataSource: dataSource.filter(item => item.name.indexOf(value) !== -1),
            loading: false,
        })
    };*/
    //审核状态筛选
    onSearchUserState = (value,event) => {
        //console.log(value.target.value);
        //this.getData();
        //const { dataSource } = this.state;
       /* var arr=dataSourceAll.filter(function(item ){
            return item.auditstate==value;
        });
        switch (event.target.textContent){
            case '待审核请求':this.setState({
                authRequest:true,
                passRequest:false,
                rejectRequest:false,
                dataSource: arr,
                loading: false,
            });break;
            case '已拒绝请求':this.setState({
                authRequest:false,
                passRequest:false,
                rejectRequest:true,
                dataSource: arr,
                loading: false,
            });break;
            case '已通过请求':this.setState({
                authRequest:false,
                passRequest:true,
                rejectRequest:false,
                dataSource: arr,
                loading: false,
            });break;
        }*/
        var arr=dataSourceAll.filter(function(item ){
            return item.auditstate==value.target.value;
        });
        switch (value.target.value){
            case '-1':this.setState({
                authRequest:true,
                passRequest:false,
                rejectRequest:false,
                dataSource: arr,
                loading: false,
            });break;
            case '0':this.setState({
                authRequest:false,
                passRequest:false,
                rejectRequest:true,
                dataSource: arr,
                loading: false,
            });break;
            case '1':this.setState({
                authRequest:false,
                passRequest:true,
                rejectRequest:false,
                dataSource: arr,
                loading: false,
            });break;
        }
        /*axios.get('/data')
            .then(function (response) {
                // console.log(response.data);

                this.setState({
                    dataSource:response.data
                })
                alert(imgSrc);
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            })*/
    };
    //地址级联选择
    /*Cascader_Select = (value) => {
        const { dataSource } = this.state;
        if(value.length===0){
            this.setState({
                address: value,
                dataSource: [],
            });
            this.getData();
        }else{
            this.setState({
                address: value,
                dataSource: dataSource.filter(item => item.address === value.join(' / '))
            });
        }
    };*/
    //时间选择
    RangePicker_Select = (date, dateString) => {
        // console.log(date, dateString);
        const { dataSource } = this.state;
        const startime = moment(dateString[0]);
        const endtime = moment(dateString[1]);
        if(date.length===0){
            this.setState({
                timeRange: date,
                dataSource: [],
            });
            this.getData();
        }else{
            this.setState({
                timeRange: date,
                dataSource: dataSource.filter(item => (moment(item.createtime.substring(0,10)) <= endtime  && moment(item.createtime.substring(0,10)) >= startime) === true)
            });
        }
    };
    //渲染
    componentDidMount(){
        axios.get('/address')
            .then(function (response) {
                response.data.map(function(province){
                    options.push({
                        value: province.name,
                        label: province.name,
                        children: province.city.map(function(city){
                            return {
                                value: city.name,
                                label: city.name,
                                children: city.area.map(function(area){
                                    return {
                                        value: area,
                                        label: area,
                                    }
                                })
                            }
                        }),
                    })
                });
            })
            .catch(function (error) {
                console.log(error);
            });
        this.getData();
    }
    //搜索按钮
    /*btnSearch_Click = () => {

    };*/
    //重置按钮
    /*btnClear_Click = () => {
        this.setState({
            userName: '',
            address: '',
            timeRange: '',
            dataSource: [],
            count: data.length,
        });
        this.getData();
    };*/
    //新建信息弹窗
    /*CreateItem = () => {
        this.setState({
            visible: true,
            isUpdate: false,
        });
        const form = this.form;
        form.resetFields();
    };*/
    //接受新建表单数据
    saveFormRef = (form) => {
        this.form = form;
    };
    //提交认证信息
    handleCreate = () => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== this.state.key)});
        const form = this.form;
       /* //审核时间
        var provDate=moment().format("YYYY-MM-DD hh:mm:ss");
        const {username}=this.props;
        alert(this.props.username);
        axios.get('/data')
            .then(function (response) {
                this.setState({
                    visible: false,
                    dataSource:response.data

                });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });*/
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);

            /*values.key = count;*/
            /*values.address = values.address.join(" / ");*/
            values.createtime = moment().format("YYYY-MM-DD hh:mm:ss");

            form.resetFields();
            this.setState({
                visible: false,
            });
        });
    };
    //取消认证信息
    handleCancel = () => {
        const form=this.form;
        this.setState({ visible: false });
        form.resetFields();
    };
    //收回图片
    handleCancelImg=()=>{
        this.setState({ imgVisible: false });
    }
    //批量删除
    /*MinusClick = () => {
        const { dataSource, selectedRowKeys } = this.state;
        this.setState({
            dataSource: dataSource.filter(item => !isContains(selectedRowKeys, item.key)),
        });
    };*/
    //单个删除
    onDelete = (key) => {
        this.setState({
            visible: true,
        })
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
    };
    //审核通过
    onResolve = (key) => {
        this.setState({
            visible: true,
            key:key,
        })

    };
    //审核未通过
    onReject = (key) => {
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== key) });
        //审核时间
       /* var provDate=moment().format("YYYY-MM-DD hh:mm:ss");
        axios.get('/data')
            .then(function (response) {
                this.setState({
                    dataSource:response.data

                });
            }.bind(this))
            .catch(function (error) {
                console.log(error);
            });*/
    };
    //点击修改
    editClick = (key) => {
        const form = this.form;
        const { dataSource } = this.state;
        const index = catchIndex(dataSource, key);
        form.setFieldsValue({
            key: key,
            name: dataSource[index].name,
            sex: dataSource[index].sex,
            age: dataSource[index].age,
            address: dataSource[index].address.split(' / '),
            phone: dataSource[index].phone,
            email: dataSource[index].email,
            website: dataSource[index].website,
        });
        this.setState({
            visible: true,
            tableRowKey: key,
            isUpdate: true,
        });
    };
    //更新修改
    handleUpdate = () => {
        const form = this.form;
        const { dataSource, tableRowKey } = this.state;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            console.log('Received values of form: ', values);

            values.key = tableRowKey;
            values.address = values.address.join(" / ");
            values.createtime = moment().format("YYYY-MM-DD hh:mm:ss");

            form.resetFields();
            this.setState({
                visible: false,
                dataSource: replace(dataSource, tableRowKey, values)
            });
        });
    };
    //单选框改变选择
    checkChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys: selectedRowKeys});
    };
    render(){
        const {total, page,size,authRequest, passRequest,rejectRequest,userName, address, timeRange, dataSource, visible, isUpdate, loading,imgSrc,name,companyname,imgVisible } = this.state;
        let pagination = {
            total: total,
            defaultCurrent: page,
            pageSize: 8,
            showSizeChanger: false,
           }
        const questiontxt = ()=>{
            return (
                <p>
                    <Icon type="plus-circle-o" /> : 新建信息<br/>
                    <Icon type="minus-circle-o" /> : 批量删除
                </p>
            )
        };
        return(
            <div>
               {/* <BreadcrumbCustom paths={['首页','表单']}/>
                <BreadcrumbCustom/>*/}
                <div className='formBody'>
                    <Row gutter={24}>
                        <Col className="gutter-row" sm={8}>
                           {/* <Search
                                placeholder="Input Name"
                                prefix={<Icon type="user" />}
                                value={userName}
                                onChange={this.onChangeUserName}
                                onSearch={this.onSearchUserName}
                            />*/}
                            {/*<Row gutter={16}>
                                <Col className="gutter-row" sm={8} style={{padding:"0 0"}}>
                                    <Button style={{borderRadius:0,width:"100%",borderRight:0}}>待审核请求</Button>
                                    <div style={{padding:"4px 0",display: "inline-block",height:"28px",fontWeight:500,fontFamily:"inherit",fontSize:"12px",width:"100%",textAlign:"center",border: "1px solid transparent",borderColor:"#d9d9d9"}}>
                                        <div onClick={this.onSearchUserState.bind(this,-1)}  style={{textAlign:"center",height:18}}>待审核请求</div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" sm={8} style={{padding:"0 0 "}}>
                                    <Button onClick={this.onSearchUserState.bind(1)} style={{borderRadius:0,width:"100%",borderRight:0}} value={1}>已通过请求</Button>
                                    <div style={{padding:"4px 0",display: "inline-block",height:"28px",fontWeight:500,fontFamily:"inherit",fontSize:"12px",width:"100%",textAlign:"center",borderBottom: "1px solid transparent",borderTop: "1px solid transparent",borderColor:"#d9d9d9"}}>
                                        <div onClick={this.onSearchUserState.bind(this,1)}  style={{width:"100%",textAlign:"center"}}>已通过请求</div>
                                    </div>
                                </Col>
                                <Col className="gutter-row" sm={8} style={{padding:"0 0 "}}>
                                    <Button onClick={this.onSearchUserState.bind(0)} style={{borderRadius:0,width:"100%"}}>已拒绝请求</Button>
                                    <div style={{padding:"4px 0",display: "inline-block",height:"28px",fontWeight:500,fontFamily:"inherit",fontSize:"12px",width:"100%",textAlign:"center",border: "1px solid transparent",borderColor:"#d9d9d9"}}>
                                        <div onClick={this.onSearchUserState.bind(this,0)}  style={{width:"100%",textAlign:"center"}}>已拒绝请求</div>
                                    </div>
                                </Col>
                            </Row>*/}
                            <RadioGroup  onChange={this.onSearchUserState} defaultValue="-1">
                                <RadioButton style={{borderColor:"#d9d9d9",color:"rgba(0,0,0,0.65)",fontWeight:"bold"}} value="-1">待审核请求</RadioButton>
                                <RadioButton style={{borderColor:"#d9d9d9",color:"rgba(0,0,0,0.65)",fontWeight:"bold"}} value="1">已通过请求</RadioButton>
                                <RadioButton style={{borderColor:"#d9d9d9",color:"rgba(0,0,0,0.65)",fontWeight:"bold"}} value="0">已拒绝请求</RadioButton>
                            </RadioGroup>
                        </Col>
                        <Col className="gutter-row" sm={8}>
                            {/*<InputGroup compact>*/}
                                {/*<Cascader style={{ width: '100%' }} options={options} placeholder="Select Address" onChange={this.Cascader_Select} value={address}/>*/}
                            {/*</InputGroup>*/}
                        </Col>
                        <Col className="gutter-row" sm={8}>
                            <RangePicker style={{ width:'100%' }} onChange={this.RangePicker_Select} value={timeRange}/>
                        </Col>
                    </Row>
                    {/*<Row gutter={16}>*/}
                        {/*<div className='plus' onClick={this.CreateItem}>*/}
                            {/*<Icon type="plus-circle" />*/}
                        {/*</div>*/}
                        {/*<div className='minus'>*/}
                            {/*<Popconfirm title="确定要批量删除吗?" onConfirm={this.MinusClick}>*/}
                                {/*<Icon type="minus-circle" />*/}
                            {/*</Popconfirm>*/}
                        {/*</div>*/}
                        {/*<div className='question'>*/}
                            {/*<Tooltip placement="right" title={questiontxt}>*/}
                                {/*<Icon type="question-circle" />*/}
                            {/*</Tooltip>*/}
                        {/*</div>*/}
                        {/*<div className='btnOpera'>*/}
                            {/*<Button type="primary" onClick={this.btnSearch_Click} style={{marginRight:'10px'}}>查询</Button>*/}
                            {/*<Button type="primary" onClick={this.btnClear_Click} style={{background:'#f8f8f8', color: '#108ee9'}}>重置</Button>*/}
                        {/*</div>*/}
                    {/*</Row>*/}
                    <FormTable
                        getImg={this.getImg}
                        authRequest={authRequest}
                        passRequest={passRequest}
                        rejectRequest={rejectRequest}
                        dataSource={dataSource}
                        checkChange={this.checkChange}
                        onDelete={this.onDelete}
                        onResolve={this.onResolve}
                        onReject={this.onReject}
                        editClick={this.editClick}
                        loading={loading}
                        pagination={pagination}
                    />
                    {<SureMessageForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onCreate={this.handleCreate}  title="确认信息" okText="提交"/>}
                    {<ProveImgForm  visible={imgVisible} onCancel={this.handleCancelImg}  imgSrc={imgSrc} name={name} companyname={companyname} title="证明图片" />}
                    {/*{isUpdate?
                        <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onCreate={this.handleUpdate} title="修改信息" okText="更新"
                    /> : <CollectionCreateForm ref={this.saveFormRef} visible={visible} onCancel={this.handleCancel} onCreate={this.handleCreate} title="新建信息" okText="创建"
                    />}*/}
                </div>
            </div>
        )
    }
}