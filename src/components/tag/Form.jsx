import React, { Component } from 'react';
import './form.less';
import axios from 'axios';
import moment from 'moment';
import { Row, Col, Button} from 'antd';
import FormTable from './FormTable';
import config from '../config/config';
import './button.css'
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
            dataSource:[]
        };
    }
    componentDidMount(){
        this.getData(0);
    }

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
                    user.CompanyAndPosition =dataArr[i].company+dataArr[0].position;
                    user.tagTimes =dataArr[i].tagTimes
                    data.push(user);
                }
                this.setState({
                    dataSource:data,
                    total:totalCount
                })
            }else {
                alert(response.data.msg);
            }
        }.bind(this)).catch(function (err) {
            console.log("err:"+err)
        })
    };
    parseDate = (timeStamp) =>{
        var date= new Date(timeStamp)
        var year =date.getFullYear()+ '-';
        var month = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        var day = date.getDate() + ' ';
        return year+month+day;
    }
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
                    user.CompanyAndPosition =dataArr[i].company+dataArr[0].position;
                    data.push(user);
                }
                this.setState({
                    dataSource:data,
                    total:totalCount
                })
            }else {
                alert(response.data.msg);
            }
        }.bind(this)).catch(function (err) {
            console.log("err:"+err)
        })
    }

    //提交认证信息
    handleCreate = (uid,type,passType) => {
        var auth;
        var that = this;
        const dataSource = [...this.state.dataSource];
        this.setState({ dataSource: dataSource.filter(item => item.key !== this.state.key)});
        const form = this.form;
        form.validateFields((err, values) => {
            if (err) {
                return;
            }
            values.createtime = moment().format("YYYY-MM-DD hh:mm:ss");
            var coment = values.name;
            var name =localStorage.getItem("userName");
            var params ="?uid="+uid+"&name="+name;
            if(type =="pass"){
                params=params+"&type="+passType+"&coment="+coment;
            }
            if(type =="reject"){
                auth =5;
                params=params+"&type="+auth+"&rejectreason="+coment;
            }
            axios.get(config.baseUrl+"authentication/v1/updateApply"+params,{headers:{"Content-Type":"application/json"}}).then(function (res) {
                if (res.data.code == 200 && res.data.success){
                    that.getData(4,0)
                }else {
                    alert(res.data.msg);
                }
            }).catch(function (err) {
                console.log("err"+err);
            })
            form.resetFields();
            this.setState({
                visible: false,
            });
        });
    };

    pageChange=(current, pageSize)=>{
        var offset = (current-1)*10
        if(this.state.auth){
            this.getData(offset)
        }else {
            this.getPassTag(offset)
        }

    };
    getApplys =(type)=>{
        if("auth" == type){
            this.setState({
                auth:true
            })
            this.getData(0)
        }
        if("pass" == type){
            this.setState({
                auth:false
            })
            this.getPassTag(0)
        }

    }
    onPass = (key,company,position,tagTimes,name) =>{
        var that = this
        var approver_id = 1
        var approver_name ="admin"
        var params = "uid="+key+"&company="+company+"&postion="+position+"&approver_id="+approver_id+"&approver_name="+approver_name+"&times="+tagTimes+"&name="+name
        axios.get(config.baseUrl+"usertagweb/v1/approveUser?"+params,{headers:{"Content-Type":'application/json'}}).then(function (response){
            if(response.data.code==200&&response.data.success){
                alert("审核成功")
                that.getData(0)
            }else {
                alert(response.data.msg);
            }
        }).catch(function (error) {
            console.log(error)
        })
    }
    loginOut = () =>{
        localStorage.removeItem("userName");
        this.props.history.push('/eos_tag_web');
    }
    render(){
        const {total,auth, size, dataSource, loading } = this.state;
        let pagination = {
            total: total,
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
                            <div style={{float:"right"}}>
                                {/*<span>欢迎<span style={{color:'#108ee9'}}>{localStorage.getItem("userName")}</span>,</span>*/}
                                <a onClick={this.loginOut}>退出登陆</a>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={24}>
                        <Col className="gutter-row" sm={8}>
                            {this.state.auth?
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
                    <FormTable
                        dataSource={dataSource}
                        auth={auth}
                        onPass={this.onPass}
                        editClick={this.editClick}
                        loading={loading}
                        pagination={pagination}
                    />
                </div>
            </div>
        )
    }
}