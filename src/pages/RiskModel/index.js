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
  Radio,
  Modal,
  Upload,
  // Select,
  Checkbox,
  AutoComplete
} from 'antd';
import styles from './style.less';
import initPic from '../../assets/Scenario/险种初始插图.svg';
import matchingPic from '../../assets/Scenario/匹配初始插图.svg';
import groupInitPic from '../../assets/Scenario/团单初始插图.svg';
import definingPic from '../../assets/Scenario/场景定义初始.svg';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
// const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const deletecontent = [
  '删除后，该险种及责任信息将全部丢失，无法恢复，确认删除？',
  '删除后，该匹配信息将全部丢失，无法恢复，确认删除？',
  '删除后，该团单风控模型配置将完全丢失，确认删除？',
  '删除后，该责任信息将全部丢失，无法恢复，确认删除？',
  '删除后，该个单风控模型配置将完全丢失，确认删除？',
];

@Form.create(state => ({
  riskmodel: state.riskmodel,
  product: state.product
}))
@connect()
class InsuranceIndex extends Component {
  constructor(props) {
    super(props);
    let pageIndex = 0;
    if (window.location.href.indexOf('matching') > -1) pageIndex = 1;
    // 匹配
    else if (window.location.href.indexOf('import') > -1) pageIndex = 0;
    // 录入
    else if (window.location.href.indexOf('defining') > -1) pageIndex = 3;
    // 定义
    else if (window.location.href.indexOf('single') > -1) pageIndex = 4;
    // 个单
    else pageIndex = 2; // 团单

    this.state = {
      loading: false,
      onInit: true,
      deleting: false,
      onalert: false,
      pageIndex,
      filter: {
        page:0,
        size: 100
      },
      selectedRowKeys: [],
      selectedRow: [],
      companyList:[],
      insuranceList:[],
      companyopts: [],
      companykeyword:''
    };
  }

  componentDidMount() {
    this.querySettingList();
    const { dispatch } = this.props;
    dispatch({
      type:'product/fetchCompanyList',
      callback:(res)=>{
        this.setState({companyList: res.data});
      }
    })
  }

  // 查询险种配置列表
  querySettingList = (filter) => {
    const { form, dispatch } = this.props;
    const { pageIndex, filter: ofilter } = this.state;
    const originfilter = filter||ofilter;
    const type = [
      'riskmodel/fetchImportList',
      'riskmodel/fetchList',
      'riskmodel/fetchGroupList',
      'riskmodel/fetchScenegroup',
      'riskmodel/fetchSingleList'
    ];
    let newfilter = {};
    form.validateFields(err => {
      if (err) {
        return;
      }
      newfilter = {
        ...originfilter,
        ...form.getFieldsValue(),
      };
      if (pageIndex === 2) {
        newfilter = {
          ...newfilter,
          isGroupOrders: [true],
        };
      }
      if(newfilter.companyCode){
        newfilter = {
          ...newfilter,
          companyCode:newfilter.companyCode.split('-')[0]
        };
      }
      this.setState({ filter: newfilter });
    });
    dispatch({
      type: type[pageIndex],
      payload: newfilter,
      callback: res => {
        if (res.success) {
          this.setState({
            insuranceList: res.data.list,
            totalElement:res.data.totalElement,
            onInit: res.data.list.length === 0,
          });
        } else {
          message.error(res.message, [5]);
        }
      },
    });
  };

  handleCompSearch = (value) => {
    const { companyList } = this.state;
    const allcomp = companyList.map((comp)=>`${comp.company_code}-${comp.company_name}`);
    const result = allcomp.filter((comp)=>comp.indexOf(value)> -1);
    this.setState({companyopts: result, companykeyword: value});
  }

  handleCheck = record => {
    const { pageIndex } = this.state;
    this.openSetting(pageIndex===0?record.insuranceCode:record.id, record.companyCode);
  };

  openSetting = (id = null, companyCode = null) => {
    const { pageIndex } = this.state;
    const { history } = this.props;
    const urls = [
      '/scenario/insurance/detail',
      '/scenario/insurance/setting',
      '/scenario/insurancegroup/setting',
      '/scenario/scenegroup/setting',
      '/scenario/singleinsurance/setting',
    ];
    let url = urls[pageIndex];
    if (id) url += `?id=${id}${pageIndex===0||pageIndex===1?`&companyCode=${companyCode}`:``}`;
    history.push(url);
  };

