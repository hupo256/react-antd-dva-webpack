import React, { Component } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { Button, Form, Input, message, Radio, Breadcrumb, Modal, Icon, Select } from 'antd';
import styles from '../style.less';
import InsuranceDuty from './InsuranceDuty';

const RadioGroup = Radio.Group;
const { Option } = Select;

@Form.create(state => ({
  riskmodel: state.riskmodel,
}))
@connect()
class InsuranceSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warning: false,
      cancelling: false,
      deleting: false,
      insuranceCode: '',
      insuranceName: '',
      companyCode:'',
      isFundationType: false,
      guaranteeTermType: '1',
      isGroupOrder: false,
      companyList:[],
      dutyRequestList: [
        {
          dutyName: '',
          dutyCode: '',
        },
      ],
    };
  }

  componentDidMount() {
    const payload = parse(window.location.href.split('?')[1]);
    if (payload.id) this.setState({ id: payload.id });
    if (payload.id) this.querySettingList(payload.id, payload.companyCode);
    const { dispatch } = this.props;
    dispatch({
      type:'product/fetchCompanyList',
      callback:(res)=>{
        this.setState({companyList: res.data});
      }
    })
  }

  querySettingList = (id, companyCode) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/fetchImportRisk',
      payload: {id, companyCode },
      callback: res => {
        if (res.success) {
          if (res.data)
            this.setState({
              dutyRequestList: res.data.dutyRequestList,
              insuranceCode: res.data.insuranceCode,
              insuranceName: res.data.insuranceName,
              isFundationType: res.data.isFundationType,
              guaranteeTermType: res.data.guaranteeTermType,
              isGroupOrder: res.data.isGroupOrder,
              companyCode: res.data.companyCode
            });
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  onSave = () => {
    const { dutyRequestList, insuranceCode, insuranceName, isFundationType, id, isGroupOrder, guaranteeTermType,companyCode } = this.state;
    const { dispatch } = this.props;
    if (dutyRequestList.length === 0) {
      this.setState({ warning: true });
      return;
    }
    if (
      !companyCode||
      !insuranceCode ||
      !insuranceName ||
      typeof isGroupOrder === 'undefined' ||
      typeof guaranteeTermType === 'undefined' ||
      !dutyRequestList.every(
        duty =>
          isFundationType || (duty.dutyCode && duty.dutyName && duty.dutyTypes && duty.accidentTypes)
      )
    ) {
      message.error('请输入所有必填项', [10]);
      return;
    }
    const codes = dutyRequestList.map(duty => duty.dutyCode);
    let flag = false;
    while (codes.length > 0) {
      const a = codes.pop();
      if (codes.indexOf(a) > -1) flag = true;
    }
    if (flag) {
      message.error('责任代码不可重复！');
      return;
    }
    const payload = { dutyRequestList, insuranceCode, insuranceName, isFundationType, id, isGroupOrder, guaranteeTermType,companyCode };
    dispatch({
      type: id ? 'riskmodel/updateImportRisk' : 'riskmodel/saveImportRisk',
      payload,
      callback: res => {
        // console.log(res);
        if (res.success) {
          message.success('保存成功！', [1], () => this.jumpTo());
        } else message.error(res.message, [10]);
      },
    });
  };

  jumpTo = () => {
    const { history } = this.props;
    history.push('/scenario/insurance/import');
  };

  onChange = (name, value, index) => {
    const { dutyRequestList } = this.state;
    dutyRequestList[index][name] = value;
    this.setState({ dutyRequestList });
  };

  delDuty = index => {
    const { dutyRequestList } = this.state;
    dutyRequestList.splice(index, 1);
    this.setState({ dutyRequestList });
  };

  addDuty = () => {
    const { dutyRequestList } = this.state;
    dutyRequestList.push({
      dutyName: '',
      dutyCode: '',
    });
    this.setState({ dutyRequestList });
  };

  // onDelete = () => {
  //   const { id, companyCode } = this.state;
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: 'riskmodel/delImportRisk',
  //     payload: {id, companyCode},
  //     callback: res => {
  //       if (!res.success) {
  //         message.error(res.message, [5]);
  //       } else {
  //         this.jumpTo();
  //       }
  //     },
  //   });
  // };

  render() {
    const {
      warning,
      isFundationType,
      dutyRequestList,
      insuranceName,
      insuranceCode,
      companyCode,
      cancelling,
      deleting,
      id,
      isGroupOrder,
      guaranteeTermType,
      companyList
    } = this.state;
    const { history } = this.props;
    return (
      <div className={styles.settingboard}>
        <div className={styles.topLine}>
          <Breadcrumb style={{ float: 'left' }}>
            <Breadcrumb.Item
              onClick={() => {
                history.push('/scenario/insurance/import');
              }}
            >
              险种责任列表
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {id ? `${insuranceName} ${insuranceCode}` : '创建险种'}
            </Breadcrumb.Item>
          </Breadcrumb>
          <Button
            className={styles.subBtn}
            onClick={() => this.setState({ cancelling: true, warning: true })}
          >
            取消
          </Button>
          <Button className={styles.priBtn} onClick={() => this.onSave()}>
            保存
          </Button>
        </div>
        <div className={styles.customCard}>
          <div className={styles.titleLine}>险种</div>
          <div className={styles.attrList}>
            <div className={styles.attrItem}>
              <div className={styles.label}>保险公司：</div>
              <Select placeholder='选择保险公司' value={companyCode} className={styles.attrInput} dropdownMatchSelectWidth={false} onChange={e => this.setState({ companyCode: e })}>
                {companyList.map((comp)=><Option value={comp.company_code}>{comp.company_name}</Option>)}
              </Select>
            </div>
            <div className={styles.attrItem}>
              <div className={styles.label}>险种名称：</div>
              <Input
                className={styles.attrInput}
                value={insuranceName}
                placeholder='输入险种名称'
                onChange={e => this.setState({ insuranceName: e.target.value })}
              />
            </div>
            <div className={styles.attrItem}>
              <div className={styles.label}>险种代码：</div>
              <Input
                className={styles.attrInput}
                value={insuranceCode}
                placeholder='输入险种代码'
                onChange={e => this.setState({ insuranceCode: e.target.value.replace(/[\u4e00-\u9fa5]/g, "") })}
              />
            </div>
            <div className={styles.attrItem}>
              <div className={styles.label}>是否基金型险种：</div>
              <RadioGroup
                style={{ marginTop: 4 }}
                value={isFundationType}
                onChange={e => this.setState({ isFundationType: e.target.value })}
              >
                <Radio value={false}>否</Radio>
                <Radio value={!!1}>是</Radio>
              </RadioGroup>
            </div>
            <div className={styles.attrItem}>
              <div className={styles.label}>保障期限：</div>
              <RadioGroup
                style={{ marginTop: 4 }}
                value={guaranteeTermType}
                onChange={e => this.setState({ guaranteeTermType: e.target.value })}
              >
                <Radio value="1">短期</Radio>
                <Radio value="2">长期</Radio>
              </RadioGroup>
            </div>
            <div className={styles.attrItem}>
              <div className={styles.label}>险种类别：</div>
              <RadioGroup
                style={{ marginTop: 4 }}
                value={isGroupOrder}
                onChange={e => this.setState({ isGroupOrder: e.target.value })}
              >
                <Radio value={false}>个险</Radio>
                <Radio value={!!1}>团险</Radio>
              </RadioGroup>
            </div>
          </div>
          {dutyRequestList.map((duty, index) => (
            <InsuranceDuty
              duty={duty}
              index={index}
              isFundationType={isFundationType}
              onChange={this.onChange}
              delDuty={dutyRequestList.length > 1 ? this.delDuty : undefined}
            />
          ))}
          {id ? '' : <div className={styles.divider} />}
          <div style={{width:'100%',overflow:'hidden'}}>
            <Button
              icon="plus"
              className={styles.priBtn}
              style={{ margin: '20px 100px 65px 0', width: 110 }}
              onClick={() => this.addDuty()}
            >
              增加责任
            </Button>
          </div>
        </div>
        {warning && (
          <Modal
            title={
              <div style={{ fontSize: 18 }}>
                <Icon
                  type="warning"
                  style={{ color: 'rgb(241, 194, 22)', fontSize: 28, margin: 6 }}
                />
                提示
              </div>
            }
            visible={warning}
            width={450}
            onCancel={() => this.setState({ warning: false, cancelling: false })}
            footer={
              <div>
                <Button
                  style={{
                    width: 100,
                    background: 'white',
                    border: '1px solid #4291EB',
                    color: '#4291EB',
                  }}
                  onClick={() => this.setState({ warning: false, cancelling: false })}
                >
                  {id ? '继续编辑' : '继续创建'}
                </Button>
                <Button
                  style={{
                    width: 100,
                    background: 'white',
                    border: '1px solid #4291EB',
                    color: '#4291EB',
                  }}
                  onClick={() => this.jumpTo()}
                >
                  取消
                  {id ? '编辑' : '创建'}
                </Button>
              </div>
            }
          >
            {cancelling
              ? `取消后，所有数据将不被保存且无法恢复，继续取消${id ? '编辑' : '创建'}?`
              : '每个险种需要选择至少一个责任。'}
          </Modal>
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
                  onClick={() => this.setState({ deleting: false })}
                >
                  取消
                </Button>
                <Button
                  style={{
                    width: 100,
                    background: 'white',
                    border: '1px solid #4291EB',
                    color: '#4291EB',
                  }}
                  onClick={() => this.onDelete()}
                >
                  删除
                </Button>
              </div>
            }
          >
            删除后，该险种及责任信息将全部丢失，无法恢复，确认删除？
          </Modal>
        )}
      </div>
    );
  }
}

export default InsuranceSetting;
