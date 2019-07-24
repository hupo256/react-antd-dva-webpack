/* eslint-disable jsx-a11y/label-has-for,max-len,prefer-destructuring,react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Modal, Row, Select } from 'antd';
import styles from '../../product.less';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class AllowanceTypeSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    const { loading } = this.state;
    console.log(loading);
  }

  handleCancel = () => {
    this.props.handleCancel();
  };

  render() {
    const { isShowAllowanceType } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const formFixItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };
    return (
      <div>
        <Modal
          title="责任二 住院前后门诊医疗费用保险金 详细配置"
          visible={isShowAllowanceType}
          width={1000}
          maskClosable={false}
          onCancel={this.handleCancel}
          onOk={this.handleDeleteBatchOk}
          footer={[
            <Button
              className={styles.cusModalButton}
              key="submit"
              onClick={this.handleDeleteBatchOk}
            >
              保存
            </Button>,
          ]}
        >
          <div className={styles.cusModalBody}>
            <div className="setting-item">
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="事件类型">
                    {getFieldDecorator('eventType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="事件类型" style={{ width: '100%' }}>
                        <Option value="002" key="002">
                          收据
                        </Option>
                        <Option value="003" key="003">
                          收据2
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="免陪类型">
                    {getFieldDecorator('freeCompensatoryType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="免陪类型" style={{ width: '100%' }}>
                        <Option value="002" key="002">
                          次免赔
                        </Option>
                        <Option value="003" key="003">
                          年免赔
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={14}>
                  <Row>
                    <Col span={10}>
                      <FormItem {...formFixItemLayout} label="次免赔的定义：">
                        {getFieldDecorator('franchiseDefinition')(
                          <Select placeholder="次免赔的定义" style={{ width: '120px' }}>
                            <Option value="002" key="002">
                              同一次意外事故
                            </Option>
                            <Option value="003" key="003">
                              同一次意外事故
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem {...formFixItemLayout} label="次免赔天数：">
                        {getFieldDecorator('franchiseDays')(
                          <Input addonAfter="天" style={{ width: '80px' }} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <Button
                        shape="circle"
                        size="small"
                        icon="plus"
                        className={styles.btnRoundPlus}
                      />
                      <Button
                        shape="circle"
                        size="small"
                        icon="minus"
                        className={styles.btnRoundMinus}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="限额类型">
                    {getFieldDecorator('freeCompensatoryType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="限额类型" style={{ width: '100%' }}>
                        <Option value="002" key="002">
                          次限额
                        </Option>
                        <Option value="003" key="003">
                          年限额
                        </Option>
                        <Option value="003" key="003">
                          特殊限额
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={14}>
                  <Row>
                    <Col span={10}>
                      <FormItem {...formFixItemLayout} label="次限额的定义：">
                        {getFieldDecorator('franchiseDefinition')(
                          <Select placeholder="次限额的定义" style={{ width: '120px' }}>
                            <Option value="002" key="002">
                              同一次意外事故
                            </Option>
                            <Option value="003" key="003">
                              同一次意外事故
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={10}>
                      <FormItem {...formFixItemLayout} label="次限天数：">
                        {getFieldDecorator('franchiseDays')(
                          <Input addonAfter="天" style={{ width: '80px' }} />
                        )}
                      </FormItem>
                    </Col>
                    <Col span={4}>
                      <Button
                        shape="circle"
                        size="small"
                        icon="plus"
                        className={styles.btnRoundPlus}
                      />
                      <Button
                        shape="circle"
                        size="small"
                        icon="minus"
                        className={styles.btnRoundMinus}
                      />
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="日津贴额：">
                    {getFieldDecorator('DailyAllowanceAmount')(<Input addonAfter="元" />)}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={10}>
                  <FormItem {...formItemLayout} label="特别约定：">
                    {getFieldDecorator('specialDate')(<TextArea autosize={{ minRows: 2 }} />)}
                  </FormItem>
                </Col>
              </Row>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default AllowanceTypeSetting;
