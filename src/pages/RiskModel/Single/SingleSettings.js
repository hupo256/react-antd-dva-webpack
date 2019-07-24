import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Form, Input, Breadcrumb, message, Modal, Icon, Select } from 'antd';
import styles from '../style.less';
import SingleInsurance from './SingleInsurance';

const { Option } = Select;

let counter = 0;

@Form.create(state => ({
  riskmodel: state.riskmodel,
}))
@connect()
class InsuranceGroupSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      warning: false,
      cancelling: false,
      deleting: false,
      name: '',
      code: '',
      isFundationType: false,
      companyCode:'',
      savestatus: false,
      riskList: [],
      companyList:[],
      sceneList:[],
      models:[],
      insuranceList: [
        {
          name: 'insurance0',
          key: counter,
        },
      ],
    };
  }

  componentDidMount() {
    const id = window.location.href.split('=')[1];
    if (id) {
      this.querySettingList(id);
      this.setState({id});
    }
    this.fetchRiskList();
    const { dispatch } = this.props;
    dispatch({
      type:'product/fetchCompanyList',
      callback:(res)=>{
        this.setState({companyList: res.data});
      }
    })
  }

  fetchRiskList = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/fetchList',
      payload: { isFundationType: false },
      callback: res => {
        if (res.success) {
          this.setState({
            riskNameList: res.data.list,
            riskList: res.data.list,
          });
        } else {
          message.error(res.message, [10]);
        }
      },
    });
    dispatch({
      type: 'riskmodel/fetchSceneGroup',
      payload: {},
      callback: res => {
        if (res.success) {
          this.setState({
            sceneList: res.data.list,
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

  querySettingList = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/fetchSingleRisk',
      payload: id,
      callback: res => {
        if (res.success) {
          this.setState({
            // dutyList: res.data.dutyList,
            code: res.data.productCode,
            name: res.data.productName,
            id: res.data.id,
            isFundationType: res.data.isFundationType,
            insuranceList: res.data.insuranceList,
            companyCode: res.data.companyCode
          });
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  delGroup = index => {
    const { insuranceList } = this.state;
    insuranceList.splice(index, 1);
    this.setState({ insuranceList });
  };

  addGroup = () => {
    const { insuranceList } = this.state;
    counter += 1;
    insuranceList.push({
      name: '',
      key: `insurance${counter}`,
    });
    this.setState({ insuranceList });
  };

  onSave = () => {
    const { insuranceList } = this.state;
    const { name, code, isFundationType, id, companyCode } = this.state;
    const { dispatch } = this.props;
    if (
      insuranceList.some(
        insurance => insurance.dutyList && insurance.dutyList.every(duty => duty.selected === false)
      )
    ) {
      this.setState({ warning: true });
      return;
    }
    if (!companyCode || !code || !name || !insuranceList.every(risk => !!risk.name)) {
      message.error('请输入所有必填项', [10]);
      return;
    }
    if(insuranceList.length===1&&insuranceList[0].name==='insurance0'){
      message.error('请选择险种', [10]);
      return;
    }
    const payload = { insuranceList, productCode: code, productName: name, isFundationType, id, companyCode };
    dispatch({
      type: 'riskmodel/saveSingleRisk',
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
    history.push('/scenario/singleinsurance');
  };

  onDutySave = (insuranceindex, dutyindex, sceneGroupList, selected) => {
    const { insuranceList } = this.state;
    const insuranceline = insuranceList[insuranceindex];
    insuranceline.dutyList[dutyindex].sceneGroupList = sceneGroupList;
    insuranceline.dutyList[dutyindex].selected = selected;
    insuranceList[insuranceindex] = insuranceline;
    this.setState({ insuranceList, savestatus: true });
  };

  attachInsurance = (index, risk) => {
    const { insuranceList } = this.state;
    insuranceList[index] = { ...insuranceList[index], ...risk };
    this.setState({ insuranceList, savestatus: true });
  };

  ruleEditing = (value, idx, insuranceindex) => {
    const { insuranceList, sceneList } = this.state;
    const insuranceline = insuranceList[insuranceindex];
    const dutyline = insuranceline.dutyList[idx];
    let sceneGroupNames = [];
    if(dutyline.sceneGroupList){
      sceneGroupNames = dutyline.sceneGroupList.map(a => a.sceneGroupCode)
    }else
      dutyline.sceneGroupList = [];
    value.map((item) => {
      if (sceneGroupNames.indexOf(item) < 0) {
        const sceneitem = sceneList.filter((scene)=>scene.sceneGroupCode === item)[0];
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
    insuranceline.dutyList[idx] = dutyline;
    insuranceList[insuranceindex] = insuranceline;
    this.setState({ insuranceList });
  };

  onDelete = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'riskmodel/delSingleRisk',
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

  render() {
    const {
      id,
      isFundationType,
      name,
      code,
      riskList,
      riskNameList,
      insuranceList,
      warning,
      cancelling,
      deleting,
      savestatus,
      companyList,
      companyCode,
      sceneList,
      models
    } = this.state;
    const { history } = this.props;

    const getEvent = () =>
      insuranceList.map((item, index) => (
        <SingleInsurance
          riskList={riskList}
          riskNameList={riskNameList&&riskNameList.filter((risk)=>risk.companyCode===companyCode&&!risk.isGroupOrder).map(risk => `${risk.name}(${risk.code})`)}
          data={item}
          onDutySave={this.onDutySave}
          sceneList={sceneList}
          onDelGroup={insuranceList.length > 1 ? this.delGroup : undefined}
          index={index}
          ruleEditing={this.ruleEditing}
          attachInsurance={this.attachInsurance}
          key={item.key}
          models={models}
          companyCode={companyCode}
        />
      ));

    return (
      <div className={styles.settingboard}>
        <div className={styles.topLine}>
          <Breadcrumb style={{ float: 'left' }}>
            <Breadcrumb.Item
              onClick={() => {
                history.push('/scenario/singleinsurance');
              }}
            >
              保单列表
            </Breadcrumb.Item>
            <Breadcrumb.Item>个单风控模型配置</Breadcrumb.Item>
          </Breadcrumb>
          <Button
            className={styles.subBtn}
            onClick={() => this.setState({ warning: true, cancelling: true })}
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
          <div className={styles.titleLine}>个单概览</div>
          <div className={styles.attrList} style={{ marginBottom: isFundationType ? 25 : 0 }}>
            <div className={styles.attrItem}>
              <div className={styles.label}>保险公司：</div>
              <Select placeholder='选择保险公司' value={companyCode} className={styles.attrInput} dropdownMatchSelectWidth={false} onChange={e => this.setState({ companyCode: e })}>
                {companyList.map((comp)=><Option value={comp.company_code}>{comp.company_name}</Option>)}
              </Select>
            </div>
            <div className={styles.attrItem}>
              <div className={styles.label}>产品名称：</div>
              <Input
                className={styles.attrInput}
                value={name}
                onChange={e => this.setState({ name: e.target.value, savestatus: true })}
              />
            </div>
            <div className={styles.attrItem}>
              <div className={styles.label}>产品代码：</div>
              <Input
                className={styles.attrInput}
                value={code}
                onChange={e => this.setState({ code: e.target.value, savestatus: true })}
              />
            </div>
          </div>
          <div>
            <div className={styles.divider} />
            <div className={styles.titleLine}>个单风控模型配置</div>
            {getEvent()}
            <Button
              icon="plus"
              className={styles.priBtn}
              style={{ margin: '20px 100px 65px 0', width: 110 }}
              onClick={() => this.addGroup()}
            >
              增加险种
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
            wrapClassName="newBatchModal"
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
                  {id ? '继续编辑' : '继续配置'}
                </Button>
                {cancelling ? (
                  <Button
                    style={{
                      width: 100,
                      background: 'white',
                      border: '1px solid #4291EB',
                      color: '#4291EB',
                    }}
                    onClick={() => this.jumpTo()}
                  >
                    取消{id ? '编辑' : '配置'}
                  </Button>
                ) : (
                  ''
                )}
              </div>
            }
          >
            {cancelling
              ? `取消后，所有配置数据将不被保存且无法恢复，继续取消${id ? '编辑' : '配置'}?`
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
            删除后，该个单风控模型配置将完全丢失，确认删除？
          </Modal>
        )}
      </div>
    );
  }
}

export default InsuranceGroupSetting;
