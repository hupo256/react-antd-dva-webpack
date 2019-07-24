import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Card, Col, Form, Icon, Input, Row, Table, Select, DatePicker } from 'antd';
import styles from './index.less';

const { RangePicker } = DatePicker;

const FormItem = Form.Item;
const { Option } = Select;

const groupList = [
  {
    organizationName: '华晨宝马汽车有限公司',
    policyId: '82200946504',
    companyName: '中意人寿保险有限公司',
    reportDate: '2016.06 - 2017.05',
  },
  {
    organizationName: '盐城烟草-公共基金',
    policyId: '320003141646088',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2016.03 - 2019.02',
  },
  {
    organizationName: '盐城烟草-保险',
    policyId: '/',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2016.03 - 2019.02',
  },
  {
    organizationName: '沙索（中国）化学有限公司',
    policyId: '320003141646088',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2016.12 - 2017.11',
  },
  {
    organizationName: '东南大学设计研究院有限公司',
    policyId: '320003771066088',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2017.12 - 2018.11',
  },
  // {
  //   organizationName: '必胜客江苏分公司',
  //   policyId: '320000226892090',
  //   companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
  //   reportDate: '2017.12 - 2018.11',
  // },
  {
    organizationName: '江苏省粮油储运有限公司',
    policyId: '320003391472087',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2017.12 - 2018.11',
  },
  {
    organizationName: '中国移动江苏公司',
    policyId: '320003310856088',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2016.12 - 2017.11',
  },
  {
    organizationName: '金天业会计师事务所',
    policyId: '320003310856068',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2016.12 - 2017.11',
  },
  {
    organizationName: '南京新众成科技开发中心',
    policyId: '320003310856067',
    companyName: '中国人民人寿保险股份有限公司江苏省南京市分公司',
    reportDate: '2016.12 - 2017.11',
  },
];

@Form.create(state => ({
  riskmodel: state.riskmodel,
}))
@connect()
class GroupReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // onInit: false,
      // ondelete: false,
      // filter: {},
      // selectedRowKeys: [],
      // batching: false,
      // company: undefined,
      // batchList: [{ code: 5 }],
    };
  }

  componentDidMount() {
    // this.querySettingList();
  }

  // 查询险种配置列表
  // querySettingList = () => {
  //   const { form, dispatch } = this.props;
  //   const { filter } = this.state;
  //   let newfilter = {};
  //   form.validateFields(err => {
  //     if (err) {
  //       return;
  //     }
  //     newfilter = {
  //       ...filter,
  //       ...form.getFieldsValue(),
  //     };
  //     this.setState({ filter: newfilter });
  //   });
  //   dispatch({
  //     type: 'riskControl/fetchList',
  //     payload: newfilter,
  //     callback: res => {
  //       if (res.code === '000000') {
  //         this.setState({
  //           batchList: res.data,
  //         });
  //       } else {
  //         message.error(res.message);
  //       }
  //     },
  //   });
  // };

  // openSetting = () => {
  //   const { history, dispatch } = this.props;
  //   const { company, batchId } = this.state;
  //   dispatch({
  //     type: 'riskControl/saveBatchId',
  //     payload: { companyCode: company, batchId },
  //     callback: res => {
  //       if (res.code === '000000')
  //         history.push(`/riskcontrol/batching?companyId=${company}&batchId=${batchId}`);
  //       else message.error('创建批次失败！');
  //     },
  //   });
  // };

  // onSelectChange = selectedRowKeys => {
  //   this.setState({ selectedRowKeys });
  // };

  // onCompanySelectChange = value => {
  //   this.setState({ company: value });
  // };

  // exportReport = batchId => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'riskControl/exportRisk',
  //     payload: { batchId },
  //     callback: res => {
  //       const url = URL.createObjectURL(res);
  //       const eleLink = document.createElement('a');
  //       eleLink.download = `批次${batchId}风控报告.xls`;
  //       eleLink.style.display = 'none';
  //       eleLink.href = url;
  //       document.body.appendChild(eleLink);
  //       eleLink.click();
  //       document.body.removeChild(eleLink);
  //     },
  //   });
  // };

  render() {
    const {
      loading,
      // batchList,
      // selectedRowKeys,
      // batching,
      // company,
      // batchId,
      // ondelete,
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const dataColumns = [
      {
        title: '团体名称',
        dataIndex: 'organizationName',
        key: 'organizationName',
        // width: 180,
      },
      {
        title: '保单号',
        dataIndex: 'policyId',
        key: 'policyId',
        // width: 120,
      },
      {
        title: '保险公司',
        dataIndex: 'companyName',
        key: 'companyName',
        // width: 150,
      },
      {
        title: '报告周期',
        dataIndex: 'reportDate',
        key: 'reportDate',
        // width: 100,
      },
      {
        title: '',
        dataIndex: '',
        width: 40,
        render: () => <Icon type="right" />,
      },
    ];

    // const rowSelection = {
    //   selectedRowKeys,
    //   onChange: this.onSelectChange,
    // };

    return (
      <div className={styles.fullboard}>
        <Card className={styles.marginBottom}>
          <Form onSubmit={this.querySettingList}>
            <Row>
              <Col span={8}>
                {
                  <FormItem {...formItemLayout} label="团体名称">
                    {getFieldDecorator('organizationName')(<Input placeholder="输入团体名称" />)}
                  </FormItem>
                }
              </Col>
              <Col span={8}>
                {
                  <FormItem {...formItemLayout} label="保单号">
                    {getFieldDecorator('policyId')(<Input placeholder="输入保单号" />)}
                  </FormItem>
                }
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="报告日期">
                  {getFieldDecorator('importDate')(<RangePicker width={220} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                {
                  <FormItem {...formItemLayout} label="保险公司">
                    {getFieldDecorator('companyCode')(
                      <Select placeholder="输入保险公司" dropdownMatchSelectWidth={false}>
                        {/* <Option value="000164">东吴人寿保险股份有限公司</Option> */}
                        <Option value="000005">
                          中国人民人寿保险股份有限公司江苏省南京市分公司
                        </Option>
                      </Select>
                    )}
                  </FormItem>
                }
              </Col>
              <Col span={14} className={styles.alignRight}>
                <Button
                  type="primary"
                  size="default"
                  onClick={() => this.querySettingList()}
                  style={{ width: 100, marginTop: 5 }}
                >
                  查 询
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card
          title="团体列表"
          style={{ marginTop: 24 }}
          bodyStyle={{ padding: '0 32px 40px 32px' }}
          // extra={extraContent}
        >
          <Table
            dataSource={groupList}
            loading={loading}
            columns={dataColumns}
            pagination={false}
            rowKey="policyId"
            // rowSelection={rowSelection}
            onRowClick={record => {
              const { history } = this.props;
              history.push(`/product/groupinfo?orgName=${record.organizationName}`);
            }}
          />
        </Card>
      </div>
    );
  }
}

export default GroupReport;
