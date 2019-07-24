/* eslint-disable prefer-destructuring,no-shadow,react/no-unused-state,no-unreachable,react/destructuring-assignment,arrow-body-style,no-param-reassign,camelcase */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Icon, Input, Layout, Row, Select, Table, Radio } from 'antd';
import styles from '../product.less';

import CreateInsurance from './CreateInsurance/CreateInsurance';

import undraw from '../images/in-initial.svg';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const dataColumns = [
  {
    title: '',
    dataIndex: 'temp_icon',
    key: 'temp_icon',
    render: (text, record) => {
      const lastInsId = localStorage.getItem('leapInsId');
      if(lastInsId === record.template_id){
        return <Icon type="edit" theme="twoTone" />;
      }
      return '';
    },
  },
  {
    title: '保险公司',
    dataIndex: 'company_name',
    key: 'company_name',
    sorter: (a, b) => a.company_name.localeCompare(b.company_name, 'zh'),
  },
  {
    title: '险种名称',
    dataIndex: 'insurance_type_name',
    key: 'insurance_type_name',
    sorter: (a, b) => a.insurance_type_name.localeCompare(b.insurance_type_name, 'zh'),
  },
  {
    title: '险种代码',
    dataIndex: 'insurance_type_code',
    key: 'insurance_type_code',
    sorter: (a, b) => a.insurance_type_code.localeCompare(b.insurance_type_code, 'zh'),
  },
  {
    title: '险种类型',
    dataIndex: 'insurance_model',
    key: 'insurance_model',
    render: (text, record) => {
      switch (`${record.insurance_model}`) {
        case 'expense':
          return '费用型';
          break;
        case 'allowance':
          return '津贴型';
          break;
        case 'quota':
          return '定额型';
          break;
        default:
          return '--';
      }
    },
    sorter: (a, b) => a.insurance_model - b.insurance_model,
  },
  // {
  //   title: '险种状态',
  //   dataIndex: 'insuranceStatus',
  //   key: 'insuranceStatus',
  //   render: (text, record) => (record.insuranceStatus === 1 ? '停用' : '正常'),
  //   sorter: (a, b) => a.insuranceStatus - b.insuranceStatus,
  // },
  {
    title: '险种性质',
    dataIndex: 'insurance_scope',
    key: 'insurance_scope',
    render: (text, record) => (record.insurance_scope === 'personal' ? '个险' : '团险'),
    sorter: (a, b) => a.insurance_scope - b.insurance_scope,
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
class InsuranceConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isShowModal: false,
      defaultParams: {
        insurance_scope: null,
      },
      insuranceList: [],
      isInitLoad: false,
      selectedRowKeys: [],
      totalElement: 0,
    };
  }

  componentDidMount() {
    const { defaultParams } = this.state;
    this.initInsuranceList(defaultParams);
  }

  // 复选框
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 列表row class
  rowClassName = () => '';

  // 初始化查询
  initInsuranceList = queryParams => {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/queryInsListAndCompany',
      payload: {
        ...queryParams,
      },
      callback: res => {
        this.setState({
          insuranceList: res,
        });
        if (res.length > 0) {
          this.setState({
            isInitLoad: false,
            totalElement: res.length,
          });
        } else {
          this.setState({
            isInitLoad: true,
            totalElement: 0,
          });
        }
      },
    });
  };

  // 查询险种列表
  queryInsuranceList = event => {
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

      this.initInsuranceList({
        ...defaultParams,
        ...fieldParams,
      });
    });
  };

  // 创建险种
  addNewInsurance = () => {
    this.setState({ isShowModal: true });
  };

  // 停用险种
  disableInsurance = () => {};

  modalHandleCancel = () => {
    this.setState({ isShowModal: false });
  };

  modalHandleOk = () => {
    this.setState({ isShowModal: false });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      product: {
        companyList: { data: companyList },
      },
    } = this.props;

    const {
      isInitLoad,
      loading,
      selectedRowKeys,
      insuranceList,
      totalElement,
      isShowModal,
    } = this.state;

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
          <Form onSubmit={this.queryInsuranceList}>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="保险公司">
                  {getFieldDecorator('company_code')(
                    <Select placeholder="保险公司">
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
              <Col span={8}>
                <FormItem {...formItemLayout} label="险种名称">
                  {getFieldDecorator('insurance_type_name')(<Input placeholder="险种名称" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="险种代码">
                  {getFieldDecorator('insurance_type_code')(<Input placeholder="险种代码" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="险种类型">
                  {getFieldDecorator('insurance_model')(
                    <Select placeholder="请选择险种类型">
                      <Option value="expense" key="expense">
                        费用型
                      </Option>
                      <Option value="allowance" key="allowance">
                        津贴型
                      </Option>
                      <Option value="quota" key="quota">
                        定额型
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="险种性质">
                  {getFieldDecorator('insurance_scope', {
                    initialValue: '',
                  })(
                    <RadioGroup>
                      <Radio value="">全部</Radio>
                      <Radio value="personal">个险</Radio>
                      <Radio value="group">团险</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
              </Col>
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
          {!isInitLoad && (
            <Card>
              <div className={styles.tableOperations}>
                <Row gutter={24}>
                  <Col span={6}>
                    <span className={styles.tableTitle}>
                      险种列表(
                      {totalElement})
                    </span>
                  </Col>
                  <Col span={18} className={styles.tableCol}>
                    <Button
                      onClick={this.addNewInsurance}
                      style={{ marginLeft: 8, border: '1px solid #1890ff' }}
                    >
                      创建险种及责任
                    </Button>
                  </Col>
                </Row>
              </div>
              <Table
                rowSelection={rowSelection}
                dataSource={insuranceList}
                loading={loading}
                columns={dataColumns}
                rowClassName={this.rowClassName}
                rowKey={record => record.template_id}
                onRow={record => ({
                  onClick: () => {
                    this.props.history.push({
                      pathname: `/product/insurance/update/${record.insurance_type_code}`,
                      state: {
                        company_code: record.company_code,
                        insurance_model: record.insurance_model,
                        template_id: record.template_id,
                      },
                    });
                  },
                })}
              />
            </Card>
          )}
          {isInitLoad && (
            <div className={styles.uiContainer}>
              <figure className={styles.uiFigure}>
                <img src={undraw} alt="undraw" width="460" height="310" />
                <figcaption onClick={this.addNewInsurance}>
                  还没有险种，点击
                  <span>此处</span>
                  创建险种
                </figcaption>
              </figure>
            </div>
          )}
        </Content>

        {/* 创建新险种 */}
        <CreateInsurance
          isShowModal={isShowModal}
          modalHandleCancel={this.modalHandleCancel}
          modalHandleOk={this.modalHandleOk}
          history={this.props.history}
        />
      </div>
    );
  }
}

export default InsuranceConfig;
