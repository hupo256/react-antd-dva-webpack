/* eslint-disable react/no-did-mount-set-state,no-else-return, consistent-return,no-param-reassign,prefer-destructuring,react/destructuring-assignment,no-return-assign,arrow-body-style,react/no-array-index-key,no-case-declarations,camelcase,no-plusplus,one-var,react/no-unused-state,prefer-const */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
// import _ from 'lodash';
import {Button,Row,Col,Form,Breadcrumb,Modal, Icon, Tabs,message,Input,Checkbox, Select,} from 'antd';
import styles from '../../product.less';

const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;

const itemType = ['整数', '小数', '字符串'];
const itemModel = {
  input: '输入框',
  radio: '单选框',
  checkbox: '复选框',
  select: '单选下拉框',
  selectMultiple: '复选下拉框',
  textArea: '多行文本框',
  range: '区间输入框',
};

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class EditField extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      isShowTipsModal: false,
      isAddTips: true,
      fieldItem: {},
      activeKey: '1',
    };
  }

  componentDidMount() {
    const {
      dispatch,
      location,
      match: { path },
    } = this.props;

    if (path.split('/').includes('add')) {
      const { fieldItem } = this.state;
      dispatch({
        type: 'product/fetchCompanyList',
        callback: res => {
          if (res.status === 1) {
            fieldItem.company_list = res.data;
            fieldItem.is_array = true;
            fieldItem.company_list.unshift({
              company_code: 'common',
              company_name: '通用'
            });
            this.setState({
              fieldItem,
            });
          } else {
            message.error(res.message);
          }
        },
      });

      this.setState({
        isAdd: true,
      });
    } else {
      const { item_id, item_label } = location.state;
      this.setState({
        isAdd: false,
        item_label,
      });

      dispatch({
        type: 'product/getFieldItem',
        payload: {
          item_id,
        },
        callback: res => {
          console.log(res.data);
          if (res.status === 1) {
            this.setState({
              fieldItem: res.data,
            });
          } else {
            message.error(res.message);
          }
        },
      });
    }
  }

  onCheckboxHandle = (e, key) => {
    const { fieldItem } = this.state;
    fieldItem[key] = e.target.checked;

    this.setState({
      fieldItem,
    });
  };

  onSelectChangeHandle = (v, itemKey) => {
    if (v.target) v = v.target.value;
    console.log(v);
    const { fieldItem } = this.state;
    fieldItem[itemKey] = v;
    this.setState({
      fieldItem,
    });
  };

  onInputChangeHandle = (e, itemKey) => {
    const { fieldItem } = this.state;
    fieldItem[itemKey] = e.target.value;
    this.setState({
      fieldItem,
    });
  };

  // 保存险种
  saveEditInsurance = e => {
    e.preventDefault();
    const { fieldItem } = this.state;
    const { dispatch } = this.props;

    delete fieldItem.is_range;  // 需要接口支持，暂时del
    delete fieldItem.company_list;  // 需要接口支持，暂时del

    this.props.form.validateFields((err, values) => {
      if (err) {
        if(!values.item_category || !values.item_subcategory || !values.company_code)
        this.setState({ activeKey: '2'})
        return;
      }

      dispatch({
        type: 'product/editFieldItem',
        payload: {
          ...fieldItem,
        },
        callback: res => {
          if (res.status === 1) {
            message.success(res.message, 2).then(() => {
              return this.props.history.push('/product/fields');
            });
          } else {
            message.error(res.message);
          }
        },
      });
    })
  };

  tabsChange = (activeKey) => {
    this.setState({ activeKey })
  }

  // 取消创建
  cancelEditInsurance = () => {
    const {
      match: { path },
    } = this.props;

    if (path.split('/').includes('add')) {
      this.setState({ isAddTips: true });
    } else {
      this.setState({ isAddTips: false });
    }

    this.setState({
      isShowTipsModal: true,
    });
  };

  // 取消创建
  handleOkButton = () => {
    this.setState({
      isShowTipsModal: false,
    });
  };

  handleCancelButton = () => {
    this.setState({
      isShowTipsModal: false,
    });
    this.props.history.push('/product/insurance');
  };

  render() {
    const { isAdd, fieldItem, isShowTipsModal, isAddTips, item_label } = this.state;
    const { getFieldDecorator } = this.props.form;
    const {
      product: {
        companyList: { data: companyList },
      },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <div>
        <div className={styles.uiHeader}>
          <Row>
            <Col span={18}>
              <Breadcrumb separator="/">
                <Breadcrumb.Item className={styles.breadCrumb}>
                  <Link to="/product/fields">字段列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className={styles.breadCrumb}>
                  {!isAdd ? `${item_label}` : '创建新字段'}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={6} className={styles.alignRight}>
              <Button
                style={{ marginRight: '10px' }}
                type="primary"
                onClick={this.saveEditInsurance}
              >
                保存
              </Button>
              <Button type="primary" ghost onClick={this.cancelEditInsurance}>
                取消
              </Button>
            </Col>
          </Row>
        </div>
        <div>
          <Tabs 
            onChange={this.tabsChange}
            activeKey={this.state.activeKey}
          >
            <TabPane tab="字段基本信息" key="1">
              <div className={styles.fieldBox}>
                <h4>{itemModel[fieldItem.item_model]}</h4>
                <div className={styles.fieldWrapper}>
                  {/* <div className={styles.fieldShutdown}>x</div> */}
                  <div>
                    <Form layout="vertical">
                      <Row>
                        <Col>
                          <FormItem label="字段名称">
                            {getFieldDecorator('item_label', {
                              rules: [
                                {
                                  required: true,
                                  message: `不能为空！`,
                                },
                              ],
                              initialValue: fieldItem.item_label,
                            })(
                              <Input
                                placeholder="输入名称"
                                onChange={e => this.onSelectChangeHandle(e, 'item_label')}
                              />
                            )}
                          </FormItem>

                          <FormItem label="关键词">
                            {getFieldDecorator('item_key', {
                              rules: [
                                {
                                  required: true,
                                  message: `不能为空！`,
                                },
                              ],
                              initialValue: fieldItem.item_key,
                            })(
                              <Input
                                placeholder="输入关键词"
                                onChange={e => this.onSelectChangeHandle(e, 'item_key')}
                              />
                            )}
                          </FormItem>

                          <FormItem label="字段类型">
                            {getFieldDecorator('item_type', {
                              rules: [
                                {
                                  required: true,
                                  message: `不能为空！`,
                                },
                              ],
                              initialValue: fieldItem.item_type,
                            })(
                              <Select
                                placeholder="请选择"
                                onChange={e => this.onSelectChangeHandle(e, 'item_type')}
                              >
                                {itemType.map((t, i) => (
                                  <Option value={i + 1} key={i}>
                                    {t}
                                  </Option>
                                ))}
                              </Select>
                            )}
                          </FormItem>

                          <FormItem label="单位">
                            {getFieldDecorator('item_unit', {
                              initialValue: fieldItem.item_unit,
                            })(
                              <Input
                                placeholder="输入单位"
                                onChange={e => this.onSelectChangeHandle(e, 'item_unit')}
                              />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <Checkbox
                            checked={fieldItem.is_required}
                            onChange={e => {this.onCheckboxHandle(e, 'is_required')}}
                          >
                            必填
                          </Checkbox>

                          <Checkbox
                            checked={fieldItem.is_array}
                            onChange={e => {this.onCheckboxHandle(e, 'is_array')}}
                          >
                            集合
                          </Checkbox>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </div>
              </div>
            </TabPane>
            <TabPane tab="字段归属设置" key="2">
              <div style={{ width: '80%', margin: '0 auto' }}>
                <Form>
                  <Row>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="内容区域">
                        {getFieldDecorator('item_category', {
                          rules: [
                            {
                              required: true,
                              message: `不能为空！`,
                            },
                          ],
                          initialValue: fieldItem.item_category,
                        })(
                          <Select
                            mode="multiple"
                            placeholder="请选择内容区域"
                            onChange={e => this.onSelectChangeHandle(e, 'item_category')}
                          >
                            <Option value="personal">模板-个单详配</Option>
                            <Option value="group">模板-团单详配</Option>
                            <Option value="duty">模板-责任区</Option>
                            <Option value="insurancetype">模板-险种区</Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="险种类型">
                        {getFieldDecorator('item_subcategory', {
                          rules: [
                            {
                              required: true,
                              message: `不能为空！`,
                            },
                          ],
                          initialValue: fieldItem.item_subcategory,
                        })(
                          <Select
                            mode="multiple"
                            placeholder="请选择险种类型"
                            onChange={e => this.onSelectChangeHandle(e, 'item_subcategory')}
                          >
                            <Option value="expense"> 费用型 </Option>
                            <Option value="allowance"> 津贴型 </Option>
                            <Option value="quota"> 定额型 </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="所属保险公司">
                        {getFieldDecorator('company_code', {
                          rules: [
                            {
                              required: true,
                              message: `不能为空！`,
                            },
                          ],
                          initialValue: fieldItem.company_code,
                        })(
                          <Select
                            mode="multiple"
                            placeholder="请选择所属保险公司"
                            onChange={e => this.onSelectChangeHandle(e, 'company_code')}
                          >
                            {companyList &&
                              companyList.map(item => {
                                return (
                                  <Option value={item.company_code} key={item.company_code}>
                                    {item.company_name === 'common' ? '通用' : item.company_name}
                                  </Option>
                                );
                              })}
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </Form>
              </div>
            </TabPane>
          </Tabs>
        </div>
        <Modal
          visible={isShowTipsModal}
          title={
            <div style={{ fontSize: 16 }}>
              <Icon
                type="warning"
                style={{ color: 'rgb(241, 194, 22)', fontSize: 24, margin: 6 }}
              />
              提示
            </div>
          }
          onOk={this.handleOkButton}
          onCancel={this.handleCancelButton}
          footer={[
            <Button key="back" onClick={this.handleCancelButton}>
              取消
              {isAddTips ? '创建' : '编辑'}
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOkButton}>
              继续
              {isAddTips ? '创建' : '编辑'}
            </Button>,
          ]}
        >
          {isAddTips ? (
            <p>取消创建后， 所选数据将不被保存且无法恢复，确认取消？</p>
          ) : (
            <p>是否取消此次编辑？</p>
          )}
        </Modal>
      </div>
    );
  }
}

export default EditField;
