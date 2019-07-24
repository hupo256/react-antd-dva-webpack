import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  Input,
  message,
  Row,
  Table,
  Select,
  DatePicker,
  Modal,
} from 'antd';
import styles from './index.less';
import FuncPopover from './FunctionPopover';
import initPic from '../../assets/Riskcontrol/empty.png';

const FormItem = Form.Item;
const { Option } = Select;

const companyList = {
  东吴人寿保险股份有限公司: '000164',
  中国人寿保险股份有限公司: '000005',
};

@Form.create(state => ({
  riskControl: state.riskControl,
}))
@connect()
class RiskControl extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      onInit: false,
      ondelete: false,
      filter: {},
      selectedRowKeys: [],
      batching: false,
      company: undefined,
      notification: false,
      batchList: [{ code: 5 }],
    };
  }

  componentDidMount() {
    this.querySettingList();
  }

  // 查询险种配置列表
  querySettingList = () => {
    const { form, dispatch } = this.props;
    const { filter } = this.state;
    let newfilter = {};
    form.validateFields(err => {
      if (err) {
        return;
      }
      newfilter = {
        ...filter,
        ...form.getFieldsValue(),
      };
      this.setState({ filter: newfilter });
    });
    dispatch({
      type: 'riskControl/fetchList',
      payload: newfilter,
      callback: res => {
        if (res.code === '000000') {
          this.setState({
            batchList: res.data,
          });
        } else {
          message.error(res.message);
        }
      },
    });
  };

  openSetting = () => {
    const { history, dispatch } = this.props;
    const { company, batchId } = this.state;
    dispatch({
      type: 'riskControl/saveBatchId',
      payload: { companyCode: company, batchId },
      callback: res => {
        if (res.code === '000000')
          history.push(`/riskcontrol/batching?companyId=${company}&batchId=${batchId}&status=-1`);
        else message.error('创建批次失败！');
      },
    });
  };

  createBatch = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/fetchBatchId',
      callback: res => {
        if (res.code === '000000') this.setState({ batching: true, batchId: res.data });
        else message.error('创建批次失败！');
      },
    });
  };

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  onCompanySelectChange = value => {
    this.setState({ company: value });
  };

  riskReport = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/checkRisk',
      payload: record.batchId,
      callback: res => {
        if (res.code === '000000') {
          console.log(res);
          this.runRisk(record.batchId);
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  runRisk = batchId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/runRisk',
      payload: { batchId },
      callback: res => {
        if (res.code === '000000') {
          console.log(res);
          this.querySettingList();
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  deleteBatch = () => {
    const { selectedRowKeys } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/deleteBatch',
      payload: { batchIds: selectedRowKeys },
      callback: res => {
        if (res.code === '000000') {
          message.success('删除成功！', [10]);
          this.setState({ ondelete: false });
          this.querySettingList();
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  exportReport = batchId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/exportRisk',
      payload: { batchId },
      callback: res => {
        const url = URL.createObjectURL(res);
        const eleLink = document.createElement('a');
        eleLink.download = `批次${batchId}风控报告.xls`;
        eleLink.style.display = 'none';
        eleLink.href = url;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      },
    });
  };

  startNotification = text => {
    this.setState({ notext: text, notification: true });
    setTimeout(() => this.setState({ notification: false }), 5000);
  };

  render() {
    const {
      onInit,
      loading,
      batchList,
      selectedRowKeys,
      batching,
      company,
      batchId,
      ondelete,
      notification,
      notext,
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
    const extraContent = (
      <div className={styles.extraContent}>
        <Button className={styles.delBtn} onClick={() => this.setState({ ondelete: true })}>
          删除
        </Button>
        <Button className={styles.newBtn} onClick={() => this.createBatch()}>
          创建新批次
        </Button>
      </div>
    );
    const dataColumns = [
      {
        title: '批次号',
        dataIndex: 'batchId',
        key: 'batchId',
        width: 180,
      },
      {
        title: '导入日期',
        dataIndex: 'importDateStr',
        key: 'importDateStr',
        width: 120,
      },
      {
        title: '保险公司',
        dataIndex: 'companyName',
        key: 'companyName',
        width: 150,
      },
      {
        title: '案件数量',
        dataIndex: 'count',
        key: 'count',
        width: 100,
      },
      {
        title: '批次状态',
        dataIndex: 'batchStatus',
        key: 'batchStatus',
        render: text => text && text.name,
        width: 140,
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) => {
          switch (record.batchStatus && record.batchStatus.value) {
            case 3:
              return (
                <Button
                  className={styles.subBtn}
                  style={{ width: 75, float: 'left', marginLeft: 0 }}
                  onClick={e => {
                    e.stopPropagation();
                    this.riskReport(record);
                    this.startNotification(`批次${record.batchId}即将开始风控计算…`);
                  }}
                >
                  跑风控
                </Button>
              );
            case 4:
              return (
                <div
                  className={styles.disabledBtn}
                  style={{ width: 75, float: 'left', marginLeft: 0 }}
                  onClick={e => {
                    e.stopPropagation();
                    this.riskReport(record);
                    this.startNotification(`批次${record.batchId}即将开始风控计算…`);
                  }}
                >
                  跑风控
                </div>
              );
            case 5:
              return (
                <div>
                  <Button
                    className={styles.subBtn}
                    style={{ width: 75, float: 'left', marginLeft: 0 }}
                    onClick={e => {
                      e.stopPropagation();
                      this.riskReport(record);
                      this.startNotification(`批次${record.batchId}即将开始风控计算…`);
                    }}
                  >
                    跑风控
                  </Button>
                  <Button
                    className={styles.subBtn}
                    style={{ width: 85, float: 'left' }}
                    onClick={e => {
                      e.stopPropagation();
                      window.open(`/riskcontrol/riskReport?batchId=${record.batchId}`);
                      // this.exportReport(record.batchId);
                    }}
                  >
                    查看报告
                  </Button>
                </div>
              );
            default:
              return '';
          }
        },
      },
      {
        title: '',
        dataIndex: '',
        width: 40,
        render: () => <Icon type="right" />,
      },
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.fullboard}>
        <Card className={styles.marginBottom}>
          <Form onSubmit={this.querySettingList}>
            <Row>
              <Col span={8}>
                {
                  <FormItem {...formItemLayout} label="批次号">
                    {getFieldDecorator('batchId')(<Input placeholder="输入批次号" />)}
                  </FormItem>
                }
              </Col>
              <Col span={8}>
                {
                  <FormItem {...formItemLayout} label="批次状态">
                    {getFieldDecorator('status')(
                      <Select placeholder="输入批次状态">
                        <Option value={1}>待补充材料</Option>
                        <Option value={2}>材料补充进行中</Option>
                        <Option value={3}>待风控</Option>
                        <Option value={4}>风控进行中</Option>
                        <Option value={5}>已出报告</Option>
                      </Select>
                    )}
                  </FormItem>
                }
              </Col>
              <Col span={8}>
                <FormItem {...formItemLayout} label="导入日期">
                  {getFieldDecorator('importDate')(<DatePicker width={220} />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                {
                  <FormItem {...formItemLayout} label="保险公司">
                    {getFieldDecorator('companyCode')(
                      <Select placeholder="输入保险公司" dropdownMatchSelectWidth={false}>
                        <Option value="000164">东吴人寿保险股份有限公司</Option>
                        <Option value="000005">中国人寿保险股份有限公司</Option>
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
        {onInit ? (
          <div className={styles.initBlock}>
            <img src={initPic} alt="" />
            <div>
              还没有案件，点击
              <span className={styles.startBtn} onClick={() => this.createBatch()}>
                此处
              </span>
              创建案件批次
            </div>
          </div>
        ) : (
          <Card
            title="案件批次列表"
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Table
              dataSource={batchList}
              loading={loading}
              columns={dataColumns}
              pagination={false}
              rowKey="batchId"
              rowSelection={rowSelection}
              onRowClick={record => {
                const { history } = this.props;
                history.push(
                  `/riskcontrol/batching?companyId=${companyList[record.companyName]}&batchId=${
                    record.batchId
                  }&status=${record.batchStatus.value}`
                );
              }}
            />
          </Card>
        )}
        {batching && (
          <Modal
            title={<div style={{ fontSize: 18 }}>创建新批次</div>}
            visible={batching}
            width={450}
            wrapClassName={styles.newBatchModal}
            onCancel={() => this.setState({ batching: false })}
            footer={
              <div>
                <Button
                  style={{
                    width: 87,
                    height: 30,
                    background: '#4291EB',
                    border: '1px solid #4291EB',
                    color: 'white',
                  }}
                  onClick={() => this.openSetting()}
                >
                  创建
                </Button>
              </div>
            }
          >
            <div className={styles.newBatch}>
              <div>批次号：</div>
              <div>{batchId}</div>
              <div>案件所属保险公司：</div>
              <div>
                <Select
                  placeholder="选择保险公司"
                  style={{ width: 220, marginTop: '-10px' }}
                  dropdownMatchSelectWidth={false}
                  onChange={this.onCompanySelectChange}
                  value={company}
                >
                  <Option value="000164">东吴人寿保险股份有限公司</Option>
                  <Option value="000005">中国人寿保险股份有限公司</Option>
                </Select>
                <br />
                {!company && <span>* 请选择保险公司！</span>}
              </div>
            </div>
          </Modal>
        )}
        {ondelete && (
          <FuncPopover
            visible={ondelete}
            type="delall"
            onOk={this.deleteBatch}
            onCancel={() => this.setState({ ondelete: false })}
          />
        )}
        {notification && <div className={styles.notification}>{notext}</div>}
      </div>
    );
  }
}

export default RiskControl;
