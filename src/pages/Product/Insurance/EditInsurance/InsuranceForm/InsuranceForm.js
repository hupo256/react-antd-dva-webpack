/* eslint-disable prefer-destructuring,react/destructuring-assignment,arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Input, Row, Select } from 'antd';
import styles from '../../../product.less';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class InsuranceForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
    };
  }

  render() {
    // const { loading } = this.state;

    const { currentCompany } = this.props;
    console.log('currentCompany', currentCompany);
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
        <div className={styles.uiTitle}>费用型险种</div>
        <div className={styles.uiBody}>
          <Row>
            <Col span={10}>
              {
                <FormItem {...formItemLayout} label="所属保险公司">
                  {getFieldDecorator('companyCode', {
                    rules: [
                      {
                        required: true,
                        message: '请选择所属保险公司!',
                      },
                    ],
                  })(
                    <Select placeholder="保险公司">
                      {currentCompany &&
                        currentCompany.map(item => {
                          return (
                            <Option value={item.companyCode} key={item.companyCode}>
                              {item.companyName}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              }
            </Col>
            <Col span={14}>
              <FormItem {...formItemLayout} label="险种名称">
                {getFieldDecorator('insuranceName', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(<Input placeholder="险种名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="险种代码">
                {getFieldDecorator('insuranceCode', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(<Input placeholder="险种代码" />)}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem {...formItemLayout} label="投保年龄">
                {getFieldDecorator('insuranceAge', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <div className="fix-input">
                    <Input placeholder="年龄" style={{ width: 100 }} addonAfter="岁" />
                    <span style={{ padding: '0 10px 0 0' }}> ~ </span>
                    <Input style={{ width: 100 }} placeholder="年龄" addonAfter="岁" />
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="职业类别">
                {getFieldDecorator('careerCode', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <Select placeholder="职业类别">
                    <Option value="000" key="001">
                      请选择
                    </Option>
                    <Option value="002" key="002">
                      农业
                    </Option>
                    <Option value="003" key="003">
                      林业
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem {...formItemLayout} label="投保地区">
                {getFieldDecorator('insuredArea')(
                  <Select placeholder="投保地区">
                    <Option value="0000" key="001">
                      请选择
                    </Option>
                    <Option value="0002" key="002">
                      北京
                    </Option>
                    <Option value="0003" key="003">
                      上海
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={10}>
              <FormItem {...formItemLayout} label="投保份数">
                {getFieldDecorator('insuranceCode')(
                  <Input placeholder="投保份数" addonAfter="份" />
                )}
              </FormItem>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default InsuranceForm;
