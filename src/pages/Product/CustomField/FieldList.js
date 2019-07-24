/* eslint-disable no-param-reassign,camelcase,react/destructuring-assignment,prefer-destructuring,arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Icon, Input, Layout, Radio, Row, Select, Table, Pagination } from 'antd';
import styles from '../product.less';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const insuranceModel = {
  expense: '费用型',
  allowance: '津贴型',
  quota: '定额型',
};

const itemCategory = {
  personal: '模板-个单详配',
  group: '模板-团单详配',
  duty: '模板-责任区',
  insurancetype: '模板-险种区',
};

const itemModel = {
  input: '输入框',
  radio: '单选框',
  checkbox: '复选框',
  select: '单选下拉框',
  selectMultiple: '复选下拉框',
  textArea: '多行文本框',
  range: '区间输入框',
};

const dataColumns = [
  {
    title: '字段名称',
    dataIndex: 'item_label',
    key: 'item_label',
  },
  {
    title: '关键词',
    dataIndex: 'item_key',
    key: 'item_key',
  },
  {
    title: '字段样式',
    dataIndex: 'item_model',
    key: 'item_model',
    render: (text, record) => {
      const model = record.item_model;
      return itemModel[model];
    },
  },
  {
    title: '是否必填',
    dataIndex: 'is_required',
    key: 'is_required',
    render: (text, record) => (record.is_required ? '是' : '否'),
  },
  {
    title: '显示区域',
    dataIndex: 'item_category',
    key: 'item_category',
    render: (text, record) => {
      const category = record.item_category;
      const temArray = [];
      category.forEach(item => {
        temArray.push(itemCategory[item]);
      });
      return temArray.join('，');
    },
  },
  {
    title: '险种类型',
    dataIndex: 'item_subcategory',
    key: 'item_subcategory',
    render: (text, record) => {
      const subCategory = record.item_subcategory;
      const temArray = [];
      subCategory.forEach(item => {
        temArray.push(insuranceModel[item]);
      });
      return temArray.join('，');
    },
  },
  {
    title: '',
    dataIndex: '',
    width: 40,
    render: () => <Icon type="right" />,
  },
];

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class FieldList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultParams: {
        page: 0,
        size: 10,
      },
      fieldList: [],
      selectedRowKeys: [],
      totalElement: 0,
    };
  }

  componentDidMount() {
    const { defaultParams } = this.state;
    this.initQueryList(defaultParams);
  }

  // 初始化查询
  initQueryList = queryParams => {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/queryFieldListAndCompany',
      payload: {
        ...queryParams,
      },
      callback: res => {
        this.setState({
          fieldList: res.groupData,
        });
        if (res.groupData.length > 0) {
          this.setState({
            totalElement: res.totalElement,
          });
        } else {
          this.setState({
            totalElement: 0,
          });
        }
      },
    });
  };

  // 查询团单列表
  queryList = event => {
    event.preventDefault();
    const { defaultParams } = this.state;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const fieldParams = {};
      Reflect.ownKeys(fieldsValue).forEach(el => {
        if (!fieldsValue[el]) {
          delete fieldsValue[el];
        }
        fieldParams[el] = fieldsValue[el];
      });
      this.initQueryList({
        ...defaultParams,
        ...fieldParams,
        page: 0,
      });
      this.setState({
        defaultParams: {
          ...defaultParams,
          ...fieldParams,
          page: 0,
        },
      });
    });
  };

  // 分页
  onPageChange = page => {
    const { defaultParams } = this.state;
    this.setState(
      {
        defaultParams: {
          ...defaultParams,
          page: page - 1,
        },
      },
      () => {
        this.initQueryList(this.state.defaultParams);
      }
    );
  };

  // addNewField
  addNewField = () => {
    this.props.history.push('/product/fields/add');
  };

  render() {
    const {
      product: {
        companyList: { data: companyList },
      },
    } = this.props;
    const { loading, selectedRowKeys, fieldList, totalElement } = this.state;

    const { getFieldDecorator } = this.props.form;
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
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div>
        <Card className={styles.marginBottom}>
          <Form onSubmit={this.queryList}>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="字段名称">
                  {getFieldDecorator('item_label')(<Input placeholder="搜索字段名称" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="字段样式">
                  {getFieldDecorator('item_model')(
                    <Select placeholder="选择字段样式">
                      <Option value="input">输入框</Option>
                      <Option value="radio">单选框</Option>
                      <Option value="checkbox">复选框</Option>
                      <Option value="select">单选下拉框</Option>
                      <Option value="selectMultiple">复选下拉框</Option>
                      <Option value="textArea">多行文本框</Option>
                      <Option value="range">区间输入框</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="所属保险公司">
                  {getFieldDecorator('company_code')(
                    <Select placeholder="选择保险公司">
                      {companyList &&
                        companyList.map(item => {
                          return (
                            <Option value={item.company_code} key={item.company_code}>
                              {item.company_name}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="显示区域">
                  {getFieldDecorator('item_category')(
                    <Select placeholder="选择显示区域">
                      {/*
                        personal group duty insurancetype
                      */}
                      <Option value="personal">模板-个单详配</Option>
                      <Option value="group">模板-团单详配</Option>
                      <Option value="duty">模板-责任区</Option>
                      <Option value="insurancetype">模板-险种区</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="险种类型">
                  {getFieldDecorator('item_subcategory')(
                    <Select placeholder="选择险种类型">
                      <Option value="expense">费用型</Option>
                      <Option value="allowance">津贴型</Option>
                      <Option value="quota">定额型</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>

              {/* <Col span={8}>
                <FormItem {...formItemLayout} label="字段性质">
                  {getFieldDecorator('item_nature',{initialValue: 1})(
                    <RadioGroup>
                      <Radio value={1}>全部</Radio>
                      <Radio value={2}>单个</Radio>
                      <Radio value={3}>复合</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col> */}
            </Row>
            <Row>
              <Col span={24} className={styles.alignRight}>
                <Button type="primary" size="default" htmlType="submit">
                  查 询
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Content>
          <Card>
            <div className={styles.tableOperations}>
              <Row gutter={24}>
                <Col span={6}>
                  <span className={styles.tableTitle}>
                    字段列表(
                    {totalElement})
                  </span>
                </Col>
                <Col span={18} className={styles.tableCol}>
                  <Button className={styles.tableButton} onClick={this.addNewField}>
                    配置新字段
                  </Button>
                </Col>
              </Row>
            </div>
            <Table
              // rowSelection={rowSelection}
              dataSource={fieldList}
              loading={loading}
              columns={dataColumns}
              pagination={false}
              rowClassName={this.rowClassName}
              rowKey={record => record.item_key}
              onRow={record => ({
                onClick: () => {
                  this.props.history.push({
                    pathname: `/product/fields/update/${record.item_id}`,
                    state: {
                      item_id: record.item_id,
                      item_label: record.item_label,
                    },
                  });
                },
              })}
            />
            <Row>
              <Col className={styles.uiPagination}>
                <Pagination
                  defaultCurrent={1}
                  defaultPageSize={this.state.defaultParams.size}
                  current={this.state.defaultParams.page + 1}
                  onChange={this.onPageChange}
                  total={totalElement}
                />
              </Col>
            </Row>
          </Card>
        </Content>
      </div>
    );
  }
}

export default FieldList;
