/* eslint-disable react/no-did-mount-set-state,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */

import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class ViewInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { path } = this.props.match;
    console.log(path);
  }

  render() {
    return <div>查看险种详情页面</div>;
  }
}

export default ViewInsurance;
