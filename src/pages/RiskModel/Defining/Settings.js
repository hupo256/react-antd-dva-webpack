import React, { Component } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Button, Form, Input, message, Breadcrumb, Modal, Icon, Checkbox } from 'antd';
import styles from '../style.less';
import InsuranceDuty from './duty';

const CheckboxGroup = Checkbox.Group;
const { TextArea } = Input;

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
      warningList:[false, false, false, false, false, false, false],
      rnameWarning:[false],
      rradioWarning:[false],
      sceneGroupCode: '',
      sceneGroupName: '',
      sceneGroupDesc:'',
      companyList:[],
      allcompany: false,
      companyCodes:['000000'],
      guaranteeTermTypes: ['1'],
      isGroupOrders: [false],
      accidentTypes:['1'],
      dutyTypes:['1'],
      tabKey:'1',
      ruleorModelNames: [
        {
          modelName: '',
          radio: 0,
          isActive:true,
          cfgJson: {}
        },
      ],
    };
  }

  componentDidMount() {
    const { companyCodes } = this.state;
    const payload = parse(window.location.href.split('?')[1]);
    const { dispatch } = this.props;
    dispatch({
      type:'product/fetchCompanyList',
      callback:(res)=>{
        const list = [];
        res.data.forEach((comp)=>{
          list.push({label:comp.company_name, value: comp.company_code});
        });
        if(companyCodes.indexOf('000000')>=0)
          this.setState({allcompany: true, companyCodes:list.map((comp)=>comp.value)});
        this.setState({companyList: list});
        if (payload.id) this.setState({ id: payload.id });
        if (payload.id) this.querySettingList(payload.id, list);
      }
    })
    dispatch({
      type: 'riskmodel/getModel',
      payload,
      callback: res => {
        console.log(res);
        if (res.success) {
          this.setState({models: res.data});
        }
      }
    });
  }

  querySettingList = (id, list) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/fetchScenegroupDetail',
      payload: id,
      callback: res => {
        if (res.success) {
          if (res.data){
            this.setState({
              ruleorModelNames: res.data.ruleorModelNames,
              sceneGroupCode: res.data.sceneGroupCode,
              sceneGroupName: res.data.sceneGroupName,
              sceneGroupDesc: res.data.sceneGroupDesc,
              guaranteeTermTypes: res.data.guaranteeTermTypes,
              isGroupOrders: res.data.isGroupOrders,
              accidentTypes: res.data.accidentTypes,
              dutyTypes: res.data.dutyTypes
            });
            if(res.data.companyCodes.indexOf('000000')>=0){
              this.setState({allcompany: true, companyCodes:list.map((comp)=>comp.value)});
            }else{
              this.setState({companyCodes:res.data.companyCodes});
            }
          }
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  onSave = () => {
    const {
      ruleorModelNames,
      sceneGroupCode,
      sceneGroupName,
      id,
      isGroupOrders,
      guaranteeTermTypes,
      companyCodes,
      sceneGroupDesc,
      dutyTypes,
      accidentTypes,
      allcompany,
      warningList,
      rnameWarning,
      rradioWarning
    } = this.state;
    const { dispatch } = this.props;
    let topage = '2';
    warningList[0] = !sceneGroupName?1:false;
    warningList[1] = !sceneGroupCode?1:false;
    warningList[2] = isGroupOrders.length===0?1:false;
    warningList[3] = accidentTypes.length===0?1:false;
    warningList[4] = dutyTypes.length === 0?1:false;
    warningList[5] = guaranteeTermTypes.length===0?1:false;
    warningList[6] = companyCodes.length===0?1:false;
    if(warningList[0]||warningList[1]){
      topage = '1';
    }
    if (ruleorModelNames.length === 0) {
      rnameWarning[0] = true;
      rradioWarning[0] = true;
      topage = '1';
    }
    ruleorModelNames.forEach(
      (rule, index) =>{
        if(!rule.radio){
          rradioWarning[index] = true;
        }else{
          rradioWarning[index] = false;
        }
        if(!rule.modelName){
          rnameWarning[index] = true;
        }else{
          rnameWarning[index] = false;
        }
      }
    )
    if(rnameWarning.some((a)=>a===true)||rradioWarning.some((a)=>a===true)||warningList.some((a)=>a!==false)){
      message.error('请输入所有必填项', [10]);
      this.setState({tabKey: topage});
      return;
    }

    const payload = { ruleorModelNames, sceneGroupCode, sceneGroupName,sceneGroupDesc, id, isGroupOrders, guaranteeTermTypes,dutyTypes, companyCodes, accidentTypes };
    if(allcompany===true){
      payload.companyCodes = ['000000'];
    }
    dispatch({
      type: 'riskmodel/updateScenegroup',
      payload,
      callback: res => {
        console.log(res);
        if (res.success) {
          message.success('保存成功！', [1], () => this.jumpTo());
        } else message.error(res.message, [10]);
      },
    });
  };

  jumpTo = () => {
    const { history } = this.props;
    history.push('/scenario/insurance/defining');
  };

  onChange = (name, value, index) => {
    const { ruleorModelNames } = this.state;
    ruleorModelNames[index][name] = value;
    this.setState({ ruleorModelNames });
  };

  delDuty = index => {
    const { ruleorModelNames } = this.state;
    ruleorModelNames.splice(index, 1);
    this.setState({ ruleorModelNames });
  };

  addDuty = () => {
    const { ruleorModelNames } = this.state;
    ruleorModelNames.push({
      modelName: '',
      radio: 0,
      isActive:true,
      cfgJson: {}
    },);
    this.setState({ ruleorModelNames });
  };

  onDelete = () => {
    const { id } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/removeScenegroup',
      payload: id,
      callback: res => {
        if (!res.success) {
          message.error(res.message, [5]);
        } else {
          this.jumpTo();
        }
      },
    });
  };

  onTabChange = (key)=>{
    this.setState({tabKey: key});
  }

  render() {
    const {
      warning,
      ruleorModelNames,
      sceneGroupName,
      sceneGroupCode,
      sceneGroupDesc,
      companyList,
      allcompany,
      companyCodes,
      cancelling,
      deleting,
      id,
      isGroupOrders,
      guaranteeTermTypes,
      accidentTypes,
      dutyTypes,
      tabKey,
      models,
      warningList,
      rradioWarning,
      rnameWarning
    } = this.state;
    const { history } = this.props;
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
    const accidentTypesOpt = [
      {
        label:'疾病',value:'1'
      },{
        label:'意外',value:'2'
      },{
        label:'其他',value:'3'
      }];
      const dutyTypesOpt = [
        {
          label: '门诊费用型',
          value: '1',
        },
        {
          label: '住院费用型',
          value: '2',
        },
        {
          label: '津贴',
          value: '3',
        },
        {
          label: '重疾',
          value: '4',
        },
        {
          label: '伤残',
          value: '5',
        },
        {
          label: '身故',
          value: '6',
        },
      ];
    return (
      <PageHeaderWrapper
        hiddenBreadcrumb={1}
        content={
          <div className={styles.settingboard}>
            <Breadcrumb style={{ float: 'left' }}>
              <Breadcrumb.Item
                onClick={() => {
                  history.push('/scenario/insurance/defining');
                }}
              >
              场景列表
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                场景详情定义
              </Breadcrumb.Item>
            </Breadcrumb>
            <div className={styles.topLine} style={{position:'absolute', right:50}}>
              <Button
                className={styles.subBtn}
                onClick={() => this.setState({ cancelling: true, warning: true })}
              >
                取消
              </Button>
              <Button className={styles.priBtn} onClick={() => this.onSave()}>
                保存
              </Button>
              {id ? (
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
          </div>}
        tabList={[{tab:'场景定义',key:'1'},{tab:'使用范围',key:'2'}]}
        onTabChange={this.onTabChange}
      >
        <div className={styles.settingboard}>
          {tabKey==='1'&&
          <div className={styles.customCard} style={{minHeight:250}}>
            <div className={styles.newtitleLine}>场景信息</div>
            <div className={styles.attrList}>
              <div className={styles.attrItem}>
                <div className={styles.label}>场景名称：</div>
                <Input
                  className={`${styles.attrInput} ${warningList[0]&&styles.warningItem}`}
                  value={sceneGroupName}
                  placeholder='输入名称'
                  onChange={e => this.setState({ sceneGroupName: e.target.value })}
                />
              </div>
              <div className={styles.attrItem}>
                <div className={styles.label}>场景代码：</div>
                <Input
                  className={`${styles.attrInput} ${warningList[1]&&styles.warningItem}`}
                  value={sceneGroupCode}
                  placeholder='输入代码'
                  onChange={e => this.setState({ sceneGroupCode: e.target.value.replace(/[\u4e00-\u9fa5]/g, "") })}
                />
              </div>
              <div className={styles.attrItem} style={{height:'auto'}}>
                <div className={`${styles.notrequiredlabel} ${styles.label}`}>场景描述：</div>
                <TextArea
                  className={styles.attrInput}
                  value={sceneGroupDesc}
                  placeholder='输入描述'
                  onChange={e => this.setState({ sceneGroupDesc: e.target.value })}
                />
              </div>
            </div>
          </div>}
          {tabKey==='1'&&
          <div className={styles.customCard} style={{minHeight:250}}>
            <div className={styles.newtitleLine}>规则信息</div>
            {ruleorModelNames.map((duty, index) => (
              <InsuranceDuty
                duty={duty}
                index={index}
                rradioWarning={rradioWarning}
                rnameWarning={rnameWarning}
                models={models}
                onChange={this.onChange}
                delDuty={ruleorModelNames.length > 1 ? this.delDuty : undefined}
              />
            ))}
            <Button
              icon="plus"
              className={styles.priBtn}
              style={{ margin: '20px 100px 65px 0', width: 110 }}
              onClick={() => this.addDuty()}
            >
              增加规则
            </Button>
          </div>}
          {tabKey==='2'&&
          <div className={`${styles.customCard} ${styles.dfCard}`}>
            <div className={styles.attrList}>
              <div className={styles.attrItem}>
                <div className={styles.label}>险种类别：</div>
                <CheckboxGroup
                  style={{ marginTop: 4 }}
                  className={`${warningList[2]&&styles.warningItem}`}
                  value={isGroupOrders}
                  options={insuranceTypeOpt}
                  onChange={e => this.setState({ isGroupOrders: e })}
                />
              </div>
              <div className={styles.attrItem}>
                <div className={styles.label}>出险类型：</div>
                <CheckboxGroup
                  style={{ marginTop: 4 }}
                  value={accidentTypes}
                  options={accidentTypesOpt}
                  className={`${warningList[3]&&styles.warningItem}`}
                  onChange={e => this.setState({ accidentTypes: e })}
                />
              </div>
              <div className={styles.attrItem}>
                <div className={styles.label}>险种责任类型：</div>
                <CheckboxGroup
                  style={{ marginTop: 4 }}
                  value={dutyTypes}
                  options={dutyTypesOpt}
                  className={`${warningList[4]&&styles.warningItem}`}
                  onChange={e => this.setState({ dutyTypes: e })}
                />
              </div>
              <div className={styles.attrItem}>
                <div className={styles.label}>保障期限：</div>
                <CheckboxGroup
                  style={{ marginTop: 4 }}
                  value={guaranteeTermTypes}
                  options={periodOpt}
                  className={`${warningList[5]&&styles.warningItem}`}
                  onChange={e => this.setState({ guaranteeTermTypes: e })}
                />
              </div>
            </div>
            <div className={styles.divider} />
            <div className={`${styles.attrItem} ${styles.widthattrItem}`} style={{marginTop:50 }}>
              <div className={styles.label}>适用的保险公司：</div>
              <Checkbox
                checked={allcompany}
                onChange={e => this.setState({ allcompany: e.target.checked, companyCodes: e.target.checked?companyList.map((comp)=>comp.value):[] })}
              >
                所有保险公司通用
              </Checkbox>
              <CheckboxGroup
                style={{ marginTop: 4}}
                value={companyCodes}
                options={companyList}
                className={`${warningList[6]&&styles.warningItem}`}
                onChange={e => this.setState({ companyCodes: e })}
              />
            </div>
          </div>}
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
                    onClick={() => this.onDelete()}
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
              删除后，该险种及责任信息将全部丢失，无法恢复，确认删除？
            </Modal>
          )}
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default InsuranceSetting;
