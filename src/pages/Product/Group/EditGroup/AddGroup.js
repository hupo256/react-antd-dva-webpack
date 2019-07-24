/* eslint-disable react/no-did-mount-set-state,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Button, Row, Col, Form, Breadcrumb } from 'antd';
import styles from '../../product.less';

import GroupDesc from './GroupDesc/GroupDescs';
import GroupInsuranceSet from './GroupInsuranceSet/InsuranceSet';

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class AddGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
    };
  }

  componentDidMount() {
    const { path } = this.props.match;
    console.log(this.props);
    if (path.split('/').includes('add')) {
      this.setState({
        isAdd: true,
      });
    } else {
      this.setState({
        isAdd: false,
      });
    }
  }

  // 保存险种
  saveEditGroup = () => {
    console.log('save');
  };

  // 取消创建
  cancelEditGroup = () => {
    this.props.history.push('/product/group');
  };

  render() {
    const { isAdd } = this.state;
    const { code: insuranceCode } = this.props.match.params;
    return (
      <div>
        <div className={styles.uiHeader}>
          <Row>
            <Col span={18}>
              <Breadcrumb separator="/">
                <Breadcrumb.Item className={styles.breadCrumb}>
                  <Link to="/product/group">保单列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className={styles.breadCrumb}>
                  {!isAdd ? `团单${insuranceCode}` : '团单配置'}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={6} className={styles.alignRight}>
              <Button className={styles.tableButton} onClick={this.saveEditGroup}>
                保存
              </Button>
              <Button type="primary" ghost onClick={this.cancelEditGroup}>
                {!isAdd ? '取消' : '取消配置'}
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles.fixCard}>
          <Form onSubmit={this.queryInsuranceList}>
            <div className={styles.uiTitle}>团单概览</div>
            <GroupDesc />
            <div className={styles.uiTitle}>层级及险种配置</div>
            <GroupInsuranceSet />
          </Form>
        </div>
      </div>
    );
  }
}

export default AddGroup;
