/* eslint-disable no-param-reassign,camelcase,react/destructuring-assignment,prefer-destructuring,arrow-body-style */
import React, { Component } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Button, Card, Col, Form, Icon, Input, Layout, Pagination, Row, Select, Table, Modal } from 'antd';
import styles from '../product.less';
import undraw from '../images/in-initial.svg';
import ViewToPdf from './Preview/ViewToPdf';

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
      if(lastInsId === record.product_id){
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
    title: '产品名称',
    dataIndex: 'product_name',
    key: 'product_name',
    sorter: (a, b) => a.product_name.localeCompare(b.product_name, 'zh'),
  },
  {
    title: '产品代码',
    dataIndex: 'product_code',
    key: 'product_code',
    sorter: (a, b) => a.product_code.localeCompare(b.product_code, 'zh'),
  },
  {
    title: '配置日期',
    dataIndex: 'create_at',
    key: 'create_at',
    render: (text, record) => {
      return moment(record.create_at).format('YYYY.MM.DD');
    },
    sorter: (a, b) => a.create_at - b.create_at,
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
class SingleConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      defaultParams: {
        page: 0,
        size: 10,
      },
      singleList: [],
      isInitLoad: false,
      selectedRowKeys: [],
      totalElement: 0,
      preview: false,
      iData:null,
    };
  }

  componentDidMount() {
    const { defaultParams } = this.state;
    this.initSingleList(defaultParams);
  }

  // 复选框
  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 列表row class
  rowClassName = () => {
    return '';
  };

  // 初始化查询
  initSingleList = queryParams => {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/querySingleListAndCompany',
      payload: {
        ...queryParams,
      },
      callback: res => {
        this.setState({
          singleList: res.singleData,
        });
        if (res.singleData.length > 0) {
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
        this.initSingleList(this.state.defaultParams);
      }
    );
  };

  // 查询个单列表
  querySingleList = event => {
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
      this.initSingleList({
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

  // 配置新产品（个单）
  addNewSingle = () => {
    this.props.history.push('single/add');
  };

  toProductDetail = (record, e) => {
    if(e.target.innerHTML === '预览'){
      this.setState({
        preview:true,
        iData:record,
      });

      return;
    }

    this.props.history.push({
      pathname: `/product/single/update/${record.product_code}`,
      state: {
        product_id: record.product_id,
        product_code: record.product_code,
        product_name: record.product_name,
        company_code: record.company_code,
        require_claim: record.require_claim,
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
    const { isInitLoad, loading, selectedRowKeys, singleList, totalElement } = this.state;
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
          <Form onSubmit={this.querySingleList}>
            <Row>
              <Col span={8}>
                <FormItem {...formItemLayout} label="保险公司">
                  {getFieldDecorator('company_code')(
                    <Select placeholder="保险公司">
                      {companyList &&
                        companyList.map((item,) => {
                          return (
                            <Option value={item.company_code} key={new Date()}>
                              {item.company_name}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="产品名称">
                  {getFieldDecorator('product_name')(<Input placeholder="产品名称" />)}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="产品代码">
                  {getFieldDecorator('product_code')(<Input placeholder="产品代码" />)}
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
                      个单列表(
                      {totalElement})
                    </span>
                  </Col>
                  <Col span={18} className={styles.tableCol}>
                    <Button className={styles.tableButton} onClick={this.addNewSingle}>
                      配置新产品
                    </Button>
                  </Col>
                </Row>
              </div>
              <Table
                rowSelection={rowSelection}
                dataSource={singleList}
                loading={loading}
                columns={dataColumns}
                pagination={false}
                rowClassName={this.rowClassName}
                rowKey={record => record.product_code}
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
                <figcaption onClick={this.addNewSingle}>
                  还没有产品，点击
                  <span>此处</span>
                  配置产品
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
          />}
      </div>
    );
  }
}

export default SingleConfig;
