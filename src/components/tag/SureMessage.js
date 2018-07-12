import React, { Component } from 'react';
import { Modal, Form, Input, Radio, InputNumber, Cascader, Select, AutoComplete } from 'antd';
import axios from 'axios';

const FormItem = Form.Item;
const Option = Select.Option;
const AutoCompleteOption = AutoComplete.Option;
const options = [];

class SureMessage extends Component{
    state = {
        autoCompleteResult: [],
        passType:2
    };
    constructor(props){
        super(props);

    }
    handleChange = (val) =>{
        this.setState({
            passType:val
        })
    }
    render(){
        const { visible, onCancel, onCreate, form, okText, title} = this.props;
        const { getFieldDecorator } = form;
        const { autoCompleteResult } = this.state;
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
                onOk={()=>{onCreate(this.state.passType)}}
                closable={false}
                maskClosable={false}
                keyboard={false}
                destroyOnClose={false}
            >
                <Form layout="horizontal">
                    <FormItem label="认证等级" {...FormItemLayout} hasFeedback>
                        <Select defaultValue="个人认证" onChange={this.handleChange}>
                            <Option value="1">企业认证</Option>
                            <Option value="2">个人认证</Option>
                            <Option value="3">大V认证</Option>
                        </Select>
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const SureMessageForm = Form.create()(SureMessage);
export default SureMessageForm;