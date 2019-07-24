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
class QuotaTypeSetting extends Component {
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
    const { isShowQuotaType } = this.props;
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
          visible={isShowQuotaType}
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
                <Col span={16} offset={2}>
                  <FormItem {...formItemLayout} label="鉴定标准">
                    {getFieldDecorator('invoiceType', {
                      rules: [
                        {
                          required: true,
                          message: '',
                        },
                      ],
                    })(
                      <Select placeholder="鉴定标准" style={{ width: '100%' }}>
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
                <Col span={4} className={styles.alignCenter}>
                  <div style={{ fontSize: '14px', color: '#000', marginTop: '15px' }}>赔付比例</div>
                </Col>
                <Col span={20}>
                  <Row>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label="级别：">
                        {getFieldDecorator('payoutGrade')(<Input placeholder="级别" />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label="比例：">
                        {getFieldDecorator('payoutRatio')(<Input addonAfter="%" />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
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
                  <Row>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label="级别：">
                        {getFieldDecorator('payoutGrade')(<Input placeholder="级别" />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
                      <FormItem {...formItemLayout} label="比例：">
                        {getFieldDecorator('payoutRatio')(<Input addonAfter="%" />)}
                      </FormItem>
                    </Col>
                    <Col span={8}>
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
                <Col span={16} offset={2}>
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

export default QuotaTypeSetting;
