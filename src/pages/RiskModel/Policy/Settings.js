import React, { Component } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import { Button, Form, message, Breadcrumb, Modal, Icon, AutoComplete } from 'antd';
import styles from '../style.less';
import InsuranceDuty from './InsuranceDuty';
// import {defaultList} from '../modelList.json';

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
      name: '',
      code: '',
      companyCode:'',
      isFundationType: false,
      guaranteeTermType: '',
      isGroupOrder: '',
      savestatus: false,
      // defaultRiskList: [],
      riskList: [],
      dutyList: [],
      models:[],
      companyList:[],
      companyopts: [],
      insuranceopts:[],
      companykeyword:'',
      insurancekeyword:''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const payload = parse(window.location.href.split('?')[1]);
    if (payload.id){
      this.querySettingList(payload.id);
      this.setState({companyCode: payload.companyCode, companykeyword:payload.companyCode});
    }
    this.getRiskList(true);
    dispatch({
      type:'product/fetchCompanyList',
      callback:(res)=>{
        this.setState({companyList: res.data});
        const comps = res.data.filter((comp)=>comp.company_code===payload.companyCode)[0];
        this.setState({companykeyword:comps?comps.company_name:''});
      }
    })
  }

  querySettingList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/fetchRisk',
      payload: id,
      callback: res => {
        if (res.success) {
          if (res.data)
            this.setState({
              dutyList: res.data.dutyList,
              code: res.data.insuranceCode,
              insuranceCode: res.data.insuranceCode,
              insurancekeyword:res.data.insuranceCode,
              name: res.data.name,
              id: res.data.id,
              isFundationType: res.data.isFundationType,
              isGroupOrder: res.data.isGroupOrder,
              guaranteeTermType: res.data.guaranteeTermType,
            });
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  getRiskList = () => {
    const { code } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/fetchRiskList',
      payload: code,
      callback: res => {
        if (res.success) {
          this.setState({
            riskList: res.data,
          });
        } else {
          message.error(res.message, [10]);
        }
      },
    });
    dispatch({
      type: 'riskmodel/fetchScenegroup',
      payload: {},
      callback: res => {
        if (res.success) {
          this.setState({
            sceneList: res.data,
          });
        } else {
          message.error(res.message, [10]);
        }
      },
    });
    dispatch({
      type: 'riskmodel/getModel',
      payload:{},
      callback: res => {
        console.log(res);
        if (res.success) {
          this.setState({models: res.data});
        }
      }
    });
  };

  onSave = () => {
    const { dutyList, insuranceCode, name, isFundationType, id, isGroupOrder, guaranteeTermType, companyCode } = this.state;
    const { dispatch } = this.props;
    const payload = { dutyList, code: insuranceCode, insuranceCode, name, isFundationType, id, isGroupOrder, guaranteeTermType, companyCode };
    dispatch({
      type: 'riskmodel/saveRisk',
      payload,
      callback: res => {
        console.log(res);
        if (res.success) {
          message.success('保存成功！', [2], () => this.jumpTo());
        } else message.error(res.message, [10]);
      },
    });
  };

  jumpTo = () => {
    const { history } = this.props;
    history.push('/scenario/insurance/matching');
  };

  ruleEditing = (value, idx) => {
    const { dutyList, sceneList } = this.state;
    const dutyline = dutyList[idx];
    let sceneGroupNames = [];
    if(dutyline.sceneGroupList){
      sceneGroupNames = dutyline.sceneGroupList.map(a => a.sceneGroupCode)
    }else
    dutyline.sceneGroupList = [];
    value.map((item) => {
      if (sceneGroupNames.indexOf(item) < 0) {
        const sceneitem = sceneList.list.filter((scene)=>scene.sceneGroupCode === item)[0];
        dutyline.sceneGroupList.push({
          ...sceneitem,
          isRecommend: false,
          isActive: true,
        });
      }
      return null;
    });
    sceneGroupNames.forEach((item, i)=>{
      if(value.indexOf(item)<0 && dutyline.sceneGroupList[i]&&dutyline.sceneGroupList[i].isRecommend===false){
        dutyline.sceneGroupList.splice(i,1);
      }
    });
    console.log(dutyline.sceneGroupList);
    dutyList[idx] = dutyline;
    this.setState({ dutyList, savestatus: true });
  };

  onModelChange = (value, code, idx) => {
    const { dutyList } = this.state;
    const dutyline = dutyList[idx];
    const modelid = dutyline.sceneGroupList.map(a => a.sceneGroupCode).indexOf(code);
    dutyline.sceneGroupList[modelid].isActive = value;
    dutyList[idx] = dutyline;
    this.setState({ dutyList, savestatus: true });
  };

  onRuleChange = (value, name, modelid, idx) => {
    const { dutyList } = this.state;
    const dutyline = dutyList[idx];
    const names = dutyline.sceneGroupList[modelid].ruleorModelNames;
    const rid = names.map(a => a.modelName).indexOf(name);
    names[rid].isActive = value;
    dutyline.sceneGroupList[modelid].ruleorModelNames = names;
    dutyList[idx] = dutyline;
    this.setState({ dutyList, savestatus: true });
  }

  onDelete = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/delRisk',
      payload: window.location.href.split('=')[1],
      callback: res => {
        if (!res.success) {
          message.error(res.message, [5]);
        } else {
          this.jumpTo();
        }
      },
    });
  };

  selectInsurance = value => {
    const { riskList } = this.state;
    const code = value.split('-')[0];
    const risk = riskList.find(r => r.code === code);
    const name = value.split('-')[1];
    this.setState({
      insuranceCode: code,
      insurancekeyword:value,
      name,
      dutyList: risk.dutyList,
      savestatus: true,
      isFundationType: risk.isFundationType,
      isGroupOrder: risk.isGroupOrder,
      guaranteeTermType: risk.guaranteeTermType,
      companyCode: risk.companyCode
    });
  };

  handleCompSearch = (value) => {
    const { companyList } = this.state;
    const allcomp = companyList.map((comp)=>`${comp.company_code}-${comp.company_name}`);
    const result = allcomp.filter((comp)=>comp.indexOf(value)> -1);
    this.setState({companyopts: result, companykeyword: value});
  }

  handleInsuranceSearch = (value) => {
    const { riskList, companyCode } = this.state;
    const opts = !companyCode?[]:riskList.filter((r)=>r.companyCode===companyCode).map(item => `${item.insuranceCode}-${item.name}`);
    const result = opts.filter((comp)=>comp.indexOf(value)> -1);
    this.setState({insuranceopts: result, insurancekeyword: value});
  }

  render() {
    const {
      warning,
      isFundationType,
      dutyList,
      name,
      insuranceCode,
      cancelling,
      deleting,
      riskList,
      savestatus,
      guaranteeTermType,
      isGroupOrder,
      sceneList,
      models,
      companyList,
      companyopts,
      companykeyword,
      companyCode,
      insurancekeyword,
      insuranceopts
    } = this.state;
    const { history } = this.props;
    const opts = !companyCode?[]:riskList.filter((r)=>r.companyCode===companyCode).map(item => `${item.insuranceCode}-${item.name}`);
    const allcomp = companyList.map((comp)=>`${comp.company_code}-${comp.company_name}`);
    return (
      <div className={styles.settingboard}>
        <div className={styles.topLine}>
          <Breadcrumb style={{ float: 'left' }}>
            <Breadcrumb.Item
              onClick={() => {
                history.push('/scenario/insurance/matching');
              }}
            >
              险种匹配列表
            </Breadcrumb.Item>
            <Breadcrumb.Item>险种风控场景匹配</Breadcrumb.Item>
          </Breadcrumb>
          <Button
            className={styles.subBtn}
            onClick={() => this.setState({ cancelling: true, warning: true })}
          >
            取消
          </Button>
          <Button
            className={!savestatus ? styles.disabledpriBtn : styles.priBtn}
            onClick={() => (!savestatus ? '' : this.onSave())}
          >
            保存
          </Button>
          {window.location.href.split('=')[1] ? (
            <Button
              className={styles.delBtn}
              style={{ margin: '0 15px 0 0', width: 100, background: 'none' }}
              onClick={() => this.setState({ deleting: true })}
            >
              删除
            </Button>
          ) : (
            ''
          )}
        </div>
        <div className={styles.customCard}>
          <div className={styles.titleLine}>险种</div>
          <div className={styles.attrList}>
            <div className={`${styles.attrItem}   ${styles.primelabel}`}>
              <div className={styles.label} style={{width:'20%'}}>保险公司：</div>
              <AutoComplete
                className={styles.attrInput}
                style={{width:'25%'}}
                placeholder='选择保险公司'
                dropdownMatchSelectWidth={false}
                dataSource={companykeyword.length>0?companyopts:allcomp}
                onChange={(e)=>this.handleCompSearch(e)}
                value={companykeyword || ''}
                onSelect={(value)=>this.setState({companykeyword:value,companyCode:value.split('-')[0],insuranceCode:undefined,insurancekeyword:'', dutyList:[]})}
              />
              <div className={styles.label} style={{width:'20%'}}>险种代码：</div>
              <AutoComplete
                dataSource={insurancekeyword.length>0?insuranceopts:opts}
                onChange={(e)=>this.handleInsuranceSearch(e)}
                className={styles.attrInput}
                style={{width:'25%'}}
                placeholder='请输入险种代码'
                value={insurancekeyword || ''}
                onSelect={e => this.selectInsurance(e)}
              />
            </div>
            {insuranceCode && (
              <div className={styles.darkblock}>
                <div className={styles.infoslot}>
                  <div className={styles.infolabel}>险种名称：</div>
                  {name}
                </div>
                <div className={styles.infoslot}>
                  <div className={styles.infolabel}>险种类别：</div>
                  {isGroupOrder ? '团险' : '个险'}
                </div>
                <div className={styles.infoslot}>
                  <div className={styles.infolabel}>是否为基金型：</div>
                  {isFundationType ? '是' : '否'}
                </div>
                <div className={styles.infoslot}>
                  <div className={styles.infolabel}>保障期限：</div>
                  {guaranteeTermType === '1' ? '短期' : '长期'}
                </div>
              </div>
            )}
          </div>
          {insuranceCode && dutyList.map((duty, index) => (
            <InsuranceDuty
              models={models}
              duty={duty}
              index={index}
              isFundationType={isFundationType}
              onModelChange={this.onModelChange}
              onRuleChange={this.onRuleChange}
              sceneList={sceneList}
              goto={()=>history.push('/scenario/insurance/defining')}
              ruleEditing={this.ruleEditing}
            />
          ))}
          {/* <div className={styles.divider} /> */}
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
                  继续匹配
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
                  取消匹配
                </Button>
              </div>
            }
          >
            {cancelling
              ? '取消后，所有数据将不被保存且无法恢复，继续取消匹配？'
              : '每个险种需要选择至少一个责任。'}
          </Modal>
        )}
        {deleting && (
          <Modal
            title={
              <div style={{ fontSize: 18 }}>
                <Icon type="warning" style={{ color: '#EB3850', fontSize: 28, margin: 6 }} />
                提示
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
                    background: '#4291EB',
                    border: '1px solid #4291EB',
                    color: 'white',
                  }}
                  onClick={() => this.onDelete()}
                >
                  是
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
                  否
                </Button>
              </div>
            }
          >
            删除后，该匹配信息将全部丢失，无法恢复，确认删除？
          </Modal>
        )}
      </div>
    );
  }
}

export default InsuranceSetting;
