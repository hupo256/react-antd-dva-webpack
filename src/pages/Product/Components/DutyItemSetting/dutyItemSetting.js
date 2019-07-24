/* eslint-disable prefer-destructuring,react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Col, Form, Row, Checkbox, Card, Tooltip } from 'antd';
import styles from '../../product.less';
import CostTypeSetting from '../CostTypeSetting/costTypeSetting';
import QuotaTypeSetting from '../QuotaTypeSetting/quotaTypeSetting';
import AllowanceTypeSetting from '../AllowanceTypeSetting/allowanceTypeSetting';

import pending from '../../images/pending.svg';

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class DutyItemSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowCostType: false,
      isShowQuotaType: false,
      isAllowanceType: false,
    };
  }

  // 取消详细配置(费用型）
  handleCostTypeSettingCancel = () => {
    this.setState({
      isShowCostType: false,
    });
  };

  // 详细配置(费用型）
  openCostTypeSetting = () => {
    this.setState({
      isShowCostType: true,
    });
  };

  // 取消详细配置(定额型）
  handleQuotaTypeSettingCancel = () => {
    this.setState({
      isShowQuotaType: false,
    });
  };

  // 详细配置(定额型）
  openQuotaTypeSetting = () => {
    this.setState({
      isShowQuotaType: true,
    });
  };

  // 取消详细配置(津贴型）
  handleAllowanceTypeSettingCancel = () => {
    this.setState({
      isAllowanceType: false,
    });
  };

  // 详细配置(津贴型）
  openAllowanceTypeSetting = () => {
    this.setState({
      isAllowanceType: true,
    });
  };

  render() {
    const { isShowCostType, isShowQuotaType, isAllowanceType } = this.state;
    const cardTitle = (
      <div>
        <span className={styles.cardTitle}>责任一：住院医疗费用保险金</span>
        <span className={styles.cardTitle}>0089276</span>
      </div>
    );
    const toolTipsTitle = <span>有必填项未配置</span>;
    return (
      <div>
        <div style={{ marginBottom: '20px' }}>
          <Row style={{ height: '244px' }}>
            <Col span={1} className={styles.alignCenter}>
              <Checkbox style={{ marginTop: '120px' }} />
            </Col>
            <Col span={23}>
              <Card
                title={cardTitle}
                headStyle={{ backgroundColor: '#f0f2f5', padding: '0 10px' }}
                bodyStyle={{ padding: '30px 10px 10px 10px' }}
              >
                <Row style={{ width: '60%', marginBottom: '10px' }}>
                  <Col span={6} className={styles.alignRight}>
                    出险类型：
                  </Col>
                  <Col span={6}>疾病</Col>
                  <Col span={6} className={styles.alignRight}>
                    就诊类型：
                  </Col>
                  <Col span={6}>住院</Col>
                </Row>
                <Row style={{ width: '60%', marginBottom: '10px' }}>
                  <Col span={6} className={styles.alignRight}>
                    索赔事故性质：
                  </Col>
                  <Col span={6}>住院医疗</Col>
                  <Col span={6} className={styles.alignRight}>
                    医院等级：
                  </Col>
                  <Col span={6}>一级及以上</Col>
                </Row>
                <Row style={{ width: '60%', marginBottom: '10px' }}>
                  <Col span={6} className={styles.alignRight}>
                    承保责任范围：
                  </Col>
                  <Col span={6}>不限</Col>
                  <Col span={6} className={styles.alignRight}>
                    医院性质：
                  </Col>
                  <Col span={6}>公立</Col>
                </Row>
                <Row style={{ width: '60%', marginBottom: '10px' }}>
                  <Col span={6} className={styles.alignRight}>
                    观察期：
                  </Col>
                  <Col span={6}>30天</Col>
                  <Col span={6} className={styles.alignRight}>
                    医院社保性质：
                  </Col>
                  <Col span={6}>定点</Col>
                </Row>
                <Row>
                  <Col span={24} className={styles.alignRight}>
                    <div style={{ color: '#529ad8', cursor: 'pointer' }}>
                      <Tooltip title={toolTipsTitle} placement="topRight">
                        <div onClick={this.openQuotaTypeSetting}>
                          详细配置 <img src={pending} alt="详细配置" />
                        </div>
                      </Tooltip>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </div>
        <CostTypeSetting
          isShowCostType={isShowCostType}
          handleCancel={this.handleCostTypeSettingCancel}
          history={this.props.history}
        />
        <QuotaTypeSetting
          isShowQuotaType={isShowQuotaType}
          handleCancel={this.handleQuotaTypeSettingCancel}
          history={this.props.history}
        />
        <AllowanceTypeSetting
          isShowAllowanceType={isAllowanceType}
          handleCancel={this.handleAllowanceTypeSettingCancel}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default DutyItemSetting;
