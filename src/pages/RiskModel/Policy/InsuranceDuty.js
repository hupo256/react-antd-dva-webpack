import React, { Component } from 'react';
import { Button, Input, Switch, Modal, Checkbox, Icon } from 'antd';
import styles from '../style.less';
import triangle from '../../../assets/Scenario/triangle.svg';

// import Item from '../Item';
// import { opttranser } from '../modelList.json';

const CheckboxGroup = Checkbox.Group;
const { Search } = Input;

export default class GroupDuty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ruling: false,
      selectall: false,
      optionList: [],
      options: [],
      toggleList:[]
    };
  }

  componentDidMount(){
    this.getOptions(this.props);
  }

  componentWillReceiveProps(props){
    this.getOptions(props);
  }

  getOptions = (props) => {
    const {duty, sceneList} = props;
    if(sceneList){
      const dutylist = duty.sceneGroupList.filter((dt)=>dt.isRecommend === true).map((model)=>model.sceneGroupCode);
      const opts = [];
      sceneList.list
      .filter((model)=>dutylist.indexOf(model.sceneGroupCode)<0)
      .map((model)=>opts.push({label:`${model.sceneGroupCode}-${model.sceneGroupName}`, value: model.sceneGroupCode}));
      const options = duty.sceneGroupList.filter((model)=>model.isActive===true&&model.isRecommend===false).map((model)=>model.sceneGroupCode);
      this.setState({optionList: opts, options});
    }
  }

  getIndex = index => {
    const str = index.toString();
    const mat = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let result = '';
    for (let i = 0; i < str.length; i += 1) {
      result += mat[str[i]];
    }
    return result;
  };

  onRuleChange = value => {
    const { ruleEditing, index } = this.props;
    this.setState({ options: value });
    ruleEditing(value, index);
  };

  searchOpt = value => {
    const { optionList } = this.state;
    this.setState({ optionList: optionList.filter(opt => opt.label.indexOf(value) > -1) });
  };

  render() {
    const {
      duty,
      index,
      isFundationType,
      onModelChange,
      onRuleChange,
      // toggleItem,
      // handleClose,
      ruleEditing,
      goto,
      models
    } = this.props;
    const findChineseName = (name) => {
      const result = models.find((model)=>model.modelName===name);
      return result.name;
    }
    const findDesc = (name) => {
      const result = models.find((model)=>model.modelName===name);
      return result.description;
    }
    let { sceneGroupList } = duty;
    sceneGroupList = sceneGroupList || [];
    const { ruling, selectall, optionList, options, toggleList } = this.state;
    const ollength = options.length;
    const getModels = () => sceneGroupList.filter((model)=>model.isRecommend===true).map((model, idx) => {
        if(typeof toggleList[idx] === 'undefined' )
          toggleList[idx] = false;
        return(
          <div className={styles.riskItem}>
            <div className={`${styles.notrequiredlabel} ${styles.label}`}>
              {model.sceneGroupName}：
            </div>
            <Switch
              checked={model.isActive}
              onChange={e => onModelChange(e, model.sceneGroupCode, index)}
            />
            {model.ruleorModelNames.length>0&&
            <div className={`${styles.notif} ${styles.ruleHandle}`} onClick={()=>{toggleList[idx] = !toggleList[idx];this.setState({toggleList})}}>
              展开{model.ruleorModelNames.length}个规则
            </div>}
            {toggleList[idx] === true &&<div className={styles.triangle} />}
            {toggleList[idx] === true &&
            <div className={styles.ruleBlock}>
              {model.ruleorModelNames.map((rule)=>(
                <div className={styles.ruleLine}>
                  <div className={`${styles.notrequiredlabel} ${styles.label}`}>
                    {findChineseName(rule.modelName)}：
                  </div>
                  <Switch
                    size="small"
                    checked={rule.isActive}
                    onChange={e => onRuleChange(e, rule.modelName, idx, index)}
                  />
                  <Icon style={{color:rule.isActive?'#4291eb':'#989ca3', marginRight:10}} type="info-circle" />
                  <span style={{color:rule.isActive?'#4291eb':'#989ca3', fontSize:12}}>{findDesc(rule.modelName)}</span>
                </div>
              ))}
            </div>}
          </div>
      )});
    const dutytypeopts = ['','门诊费用型', '住院费用型', '津贴', '重疾', '伤残', '身故'];
    const accidentTypeopts = ['','疾病','意外','其他'];
    const allopt = optionList.map((model)=>model.value);
    return (
      <div>
        <div className={styles.divider} />
        <div className={styles.titleLine} style={{ whiteSpace: 'pre-wrap' }}>
          {`责任${this.getIndex(index + 1)}    ${duty.name}   ${duty.code}`}
        </div>
        <div className={styles.darkblock} style={{ marginTop: 20 }}>
          <div className={styles.newinfoslot}>
            责任名称：{duty.name}
          </div>
          <div className={styles.newinfoslot}>
            责任代码：{duty.code}
          </div>
          <div className={styles.newinfoslot}>
            险种责任类型：{duty.dutyTypes.map((item)=>dutytypeopts[item]).join(',')}
          </div>
          <div className={styles.newinfoslot}>
            出险类型：{duty.accidentTypes.map((item)=>accidentTypeopts[item]).join(',')}
          </div>
        </div>
        {!isFundationType && (
          <div className={styles.titleLine} style={{ borderColor: 'white' }}>
            风险场景匹配
          </div>
        )}
        {!isFundationType && sceneGroupList.length > 0 && (
          <div className={styles.riskList}>
            {getModels()}
            {optionList.length>0&&<Button
              icon="plus"
              style={{marginLeft:'20%'}}
              className={styles.plusBtn}
              onClick={() => this.setState({ ruling: true })}
            />}
            {ollength > 0 && (
              <div className={styles.numbernotif}>
                已开启
                {ollength}个非匹配规则
              </div>
              )}
          </div>
        )}
        {!isFundationType && sceneGroupList.length === 0 &&
          <div className={styles.empthinfo}>
            <img src={triangle} alt="" />
            <div>未定义适合该责任的风险场景，请去<span onClick={()=>goto()}>定义场景</span></div>
          </div>
        }
        <br />
        {ruling && (
          <Modal
            title="选择风控场景"
            visible={ruling}
            width={450}
            onCancel={() => this.setState({ ruling: false })}
            footer={
              <Button
                style={{
                  width: 100,
                  background: '#4291EB',
                  border: '1px solid #4291EB',
                  color: 'white',
                }}
                onClick={() => this.setState({ ruling: false })}
              >
                保存
              </Button>
            }
          >
            <div className={styles.riskControl}>
              <div>
                <Search placeholder="搜索场景" onSearch={this.searchOpt} style={{ width: 300 }} />
                <Checkbox
                  className={styles.checkall}
                  onChange={() =>
                    this.setState(
                      { selectall: !selectall, options: selectall ? []: allopt },
                      ruleEditing(selectall ? [] : allopt, index)
                    )
                  }
                  checked={selectall}
                />
                全选
                <div className={styles.optionList}>
                  <CheckboxGroup options={optionList} value={options} onChange={this.onRuleChange} />
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