  onSelectChange = (selectedRowKeys, selectedRow) => {
    this.setState({ selectedRowKeys, selectedRow });
  };

  delInsurance = () => {
    const { selectedRow, pageIndex } = this.state;
    const { dispatch } = this.props;
    const type = ['riskmodel/delImportRisks', 'riskmodel/delRisk','riskmodel/delGroupRisk', 'riskmodel/removeScenegroup', 'riskmodel/delSingleRisk'];
    if (pageIndex !== 0)
      Promise.all(
        selectedRow.map(
          row =>
            new Promise(resolve => {
              dispatch({
                type: type[pageIndex],
                payload: row.id,
                callback: res => {
                  if (!res.success) {
                    message.error(res.message, [5]);
                  } else {
                    resolve();
                  }
                },
              });
            })
        )
      ).then(() => {
        message.success('删除成功！');
        this.querySettingList();
        this.setState({ deleting: false });
      });
    else
      dispatch({
        type: type[pageIndex],
        payload: selectedRow.map(row => row.id),
        callback: res => {
          if (!res.success) {
            message.error(res.message, [5]);
          } else {
            message.success('删除成功！');
            this.querySettingList();
            this.setState({ deleting: false });
          }
        },
      });
  };

  downloadModel = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/downloadModel',
      callback: res => {
        const url = URL.createObjectURL(res);
        const eleLink = document.createElement('a');
        eleLink.download = `险种责任导入模板.xlsx`;
        eleLink.style.display = 'none';
        eleLink.href = url;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      },
    });
  };

  uploadFile = file => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/uploadFile',
      payload: file,
      callback: res => {
        if (res.success) {
          message.success('导入成功！');
          this.querySettingList();
        } else {
          this.setState({ onalert: true, alertcontent: res.message });
        }
      },
    });
  };

  render() {
    const {
      onInit,
      loading,
      pageIndex,
      insuranceList,
      selectedRowKeys,
      deleting,
      onalert,
      alertcontent,
      companyList,
      companyopts,
      companykeyword,
      filter,
      totalElement
    } = this.state;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const total = insuranceList ? insuranceList.length : 0;
    const formItemLayout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };
    const props = {
      name: 'file',
      action: '',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      fileList: [],
      beforeUpload: file => {
        this.uploadFile(file);
      },
    };
    const extraContent =
      pageIndex === 0 ? (
        <div className={styles.extraContent}>
          <Button
            className={styles.newBtn}
            style={{ margin: '0 0 0 10px' }}
            onClick={() => this.downloadModel()}
          >
            下载模板
          </Button>
          <Upload {...props}>
            <Button className={styles.newBtn} style={{ margin: '0 0 0 10px' }}>
              导入险种
            </Button>
          </Upload>
          <Button
            className={styles.newBtn}
            style={{ margin: '0 0 0 10px' }}
            onClick={() => this.openSetting()}
          >
            创建险种责任
          </Button>
          <Button
            className={`${styles.delBtn} ${selectedRowKeys.length===0?styles.disabledDelBtn:''}`}
            style={{ margin: '0 0 0 10px' }}
            onClick={() => selectedRowKeys.length > 0 && this.setState({ deleting: true })}
          >
            删除
          </Button>
        </div>
      ) : (
        <div className={styles.extraContent}>
          <Button
            className={`${styles.delBtn} ${selectedRowKeys.length===0?styles.disabledDelBtn:''}`}
            onClick={() => selectedRowKeys.length > 0 && this.setState({ deleting: true })}
          >
            删除
          </Button>
          <Button className={styles.newBtn} onClick={() => this.openSetting()}>
            {pageIndex===3?'创建新场景':'新建配置'}
          </Button>
        </div>
      );
    // const accidentTypeOpt = [
    //   {
    //     label:'疾病',value:'1'
    //   },{
    //     label:'意外',value:'2'
    //   },{
    //     label:'其他',value:'3'
    //   }];
      // const dutyTypeOpt = [
      //   {
      //     label: '门诊费用型',
      //     value: '1',
      //   },
      //   {
      //     label: '住院费用型',
      //     value: '2',
      //   },
      //   {
      //     label: '津贴',
      //     value: '3',
      //   },
      //   {
      //     label: '重疾',
      //     value: '4',
      //   },
      //   {
      //     label: '伤残',
      //     value: '5',
      //   },
      //   {
      //     label: '身故',
      //     value: '6',
      //   },
      // ];
      const insuranceTypeOpt = [
        {
          label: '个险',
          value: false,
        },
        {
          label: '团险',
          value: true,
        },
      ];

      const periodOpt = [
        {
          label: '短期',
          value: '1',
        },
        {
          label: '长期',
          value: '2',
        },
      ];
    const dataColumns = [
      {
        title: '保险公司',
        dataIndex: 'companyCode',
        key: 'companyCode',
        render:(text)=>{
          const comps = companyList.filter((comp)=>comp.company_code===text)[0];
          return comps?comps.company_name:null;
        },
        sorter: (a, b) => a.companyCode.localeCompare(b.companyCode, 'zh'),
      },
      {
        title: '险种代码',
        dataIndex: 'insuranceCode',
        key: 'insuranceCode',
        sorter: (a, b) => a.insuranceCode.localeCompare(b.insuranceCode, 'zh'),
      },
      {
        title: '险种名称',
        dataIndex: 'insuranceName',
        key: 'insuranceName',
        sorter: (a, b) => a.insuranceName.localeCompare(b.insuranceName, 'zh'),
      },
      {
        title: '给付责任代码',
        dataIndex: 'dutyCode',
        key: 'dutyCode',
        sorter: (a, b) => a.dutyCode.localeCompare(b.dutyCode, 'zh'),
      },
      {
        title: '给付责任名称',
        dataIndex: 'dutyName',
        key: 'dutyName',
        sorter: (a, b) => a.dutyName.localeCompare(b.dutyName, 'zh'),
      },
      // {
      //   title: '出险类型',
      //   dataIndex: 'accidentTypes',
      //   key: 'accidentTypes',
      //   render:(text)=>{
      //     const result = ['疾病','意外','其他'];
      //     return text.map((item)=>result[item-1]).join(',')
      //   },
      //   sorter: (a, b) => a.accidentTypes.join(',').localeCompare(b.accidentTypes.join(','), 'zh'),
      // },
      // {
      //   title: '险种责任类型',
      //   dataIndex: 'dutyTypes',
      //   key: 'dutyTypes',
      //   render: text => text.map((item)=>dutyTypeOpt.filter(type => type.value === item).map((i)=>i.label)).join(','),
      //   sorter: (a, b) => a.dutyTypes.join(',').localeCompare(b.dutyTypes.join(','), 'zh'),
      // },
      {
        title: '险种类别',
        dataIndex: 'isGroupOrder',
        key: 'isGroupOrder',
        render: text => insuranceTypeOpt.map(type => type.value === text && type.label),
        sorter: (a, b) => a.isGroupOrder.localeCompare(b.isGroupOrder, 'zh'),
      },
      {
        title: '保障期限',
        dataIndex: 'guaranteeTermType',
        key: 'guaranteeTermType',
        render: text => periodOpt.map(type => type.value === text && type.label),
        sorter: (a, b) => a.guaranteeTermType.localeCompare(b.guaranteeTermType, 'zh'),
      },
      {
        title: '',
        dataIndex: '',
        width: 40,
        render: () => <Icon type="right" />,
      },
    ];
    const matchingColumns = [
      {
        title: '保险公司',
        dataIndex: 'companyCode',
        key: 'companyCode',
        render:(text)=>{
          const comps = companyList.filter((comp)=>comp.company_code===text)[0];
          return comps?comps.company_name:null;
        },
        sorter: (a, b) => a.companyCode.localeCompare(b.companyCode, 'zh'),
      },
      {
        title: '险种名称',
        dataIndex: 'name',
        key: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name, 'zh'),
      },
      {
        title: '险种代码',
        dataIndex: 'code',
        key: 'code',
        sorter: (a, b) => a.code.localeCompare(b.code, 'zh'),
      },
      {
        title: '险种类别',
        dataIndex: 'isGroupOrder',
        key: 'isGroupOrder',
        render: text => insuranceTypeOpt.map(type => type.value === text && type.label),
        sorter: (a, b) => a.isGroupOrder.localeCompare(b.isGroupOrder, 'zh'),
      },
      {
        title: '保障期限',
        dataIndex: 'guaranteeTermType',
        key: 'guaranteeTermType',
        render: text => periodOpt.map(type => type.value === text && type.label),
        sorter: (a, b) => a.guaranteeTermType.localeCompare(b.guaranteeTermType, 'zh'),
      },
      {
        title: '是否基金型险种',
        dataIndex: 'isFundationType',
        key: 'isFundationType',
        render: (text, record) => (record.isFundationType === true ? '是' : '否'),
        sorter: (a, b) => a.isFundationType - b.isFundationType,
      },
      {
        title: '',
        dataIndex: '',
        width: 40,
        render: () => <Icon type="right" />,
      },
    ];
    const groupColumns = [
      {
        title: '保险公司',
        dataIndex: 'companyCode',
        key: 'companyCode',
        render:(text)=>{
          const comps = companyList.filter((comp)=>comp.company_code===text)[0];
          return comps?comps.company_name:null;
        },
        sorter: (a, b) => a.companyCode.localeCompare(b.companyCode, 'zh'),
      },
      {
        title: '团体名称',
        dataIndex: 'groupName',
        key: 'groupName',
        sorter: (a, b) => a.groupName.localeCompare(b.groupName, 'zh'),
      },
      {
        title: '团体保单号',
        dataIndex: 'policyId',
        key: 'policyId',
        sorter: (a, b) => a.policyId.localeCompare(b.policyId, 'zh'),
      },
      {
        title: '是否基金型险种',
        dataIndex: 'isFundationType',
        key: 'isFundationType',
        render: (text, record) => (record.isFundationType === true ? '是' : '否'),
        sorter: (a, b) => a.isFundationType - b.isFundationType,
      },
      {
        title: '',
        dataIndex: '',
        width: 40,
        render: () => <Icon type="right" />,
      },
    ];
    const sceneColumns = [
      {
        title: '场景代码',
        dataIndex: 'sceneGroupCode',
        key: 'sceneGroupCode',
        width:'20%'
        // sorter: (a, b) => a.groupName.localeCompare(b.groupName, 'zh'),
      },
      {
        title: '场景名称',
        dataIndex: 'sceneGroupName',
        key: 'sceneGroupName',
        width:'25%'
        // sorter: (a, b) => a.policyId.localeCompare(b.policyId, 'zh'),
      },
      {
        title: '场景描述',
        dataIndex: 'sceneGroupDesc',
        key: 'sceneGroupDesc',
        width:'55%'
      },
      {
        title: '',
        dataIndex: '',
        width: 40,
        render: () => <Icon type="right" />,
      },
    ];
    const singleColumns = [
      {
        title: '保险公司',
        dataIndex: 'companyCode',
        key: 'companyCode',
        render:(text)=>{
          const comps = companyList.filter((comp)=>comp.company_code===text)[0];
          return comps?comps.company_name:null;
        },
        sorter: (a, b) => a.companyCode.localeCompare(b.companyCode, 'zh'),
      },
      {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        sorter: (a, b) => a.productName.localeCompare(b.productName, 'zh'),
      },
      {
        title: '产品代码',
        dataIndex: 'productCode',
        key: 'productCode',
        sorter: (a, b) => a.productCode.localeCompare(b.productCode, 'zh'),
      },
      {
        title: '配置时间',
        dataIndex: 'modifiedAt',
        key: 'modifiedAt',
        render: (text) => text.substring(0,10),
        sorter: (a, b) => a.modifiedAt - b.modifiedAt,
      },
      {
        title: '',
        dataIndex: '',
        width: 40,
        render: () => <Icon type="right" />,
      },
    ];
    const columns = [dataColumns, matchingColumns, groupColumns, sceneColumns, singleColumns];
    const title = [`险种责任列表（${total}）`, `险种匹配列表（${total}）`, `团体列表（${total}）`, '场景列表', `个单列表（${total}）`];
    const allcomp = companyList.map((comp)=>`${comp.company_code}-${comp.company_name}`);
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };

    return (
      <div className={styles.fullboard}>
        <Card className={styles.marginBottom}>
          <Form onSubmit={this.querySettingList}>
            {pageIndex === 0 && (
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="保险公司">
                    {getFieldDecorator('companyCode')(
                      <AutoComplete
                        placeholder='选择保险公司'
                        dropdownMatchSelectWidth={false}
                        dataSource={companykeyword.length>0?companyopts:allcomp}
                        onChange={(e)=>this.handleCompSearch(e)}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="险种名称">
                    {getFieldDecorator('insuranceName')(<Input placeholder="输入险种名称" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="险种代码">
                    {getFieldDecorator('insuranceCode')(<Input placeholder="输入险种代码" />)}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                  <FormItem {...formItemLayout} label="险种责任类型">
                    {getFieldDecorator('dutyType')(
                      <Select placeholder="请选择">
                        <Option value="1">门诊费用型</Option>
                        <Option value="2">住院费用型</Option>
                        <Option value="3">津贴</Option>
                        <Option value="4">重疾</Option>
                        <Option value="5">伤残</Option>
                        <Option value="6">身故</Option>
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="出险类型">
                    {getFieldDecorator('accidentTypes', {})(
                      <CheckboxGroup options={accidentTypeOpt} />
                    )}
                  </FormItem>
                </Col> */}
                <Col span={8}>
                  <FormItem {...formItemLayout} label="险种类别">
                    {getFieldDecorator('isGroupOrders', {})(
                      <CheckboxGroup options={insuranceTypeOpt} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="保障期限">
                    {getFieldDecorator('guaranteeTermTypes', {})(
                      <CheckboxGroup options={periodOpt} />
                    )}
                  </FormItem>
                </Col>
                <Col span={7} className={styles.alignRight}>
                  <Button
                    type="primary"
                    size="default"
                    onClick={() => this.querySettingList()}
                    style={{ width: 100 }}
                  >
                    查 询
                  </Button>
                </Col>
              </Row>
            )}
            {pageIndex === 1 && (
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="保险公司">
                    {getFieldDecorator('companyCode')(
                      <AutoComplete
                        placeholder='选择保险公司'
                        dropdownMatchSelectWidth={false}
                        dataSource={companykeyword.length>0?companyopts:allcomp}
                        onChange={(e)=>this.handleCompSearch(e)}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="险种名称">
                    {getFieldDecorator('name')(<Input placeholder="输入险种名称" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="险种代码">
                    {getFieldDecorator('code')(<Input placeholder="输入险种代码" />)}
                  </FormItem>
                </Col>
                {/* <Col span={8}>
                <FormItem {...formItemLayout} label="出险类型">
                  {getFieldDecorator('accidentType', {})(
                    <CheckboxGroup options={accidentTypeOpt} />
                  )}
                </FormItem>
              </Col> */}
                <Col span={8}>
                  <FormItem {...formItemLayout} label="险种类别">
                    {getFieldDecorator('isGroupOrders', {})(
                      <CheckboxGroup options={insuranceTypeOpt} />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="保障期限">
                    {getFieldDecorator('guaranteeTermTypes', {})(
                      <CheckboxGroup options={periodOpt} />
                    )}
                  </FormItem>
                </Col>
                <Col span={7} className={styles.alignRight}>
                  <Button
                    type="primary"
                    size="default"
                    onClick={() => this.querySettingList()}
                    style={{ width: 100 }}
                  >
                    查 询
                  </Button>
                </Col>
              </Row>
            )}
            {pageIndex === 2 && (
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="保险公司">
                    {getFieldDecorator('companyCode')(
                      <AutoComplete
                        placeholder='选择保险公司'
                        dropdownMatchSelectWidth={false}
                        dataSource={companykeyword.length>0?companyopts:allcomp}
                        onChange={(e)=>this.handleCompSearch(e)}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="团体名称">
                    {getFieldDecorator('groupName')(<Input placeholder="输入险种名称" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="团体保单号">
                    {getFieldDecorator('policyId')(<Input placeholder="输入团体保单号" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="是否基金型险种">
                    {getFieldDecorator('isFundationType', {})(
                      <RadioGroup>
                        <Radio value={false}>否</Radio>
                        <Radio value={!!1 === true}>是</Radio>
                      </RadioGroup>
                    )}
                  </FormItem>
                </Col>
                <Col span={15} className={styles.alignRight}>
                  <Button
                    type="primary"
                    size="default"
                    onClick={() => this.querySettingList()}
                    style={{ width: 100 }}
                  >
                    查 询
                  </Button>
                </Col>
              </Row>
            )}
            {pageIndex === 3 && (
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="场景名称">
                    {getFieldDecorator('sceneGroupName')(<Input placeholder="输入场景名称" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="场景代码">
                    {getFieldDecorator('sceneGroupCode')(<Input placeholder="输入场景代码" />)}
                  </FormItem>
                </Col>
                <Col span={7} className={styles.alignRight}>
                  <Button
                    type="primary"
                    size="default"
                    onClick={() => this.querySettingList()}
                    style={{ width: 100 }}
                  >
                    查 询
                  </Button>
                </Col>
              </Row>
            )}
            {pageIndex === 4 && (
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="保险公司">
                    {getFieldDecorator('companyCode')(
                      <AutoComplete
                        placeholder='选择保险公司'
                        dropdownMatchSelectWidth={false}
                        dataSource={companykeyword.length>0?companyopts:allcomp}
                        onChange={(e)=>this.handleCompSearch(e)}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="产品名称">
                    {getFieldDecorator('productName')(<Input placeholder="输入产品名称" />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label="产品代码">
                    {getFieldDecorator('productCode')(<Input placeholder="输入产品代码" />)}
                  </FormItem>
                </Col>
                <Col span={23} className={styles.alignRight}>
                  <Button
                    type="primary"
                    size="default"
                    onClick={() => this.querySettingList()}
                    style={{ width: 100 }}
                  >
                    查 询
                  </Button>
                </Col>
              </Row>
            )}
          </Form>
        </Card>
        {onInit ? (
          <div className={styles.initBlock}>
            <img src={[initPic, matchingPic, groupInitPic, definingPic, groupInitPic][pageIndex]} alt="" />
            {pageIndex === 0 ? (
              <div>
                还没有险种责任，您可以
                <span className={styles.startBtn} onClick={() => this.downloadModel()}>
                  下载
                </span>
                模板，填充内容后
                <Upload {...props}>
                  <span className={styles.startBtn}>导入</span>
                </Upload>
                或
                <span className={styles.startBtn} onClick={() => this.openSetting()}>创建</span>
              </div>
            ) : (
              <div>
                还没有
                {['', '匹配记录', '配置记录','风险场景', '配置记录'][pageIndex]}
                ，您可以
                <span className={styles.startBtn} onClick={() => this.openSetting()}>
                  {['', '开始匹配', '开始配置', '开始创建', '开始配置'][pageIndex]}
                </span>
                {['', '险种风控场景', '团单风控模型','风险场景', '个单风控模型'][pageIndex]}
              </div>
            )}
          </div>
        ) : (
          <Card
            title={title[pageIndex]}
            style={{ marginTop: 24 }}
            bodyStyle={{ padding: '0 32px 40px 32px' }}
            extra={extraContent}
          >
            <Table
              dataSource={insuranceList}
              loading={loading}
              columns={columns[pageIndex]}
              rowKey="id"
              rowSelection={rowSelection}
              onRowClick={record => {
                this.handleCheck(record);
              }}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                pageSizeOptions: ['10', '50', '100', '200', '500', '1000'],
                pageSize: filter.size,
                current: filter.page + 1,
                total:totalElement,
                onChange: (page, pageSize) => {
                  this.querySettingList({
                    ...filter,
                    page: page-1,
                    size: pageSize || filter.size,
                  });
                },
                onShowSizeChange: (current, size) => {
                  this.querySettingList({
                    ...filter,
                    page: current-1,
                    size,
                  });
                },
              }}
            />
          </Card>
        )}
        {deleting && (
          <Modal
            title={
              <div style={{ fontSize: 18 }}>
                <Icon type="warning" style={{ color: '#EB3850', fontSize: 28, margin: 6 }} />
                删除
              </div>
            }
            wrapClassName="newBatchModal"
            visible={deleting}
            width={450}
            onCancel={() => this.setState({ deleting: false })}
            footer={
              <div>
                <Button
                  style={{
                    width: 100,
                    background: 'white',
                    border: '1px solid #4291EB',
                    color: '#4291EB',
                  }}
                  onClick={() => this.delInsurance()}
                >
                  删除
                </Button>
                <Button
                  style={{
                    width: 100,
                    background: 'white',
                    border: '1px solid #4291EB',
                    color: '#4291EB',
                  }}
                  onClick={() => this.setState({ deleting: false })}
                >
                  取消
                </Button>
              </div>
            }
          >
            {deletecontent[pageIndex]}
          </Modal>
        )}
        {onalert && (
          <Modal
            visible={onalert}
            title={
              <div style={{ fontSize: 18 }}>
                <Icon type="close-circle" style={{ color: '#EB3850', fontSize: 20, margin: 10 }} />
                错误
              </div>
            }
            width={450}
            onCancel={() => this.setState({ onalert: false })}
            footer={
              <div>
                <Button
                  style={{
                    width: 100,
                    background: 'white',
                    border: '1px solid #4291EB',
                    color: '#4291EB',
                  }}
                  onClick={() => this.setState({ onalert: false })}
                >
                  知道了
                </Button>
              </div>
            }
          >
            {alertcontent}
          </Modal>
        )}
      </div>
    );
  }
}

export default InsuranceIndex;
