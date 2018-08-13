import React, { Component } from 'react';
import './form.less';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button} from 'antd';
import FormTable from './FormTable';
import config from '../config/config';
import './button.css'
import SureMessageForm from './SureMessage'
import qs from 'qs'
export default class UForm extends Component{
    constructor(props) {
        super(props);
        if(localStorage.getItem("userName")==null){
            this.props.history.push('/eos_tag_web');
        }
        this.state = {
            auth:true,
            total:0,
            size:10,
            dataSource:[],
            visible:false,
            loading:true,
            data:{},
            selectedRowKeys: [],
            currentPage:1,
            showDetail:false,
        };
    }
    componentDidMount(){
        this.getData(0);
    }

    //未通过列表
    getData = (offset) => {
        var param
        if(offset==undefined){
            offset = 0;
        }
        param ="offset="+offset+"&limit="+this.state.size
        axios.get(config.baseUrl+"usertagweb/v1/getUserTagsWeb?"+param,{headers:{"Content-Type":'application/json'}}).then(function (response){
            if(response.data.code==200&&response.data.success){
                var dataArr = response.data.data.webTags;
                var totalCount = response.data.data.totalNumber;
                var data =[];
                for(var i =0;i <dataArr.length;i++){
                    var user ={}
                    user.key = dataArr[i].uid;
                    user.uid = dataArr[i].uid;
                    user.name = dataArr[i].tagged_name;
                    user.company = dataArr[i].company
                    user.position = dataArr[i].position
                    user.CompanyAndPosition =dataArr[i].company+dataArr[i].position;
                    user.tagTimes =dataArr[i].tagTimes
                    data.push(user);
                }
                this.setState({
                    dataSource:data,
                    total:totalCount,
                    loading:false,
                    showDetail:false,
                })
            }else {
                alert(response.data.msg);
            }
        }.bind(this)).catch(function (err) {
            console.log("err:"+err)
        })
    };

    //转换时间
    parseDate = (timeStamp) =>{
        var date= new Date(timeStamp)
        var year =date.getFullYear()+ '-';
        var month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var day = date.getDate() + ' ';
        return year+month+day;
    }

    //通过列表
    getPassTag =(offset) =>{
        var param
        if(offset==undefined){
            offset = 0;
        }
        param ="offset="+offset+"&limit="+this.state.size
        axios.get(config.baseUrl+"usertagweb/v1/getApproveList?"+param,{headers:{"Content-Type":'application/json'}}).then(function (response){
            if(response.data.code==200&&response.data.success){
                var dataArr = response.data.data.entitys;
                var totalCount = response.data.data.count;
                var data =[];
                for(var i =0;i <dataArr.length;i++){
                    var user ={}
                    user.authId = dataArr[i].approver_id;
                    user.authTime = this.parseDate(dataArr[i].updateTime);
                    user.uid = dataArr[i].uid;
                    user.name = dataArr[i].name;
                    user.company = dataArr[i].company
                    user.position = dataArr[i].position
                    user.CompanyAndPosition =dataArr[i].company+dataArr[i].position;
                    if(dataArr[i].tag == 0){
                        user.tag ="无"
                    }
                    if(dataArr[i].tag == 1){
                        user.tag ="交易所"
                    }
                    if(dataArr[i].tag == 2){
                        user.tag ="媒体"
                    }
                    if(dataArr[i].tag == 3){
                        user.tag ="项目方"
                    }
                    if(dataArr[i].tag == 4){
                        user.tag ="投资方"
                    }
                    data.push(user);
                }
                this.setState({
                    dataSource:data,
                    total:totalCount,
                    loading:false,
                })
            }else {
                alert(response.data.msg);
            }
        }.bind(this)).catch(function (err) {
            console.log("err:"+err)
        })
    }


    getApplys =(type)=>{
        this.setState({
            loading:true,
            currentPage:1
        })
        if("auth" == type){
            this.setState({
                auth:true,
            })
            this.getData(0)
        }
        if("pass" == type){
            this.setState({
                auth:false,
            })
            this.getPassTag(0)
        }
    }


    detailTagList = (key) =>{
        var that =this
        var param = "?uid="+key
        axios.get(config.baseUrl+"usertag/v1/getUserTags"+param,{headers:{"Content-Type":'application/json'}}).then(function (response){
            if(response.data.code==200&&response.data.success){
                var dataArr = response.data.data.tags;
                var totalCount = response.data.data.tags.length;
                var data =[];
                for(var i =0;i <dataArr.length;i++){
                    var user ={}
                    user.key =i;
                    user.uid = dataArr[i].uid;
                    user.name = dataArr[i].tagged_name;
                    user.company = dataArr[i].company
                    user.position = dataArr[i].position
                    user.CompanyAndPosition =dataArr[i].company+dataArr[i].position;
                    user.tagTimes =dataArr[i].tagTimes
                    user.tag = dataArr[i].tag;
                    data.push(user);
                }
                that.setState({
                    dataSource:data,
                    total:totalCount,
                    loading:false
                })
            }else {
                alert(response.data.msg);
            }
        }).catch(function (err) {
            console.log(err)
        })
    }
    //查看详情
    detailTag = (key) =>{
        this.setState({
            loading:true,
            showDetail:true,
        })
        this.detailTagList(key);

    }

