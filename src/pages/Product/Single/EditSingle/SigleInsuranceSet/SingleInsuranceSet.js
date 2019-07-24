/* eslint-disable prefer-destructuring,react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Row, Select, Icon, Checkbox, Card, Tooltip, AutoComplete } from 'antd';
import styles from '../../../product.less';
import CostTypeSetting from '../../../Components/CostTypeSetting/costTypeSetting';
import QuotaTypeSetting from '../../../Components/QuotaTypeSetting/quotaTypeSetting';
import AllowanceTypeSetting from '../../../Components/AllowanceTypeSetting/allowanceTypeSetting';

import checkCircle from '../../../images/check-circle.svg';
import pending from '../../../images/pending.svg';

const FormItem = Form.Item;
const Option = Select.Option;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class SingleInsuranceSet extends Component {
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
    const { getFieldDecorator } = this.props.form;
    const { isShowCostType, isShowQuotaType, isAllowanceType } = this.state;
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
    const cardTitle = (
      <div>
        <span className={styles.cardTitle}>责任一：住院医疗费用保险金</span>
        <span className={styles.cardTitle}>0089276</span>
      </div>
    );
    const toolTipsTitle = <span>有必填项未配置</span>;
    const insuranceData = ['南京国寿', '东吴在线'];
    return (
      <div>
        <div className={styles.uiBody}>
          <Row style={{ width: '90%', margin: '0 auto' }}>
            <Col span={8}>
              <FormItem {...formItemLayout} label="险种名称">
                {getFieldDecorator('insuranceName', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <AutoComplete
                    style={{ width: '100%' }}
                    dataSource={insuranceData}
                    placeholder="输入险种名称进行查询"
                    filterOption={(inputValue, option) =>
                      option.props.children.indexOf(inputValue) !== -1
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8} className={styles.alignVertical}>
              险种类型：费用型
            </Col>
            <Col span={8} className={styles.alignRight}>
              <div className={styles.textExtend}>
                收起责任
                <Icon type="up" />
                {/* 展开责任<Icon type="down" /> */}
              </div>
            </Col>
          </Row>
          <div className="duty-list">
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
            <div style={{ marginBottom: '20px' }}>
              <Row style={{ height: '244px' }}>
                <Col span={1} className={styles.alignCenter}>
                  <Checkbox checked style={{ marginTop: '120px' }} />
                </Col>
                <Col span={23}>
                  <Card
                    title={cardTitle}
                    bordered={false}
                    style={{
                      border: '1px solid #b8f2ea',
                      borderRadius: '2px',
                      boxShadow: '2px 2px 2px #eee',
                    }}
                    headStyle={{
                      backgroundColor: '#b8f2ea',
                      padding: '0 10px',
                      borderBottom: '1px solid #b8f2ea',
                    }}
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
                            <div onClick={this.openCostTypeSetting}>
                              详细配置 <img src={checkCircle} alt="详细配置" />
                            </div>
                          </Tooltip>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <Row style={{ height: '244px' }}>
                <Col span={1} className={styles.alignCenter}>
                  <Checkbox checked style={{ marginTop: '120px' }} />
                </Col>
                <Col span={23}>
                  <Card
                    title={cardTitle}
                    bordered={false}
                    style={{
                      border: '1px solid #b8f2ea',
                      borderRadius: '2px',
                      boxShadow: '2px 2px 2px #eee',
                    }}
                    headStyle={{
                      backgroundColor: '#b8f2ea',
                      padding: '0 10px',
                      borderBottom: '1px solid #b8f2ea',
                    }}
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
                            <div onClick={this.openAllowanceTypeSetting}>
                              详细配置 <img src={checkCircle} alt="详细配置" />
                            </div>
                          </Tooltip>
                        </div>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
          </div>
        </div>
        <div className={styles.uiBody}>
          <Row>
            <Col span={8}>
              <FormItem {...formItemLayout} label="险种名称">
                {getFieldDecorator('insuranceName', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <Select placeholder="险种名称">
                    <Option value="002" key="002">
                      江吴财险
                    </Option>
                    <Option value="003" key="003">
                      东吴在线
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8} className={styles.alignVertical}>
              险种类型：费用型
            </Col>
            <Col span={8} className={styles.alignRight}>
              <div className={styles.textExtend}>
                收起责任
                <Icon type="up" />
                {/* 展开责任<Icon type="down" /> */}
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles.uiFooter}>
          <Row>
            <Col span={24} className={styles.alignRight}>
              <Button icon="plus" type="primary">
                增加险种
              </Button>
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

export default SingleInsuranceSet;
