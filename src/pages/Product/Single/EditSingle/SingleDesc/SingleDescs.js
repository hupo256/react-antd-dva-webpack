/* eslint-disable prefer-destructuring,react/destructuring-assignment */
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
class SingleDesc extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { loading } = this.state;
    console.log(loading);
    // const { list: companyList } = this.props.company.data;
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
      <div className={styles.uiBody}>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="所属保险公司">
              {getFieldDecorator('companyCode', {
                rules: [
                  {
                    required: true,
                    message: '请选择所属保险公司!',
                  },
                ],
              })(
                <Select placeholder="所属保险公司">
                  {
                    // companyList && (
                    //   companyList.map((item) => {
                    //     return (
                    //       <Option
                    //         value={item.companyCode}
                    //         key={item.companyCode}
                    //       >
                    //         {item.companyName}
                    //       </Option>
                    //     );
                    //   })
                    // )
                  }
                </Select>
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="产品代码">
              {getFieldDecorator('productCode', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
              })(<Input placeholder="产品代码" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="产品名称">
              {getFieldDecorator('productName', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
              })(<Input placeholder="产品名称" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="告知要求">
              {getFieldDecorator('requirementType')(
                <Select placeholder="请选择">
                  <Option value="002" key="002">
                    通知
                  </Option>
                  <Option value="003" key="003">
                    不通知
                  </Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}

export default SingleDesc;
