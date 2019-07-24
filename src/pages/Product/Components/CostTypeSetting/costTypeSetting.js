/* eslint-disable jsx-a11y/label-has-for,max-len,prefer-destructuring,react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Modal, Row, Select, Radio } from 'antd';
import styles from '../../product.less';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const TextArea = Input.TextArea;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class CostTypeSetting extends Component {
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
    const { isShowCostType } = this.props;
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
    return (
      <div>
        <Modal
          title="责任二 住院前后门诊医疗费用保险金 详细配置"
          visible={isShowCostType}
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
                <Col span={16}>
                  <FormItem {...formItemLayout} label="发票类型">
                    {getFieldDecorator('invoiceType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="发票类型" style={{ width: '100%' }}>
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
                <Col span={16}>
                  <FormItem {...formItemLayout} label="免赔类型：">
                    {getFieldDecorator('freeCompensationType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="免赔类型" style={{ width: '100%' }}>
                        <Option value="002" key="002">
                          无
                        </Option>
                        <Option value="003" key="003">
                          减免
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="限额类型：">
                    {getFieldDecorator('limitType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="免赔类型" style={{ width: '100%' }}>
                        <Option value="002" key="002">
                          无
                        </Option>
                        <Option value="003" key="003">
                          减免
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="次限天数：">
                    {getFieldDecorator('secondCompensationDays')(
                      <Input placeholder="天数" addonAfter="天" />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="年限天数：">
                    {getFieldDecorator('secondCompensationDays')(
                      <Input placeholder="天数" addonAfter="天" />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="合理费用范围：">
                    {getFieldDecorator('reasonableFeeRange', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="合理费用范围" style={{ width: '100%' }}>
                        <Option value="002" key="002">
                          无
                        </Option>
                        <Option value="003" key="003">
                          减免
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={16}>
                  <FormItem {...formItemLayout} label="赔付比例类型：">
                    {getFieldDecorator('payoutRatioType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="赔付比例类型" style={{ width: '100%' }}>
                        <Option value="002" key="002">
                          均一
                        </Option>
                        <Option value="003" key="003">
                          不均一
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="比例：">
                    {getFieldDecorator('payoutRatio', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(<Input placeholder="比例" addonAfter="%" />)}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={18}>
                  <FormItem {...formItemLayout} label="是否承担既往症：">
                    {getFieldDecorator('isOrNotBearThePast', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <RadioGroup>
                        <Radio value={1}>不承担</Radio>
                        <Radio value={2}>承担一般既往症</Radio>
                        <Radio value={3}>承担所有既往症</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className="setting-item">
              <Row>
                <Col span={16}>
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
export default CostTypeSetting;
