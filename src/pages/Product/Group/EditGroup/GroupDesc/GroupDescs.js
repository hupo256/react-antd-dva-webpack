/* eslint-disable react/no-did-mount-set-state,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, DatePicker, Form, Input, Row, Select } from 'antd';
import styles from '../../../product.less';

const FormItem = Form.Item;
// const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class GroupDesc extends Component {
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
                    //       <Option value={item.companyCode} key={item.companyCode}>
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
            <FormItem {...formItemLayout} label="团体名称">
              {getFieldDecorator('groupName', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
              })(<Input placeholder="输入团体名称" />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="团体保单号">
              {getFieldDecorator('groupPolicyId', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
              })(<Input placeholder="输入团体保单号" />)}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="保单有限期">
              {getFieldDecorator('requirementType', {
                rules: [
                  {
                    required: true,
                    message: '',
                  },
                ],
              })(<RangePicker style={{ width: '100%' }} />)}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <FormItem {...formItemLayout} label="团体限额">
              {getFieldDecorator('groupLimit')(
                <Input placeholder="输入团体限额" addonAfter="元" />
              )}
            </FormItem>
          </Col>
          <Col span={12}>
            <FormItem {...formItemLayout} label="团单特别约定">
              {getFieldDecorator('groupSpecialDate')(<Input placeholder="输入特别约定" />)}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }
}

export default GroupDesc;
