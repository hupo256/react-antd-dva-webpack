import React, { Component } from 'react';
// import { Button, Card, Col, Form, Icon, Input, message, Row, Table, Radio, Modal } from 'antd';
import styles from './style.less';
import head from '../../assets/Group/头插画.svg';

class GroupHeader extends Component {
  componentDidMount() {}

  render() {
    const { name, timeRange } = this.props;
    return (
      <div className={styles.header}>
        <img className={styles.headerimg} src={head} alt="" />
        <div>
          <div className={styles.headername}>{name}</div>
          <div className={styles.headercenter}>团险报告</div>
          <div className={styles.headertime}>{timeRange}</div>
        </div>
      </div>
    );
  }
}

export default GroupHeader;
