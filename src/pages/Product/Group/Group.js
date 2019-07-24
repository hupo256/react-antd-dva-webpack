/* eslint-disable no-param-reassign,camelcase,react/destructuring-assignment,prefer-destructuring,arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Col, Form, Icon, Input, Layout, Row, Select, Table, Pagination } from 'antd';
import styles from '../product.less';
import undraw from '../images/in-initial.svg';
import ViewToPdf from '../Single/Preview/ViewToPdf';

const { Content } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

const dataColumns = [
  {
    title: '',
    dataIndex: 'temp_icon',
    key: 'temp_icon',
    render: (text, record) => {
      const lastInsId = localStorage.getItem('leapInsId');
      if(lastInsId === record.group_id){
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
    title: '保单号',
    dataIndex: 'policy_id',
    key: 'policy_id',
    sorter: (a, b) => a.policy_id.localeCompare(b.policy_id, 'zh'),
  },
  {
    title: '团体名称',
    dataIndex: 'organization_name',
    key: 'organization_name',
    sorter: (a, b) => a.organization_name.localeCompare(b.organization_name, 'zh'),
  },
  {
    title: '保单生效日期',
    dataIndex: 'policy_validate_from',
    key: 'policy_validate_from',
    render: (text, record) => moment(record.policy_validate_from).format('YYYY.MM.DD'),
    sorter: (a, b) => a.policy_validate_from - b.policy_validate_from,
  },
  {
    title: '保单终止日期',
    dataIndex: 'policy_validate_to',
    key: 'policy_validate_to',
    render: (text, record) => moment(record.policy_validate_to).format('YYYY.MM.DD'),
    sorter: (a, b) => a.policy_validate_to - b.policy_validate_to,
  },
  {
    title: '',
    dataIndex: '',
    width: 80,
    render: () => {
      return <span style={{color: '#529ad8', cursor: 'pointer'}}>预览</span>;
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
class GroupConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultParams: {
        page: 0,
        size: 10,
      },
      groupList: [],
      isInitLoad: false,
      selectedRowKeys: [],
      totalElement: 0,
      preview: false,
      iData:null,
      isGroup:true,
    };
  }

  componentDidMount() {
    const { defaultParams } = this.state;
    this.initGroupList(defaultParams);
  }

  // 复选框
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 列表row class
  rowClassName = () => '';

  // 初始化查询
  initGroupList = queryParams => {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/queryGroupListAndCompany',
      payload: {
        ...queryParams,
      },
      callback: res => {
        this.setState({
          groupList: res.groupData,
        });
        if (res.groupData.length > 0) {
          this.setState({
            isInitLoad: false,
            totalElement: res.totalElement,
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

  // 查询团单列表
  queryGroupList = event => {
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
      this.initGroupList({
        ...defaultParams,
        ...fieldParams,
        page: 0,
      });
      this.setState({
        defaultParams: {
          ...defaultParams,
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
        this.initGroupList(this.state.defaultParams);
      }
    );
  };

  // 配置新保单（团单）
  addNewGroup = () => {
    this.props.history.push('group/add');
  };

  toProductDetail = (record, e) => {
    // return false;
    if(e.target.innerHTML === '预览'){
      this.setState({
        preview:true,
        iData:record,
      });

      return;
    }

    this.props.history.push({
      pathname: `/product/group/update/${record.policy_id}`,
      state: {
        group_id: record.group_id,
        company_code: record.company_code,
      },
    });
  };

  closePreview = () =>{
    this.setState({
      preview:false,
    });
  }

  render() {
    const {
      product: {
        companyList: { data: companyList },
      },
    } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { isInitLoad, loading, selectedRowKeys, groupList, totalElement } = this.state;
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
          <Form onSubmit={this.queryGroupList}>
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
                <FormItem {...formItemLayout} label="团体名称">
                  {getFieldDecorator('organization_name')(<Input placeholder="团体名称" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="保单号">
                  {getFieldDecorator('policy_id')(<Input placeholder="保单号" />)}
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
                      团单列表(
                      {totalElement})
                    </span>
                  </Col>
                  <Col span={18} className={styles.tableCol}>
                    <Button className={styles.tableButton} onClick={this.addNewGroup}>
                      配置新保单
                    </Button>
                  </Col>
                </Row>
              </div>
              <Table
                rowSelection={rowSelection}
                dataSource={groupList}
                loading={loading}
                columns={dataColumns}
                pagination={false}
                rowClassName={this.rowClassName}
                rowKey={record => record.group_id}
                onRow={record => {
                  return {onClick: e => this.toProductDetail(record, e)};
                }}
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
          )}
          {isInitLoad && (
            <div className={styles.uiContainer}>
              <figure className={styles.uiFigure}>
                <img src={undraw} alt="undraw" width="460" height="310" />
                <figcaption>
                  还没有团单，点击
                  <span onClick={this.addNewGroup}>配置</span>
                  团单
                </figcaption>
              </figure>
            </div>
          )}
        </Content>


        {this.state.preview && 
          <ViewToPdf
            isPreview={this.closePreview}
            iData={this.state.iData}
            dispatch={this.props.dispatch}
            isGroup={this.state.isGroup}
          />}
      </div>
    );
  }
}

export default GroupConfig;
