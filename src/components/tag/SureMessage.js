import React, { Component } from 'react';
import { Modal, Form, Input, Radio, InputNumber, Cascader, Select, AutoComplete } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const options = [];

class SureMessage extends Component{

    constructor(props){
        super(props);
        this.state = {
            autoCompleteResult: [],
            passType:2,
            tagType:0,
            tagName:"无标签"
        };
    }
    handleChange = (val) =>{
        this.setState({
            passType:val
        })
    }
    handleTagChange =(tag)=>{
        if(tag == 0){
            this.setState({
                tagName:"无标签",
                tagType:tag
            })
        }
        if(tag == 1){
            this.setState({
                tagName:"交易所",
                tagType:tag
            })
        }
        if(tag == 2){
            this.setState({
                tagName:"媒体",
                tagType:tag
            })
        }
        if(tag == 3){
            this.setState({
                tagName:"项目方",
                tagType:tag
            })
        }
        if(tag == 4){
            this.setState({
                tagName:"投资方",
                tagType:tag
            })
        }
    }
    render(){
        const { visible, onCancel, onCreate, okText, title, postData} = this.props;
        const userData = postData;
        const FormItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 16 },
        };
        const PhoneBefore = <p style={{ width: 40 }}>+86</p>;
        return (
            <Modal
                visible={visible}
                title={title}
                okText={okText}
                onCancel={onCancel}
                onOk={()=>{onCreate(this.state.passType,this.state.tagType)}}
                closable={true}
                maskClosable={true}
                keyboard={false}
                destroyOnClose={true}
            >
                <Form layout="horizontal">
                    <FormItem label="认证等级" {...FormItemLayout} hasFeedback>
                        <Select defaultValue="个人认证" onChange={this.handleChange}>
                            <Option value="1">企业认证</Option>
                            <Option value="2">个人认证</Option>
                            <Option value="3">大V认证</Option>
                        </Select>
                    </FormItem>
                    <FormItem label="认证标签" {...FormItemLayout} hasFeedback>
                        <Select value={this.state.tagName}  onChange={this.handleTagChange}>
                            <Option value="0">无标签</Option>
                            <Option value="1">交易所</Option>
                            <Option value="2">媒体</Option>
                            <Option value="3">项目方</Option>
                            <Option value="4">投资方</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const SureMessageForm = Form.create()(SureMessage);
export default SureMessageForm;