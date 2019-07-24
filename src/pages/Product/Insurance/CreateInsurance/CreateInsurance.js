/* eslint-disable prefer-destructuring,react/destructuring-assignment,arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Modal, Radio, Row, Select } from 'antd';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class CreateInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  formOnSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        this.props.modalHandleCancel();
        this.props.history.push({
          pathname: '/product/insurance/add',
          state: { ...values },
        });
      }
    });
  };

  render() {
    const {
      product: {
        companyList: { data: companyList },
      },
      loading,
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    return (
      <div>
        <Modal
          visible={this.props.isShowModal}
          title="创建新险种"
          onOk={this.props.modalHandleOk}
          onCancel={this.props.modalHandleCancel}
          footer={[
            <Button key="submit" type="primary" loading={loading} onClick={this.formOnSubmit}>
              保存
            </Button>,
          ]}
        >
          <Form onSubmit={this.formOnSubmit}>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="所属保险公司">
                  {getFieldDecorator('company_code', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属保险公司!',
                      },
                    ],
                  })(
                    <Select placeholder="所属保险公司" style={{ width: '80%' }}>
                      {companyList &&
                        companyList.map(item => {
                          return (
                            <Option value={item.company_code} key={item.company_code}>
                              {item.company_name}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...formItemLayout} label="险种类型">
                  {getFieldDecorator('insurance_model', {
                    rules: [
                      {
                        required: true,
                        message: '请选择险种类型!',
                      },
                    ],
                  })(
                    <Select placeholder="请选择险种类型" style={{ width: '80%' }}>
                      <Option value="expense" key="expense">
                        费用型
                      </Option>
                      <Option value="allowance" key="allowance">
                        津贴型
                      </Option>
                      <Option value="quota" key="quota">
                        定额型
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormItem {...formItemLayout} label="险种性质">
                  {getFieldDecorator('insurance_scope', {
                    initialValue: 'personal',
                    rules: [
                      {
                        required: true,
                        message: '请选择险种类型!',
                      },
                    ],
                  })(
                    <RadioGroup>
                      <Radio value="personal">个险</Radio>
                      <Radio value="group">团险</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default CreateInsurance;