    //审核操作
    onPass = (key,company,position,tagTimes,name,tag) =>{
        var data ={}
        data.key = key
        data.company =company,
        data.position =position
        data.tagTimes =tagTimes
        data.name = name
        data.tag = tag
        const form=this.form;
        form.resetFields();
        this.setState({
            visible:true,
            data:data
        })
    }

    saveFormRef = (form) => {
        this.form = form;
    };
    //提交认证信息
    handleCreate = (passType,tagType) => {
        var that = this;
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.createtime = moment().format("YYYY-MM-DD hh:mm:ss");
            //var approver_id =1
            //var approver_name="admin"
            //var auditStatus =passType
            var tagData = that.state.data
            //var params = "uid="+tagData.key+"&company="+tagData.company+"&postion="+tagData.position+"&approver_id="+approver_id+"&approver_name="+approver_name+"&times="+tagData.tagTimes+"&name="+tagData.name+"&auditStatus="+auditStatus
            var params = {}
            params.uid = tagData.key
            params.company = tagData.company
            params.position =tagData.position
            params.approver_id =1
            params.approver_name = "admin"
            params.times = tagData.tagTimes
            params.name = tagData.name
            params.auditStatus = passType
            params.tag = tagType;
            axios.post(config.baseUrl+"usertagweb/v1/approveUser",qs.stringify(params),{headers:{"Content-Type":'application/x-www-form-urlencoded'}}).then(function (response){
                if(response.data.code==200&&response.data.success){
                    alert("审核成功")
                    that.getData(0)
                }else {
                    alert(response.data.msg);
                }
            }).catch(function (error) {
                console.log(error)
            })
            form.resetFields();
            this.setState({
                visible: false,
                currentPage:1
            });
        });
    };
    //取消认证信息
    handleCancel = () => {
        const form=this.form;
        this.setState({
            visible: false
        });
        form.resetFields();

    };

    checkChange = (selectedRowKeys) => {
        this.setState({selectedRowKeys: selectedRowKeys});
    };
    pageChange=(current, pageSize)=>{
        var offset = (current-1)*10
        var that = this
        this.setState({
            loading:true,
            currentPage:current
        })
        if(this.state.auth){
           that.getData(offset)
        }else {
           that.getPassTag(offset)
        }

    };

    backHome = () =>{
        this.setState({
            loading:true,
            currentPage:1
        })
        this.getData(0)
    }

    loginOut = () =>{
        localStorage.removeItem("userName");
        this.props.history.push('/eos_tag_web');
    }
    render(){
        const {total,auth,visible, size, dataSource, loading,data,currentPage,showDetail} = this.state;
        let pagination = {
            total: total,
            current:currentPage,
            defaultCurrent: 1,
            pageSize: size,
            hideOnSinglePage:false,
            showSizeChanger: false,
            style:{textAlign:"center",float:"none"},
            onChange:(current, pageSize) => {
                this.pageChange(current, pageSize)
            },
           }
        return(
            <div>
                <div className='formBody'>
                    <Row gutter={24}>
                        <Col className="gutter-row" sm={24}>
                            <div style={{float:"right",display:"flex"}}>
                                {showDetail?<div style={{padding:'0 5px'}}>
                                        <a onClick={this.backHome}>返回首页</a>
                                    </div>:null
                                }
                                <div style={{padding:'0 5px'}}>
                                <a onClick={this.loginOut}>退出登陆</a>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {!showDetail?
                        <Row gutter={24}>
                            <Col className="gutter-row" sm={8}>
                                {auth?
                                    <div style={{display:"flex"}}>
                                        <Button  onClick={()=>{this.getApplys("auth")}} style={{background:"#bfbfbf"}}>
                                            待审核
                                        </Button>
                                        <Button  onClick={()=>{this.getApplys("pass")}}>
                                            已通过
                                        </Button></div>
                                    :
                                    <div style={{display:"flex"}}>
                                        <Button  onClick={()=>{this.getApplys("auth")}} >
                                            待审核
                                        </Button>
                                        <Button  onClick={()=>{this.getApplys("pass")}} style={{background:"#bfbfbf"}}>
                                            已通过
                                        </Button>
                                    </div>
                                }
                            </Col>
                        </Row>
                        :null
                    }
                    
                    <FormTable
                        dataSource={dataSource}
                        showDetail ={showDetail}
                        auth={auth}
                        onPass={this.onPass}
                        detailTag={this.detailTag}
                        editClick={this.editClick}
                        loading={loading}
                        pagination={pagination}
                    />
                    {<SureMessageForm key={data.key} ref={this.saveFormRef} postData={data} visible={visible} onCancel={this.handleCancel} onCreate={this.handleCreate}  title="确认信息" okText="提交"/>}
                </div>
            </div>
        )
    }
}