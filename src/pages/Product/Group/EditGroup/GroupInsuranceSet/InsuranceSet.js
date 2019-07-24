/* eslint-disable react/no-did-mount-set-state,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Select, Form, Input, Button } from 'antd';
import styles from '../../../product.less';
import GradeModal from '../../../Components/GradeModal/GradeModal';
import DutyItemSetting from '../../../Components/DutyItemSetting/dutyItemSetting';
import gInitial from '../../../images/g-initial.svg';

const FormItem = Form.Item;
const Option = Select.Option;
@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class GroupInsuranceSet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      isShowGradeModal: false,
      isAddGrade: false,
      currentTabIndex: 0,
    };
  }

  // 创建层级
  addGrade = () => {
    this.setState({
      isShowGradeModal: true,
      isAddGrade: true,
    });
  };

  // 编辑层级
  editGrade = () => {
    this.setState({
      isShowGradeModal: true,
      isAddGrade: false,
    });
  };

  handleDeleteGrade = () => {
    console.log('delete grade');
  };

  handleSaveGrade = () => {
    console.log('save grade');
  };

  // 取消创建层级
  handleCancelGradeModal = () => {
    this.setState({
      isShowGradeModal: false,
    });
  };

  tabBarOnClick = index => {
    console.log(index);
  };

  tabBarIndexClass = index => {
    const { currentTabIndex } = this.state;
    console.log('index', index);
    console.log('currentTabIndex', currentTabIndex);
    return index === currentTabIndex ? 'tab-bar-item tab-bar-item-active' : 'tab-bar-item';
  };

  tabContentClass = index => {
    const { currentTabIndex } = this.state;
    return index === currentTabIndex
      ? 'tab-content-item tab-content-item-active'
      : 'tab-content-item';
  };

  render() {
    const { loading, isShowGradeModal, isAddGrade } = this.state;
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
    console.log(loading);
    return (
      <div className={styles.tabsBox}>
        <Row gutter={16}>
          <Col span={4}>
            <ul className={styles.gradeList}>
              {['一级领导', '二级领导'].map((item, index) => {
                return (
                  <li
                    className={this.tabBarIndexClass(index)}
                    onClick={() => {
                      this.setState({ currentTabIndex: index });
                    }}
                    key={item}
                  >
                    <span className="grade-title">{item}</span>
                    <Icon
                      className="grade-edit"
                      type="edit"
                      theme="outlined"
                      onClick={this.editGrade}
                    />
                  </li>
                );
              })}
              <li className={styles.gradeItemLast} onClick={this.addGrade}>
                <span className="grade-title">
                  <Icon type="plus" theme="outlined" /> 新建层级
                </span>
              </li>
            </ul>
          </Col>
          <Col span={18}>
            <div className={styles.groupContainer}>
              <div className={styles.initGrade} style={{ display: 'none' }}>
                <figure>
                  <img src={gInitial} alt="创建新层级" />
                  <p>请先在左侧创建新层级</p>
                </figure>
              </div>
              <div className={styles.uiBody}>
                <div className={this.tabContentClass(0)}>
                  <Row>
                    <Col span={13}>
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
                      <span>险种类型：费用型</span>
                      <span style={{ marginLeft: '15px' }}>
                        险种保额：
                        <Input style={{ width: '60px' }} />
                      </span>
                    </Col>
                    <Col span={3} className={styles.alignRight}>
                      <div className={styles.textExtend}>
                        收起责任
                        <Icon type="up" />
                        {/* 展开责任<Icon type="down" /> */}
                      </div>
                    </Col>
                  </Row>
                  <div className="duty-list">
                    <DutyItemSetting />
                  </div>
                </div>
                <div className={this.tabContentClass(1)}>
                  <Row>
                    <Col span={13}>
                      <FormItem {...formItemLayout} label="险种名称22">
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
                      <span>险种类型：费用型</span>
                      <span style={{ marginLeft: '15px' }}>
                        险种保额：
                        <Input style={{ width: '60px' }} />
                      </span>
                    </Col>
                    <Col span={3} className={styles.alignRight}>
                      <div className={styles.textExtend}>
                        收起责任
                        <Icon type="up" />
                        {/* 展开责任<Icon type="down" /> */}
                      </div>
                    </Col>
                  </Row>
                  <div className="duty-list">
                    <DutyItemSetting />
                  </div>
                </div>
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
            </div>
          </Col>
        </Row>
        <GradeModal
          modalTitle={isAddGrade ? '创建新层级' : '编辑层级'}
          isShowGradeModal={isShowGradeModal}
          isAddGrade={isAddGrade}
          handleCancel={this.handleCancelGradeModal}
          handleDeleteGrade={this.handleDeleteGrade}
          handleSaveGrade={this.handleSaveGrade}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default GroupInsuranceSet;
