import React, { Component } from 'react';

import { Button, Switch, Modal, Checkbox, Input, Icon } from 'antd';

import styles from '../style.less';
// import Item from '../Item';
// import notif from '../../../assets/Scenario/info.svg';
import savepic from '../../../assets/Scenario/save.svg';
import editpic from '../../../assets/Scenario/edit.svg';
// import { describeList, chineseList, defaultOptionList } from '../modelList.json';

const CheckboxGroup = Checkbox.Group;
const { Search } = Input;

export default class GroupDuty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modelList: [
      ],
      // optionList: defaultOptionList,
      selected: true,
      editable: false,
      ruling: false,
      selectall: false,
      options: [],
      optionList: [],
    };
  }

  componentDidMount() {
    const { modelList, selected } = this.props;
    this.setState({
      modelList,
      options: modelList.filter((model)=>model.isRecommend===false).map((model)=>model.sceneGroupCode),
      selected,
      toggleList: modelList.map(()=>false)
    });
    this.getOptions(this.props);
  }

  componentWillReceiveProps(props){
    this.getOptions(props);
  }

  getOptions = (props) => {
    const {modelList, sceneList} = props;
    if(sceneList){
      const dutylist = modelList.filter((dt)=>dt.isRecommend === true).map((model)=>model.sceneGroupCode);
      const opts = [];
      sceneList
      .filter((model)=>dutylist.indexOf(model.sceneGroupCode)<0)
      .map((model)=>opts.push({label:`${model.sceneGroupCode}-${model.sceneGroupName}`, value: model.sceneGroupCode}));
      const options = modelList.filter((model)=>model.isActive===true&&model.isRecommend===false).map((model)=>model.sceneGroupCode);
      this.setState({optionList: opts, options});
    }
  }

  onRuleChange = value => {
    const { ruleEditing, index } = this.props;
    this.setState({ options: value });
    ruleEditing(value, index);
  };

  getIndex = index => {
    const str = index.toString();
    const mat = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let result = '';
    for (let i = 0; i < str.length; i += 1) {
      result += mat[str[i]];
    }
    return result;
  };

  toggleSelected = e => {
    const { modelList } = this.state;
    const { onDutySave, index } = this.props;
    this.setState({ selected: e.target.checked, editable: false });
    onDutySave(index, modelList, e.target.checked);
  };

  toggleEditable = () => {
    const { editable, modelList } = this.state;
    const { onDutySave, index } = this.props;
    if (editable) {
      onDutySave(index, modelList);
      this.setState({ editable: false });
    } else {
      this.setState({ editable: true });
    }
  };

  onModelChange = (value, code) => {
    const { modelList } = this.state;
    const modelid = modelList.map(a => a.sceneGroupCode).indexOf(code);
    modelList[modelid].isActive = value;
    this.setState({ modelList});
  };

  render() {
    const {
      editable,
      selected,
      modelList,
      ruling,
      selectall,
      options,
      optionList,
      toggleList
    } = this.state;
    const { name, code, index, ruleEditing, onRuleChange, models } = this.props;
    const allopt = optionList.map((model)=>model.value);
    const ollength = options.length;
    const findChineseName = (tname) => {
      const result = models.find((model)=>model.modelName===tname);
      return result.name;
    };
    const findDesc = (tname) => {
      const result = models.find((model)=>model.modelName===tname);
      return result.description;
    };
    return (
      <div className={styles.dutyboard}>
        <div className={styles.checkboxBlock}>
          <Checkbox onChange={this.toggleSelected} checked={selected} />
        </div>
        <div className={styles.dutyBlock}>
          <div className={styles.dutyTitle} style={{ background: selected ? '' : '#F8F9FB' }}>
            <div>
              责任
              {this.getIndex(index + 1)}：{name}
            </div>
            <div>{code}</div>
            {selected ? (
              <img src={editable ? savepic : editpic} onClick={this.toggleEditable} alt="" />
            ) : (
              ''
            )}
          </div>
          <div className={styles.dutyContent}>
            <div className={styles.riskList}>
              {modelList.filter((model)=>model.isRecommend===true).map((model, idx) => (
                <div className={styles.riskItem}>
                  <div className={`${styles.notrequiredlabel} ${styles.label}`}>
                    {/* {chineseList[model.modelName]}： */}
                    {model.sceneGroupName}
                  </div>
                  {!editable ? (
                    <div className={styles.noteditable}>{model.isActive ? '开启' : '关闭'}</div>
                  ) : (
                    <Switch
                      checked={model.isActive}
                      onChange={e => this.onModelChange(e, model.sceneGroupCode)}
                    />
                  )}
                  {model.ruleorModelNames&&model.ruleorModelNames.length>0&&editable&&
                  <div className={`${styles.notif} ${styles.ruleHandle}`} onClick={()=>{toggleList[idx] = !toggleList[idx];this.setState({toggleList})}}>
                  展开{model.ruleorModelNames&&model.ruleorModelNames.length}个规则
                  </div>}
                  {toggleList[idx] === true &&editable&&<div className={styles.triangle} />}
                  {toggleList[idx] === true &&editable&&
                  <div className={styles.ruleBlock}>
                    {model.ruleorModelNames&&model.ruleorModelNames.map((rule)=>(
                      <div className={styles.ruleLine}>
                        <div className={`${styles.notrequiredlabel} ${styles.label}`}>
                          {findChineseName(rule.modelName)}：
                        </div>
                        {!editable ? (
                          <div className={styles.noteditable}>{rule.isActive ? '开启' : '关闭'}</div>
                        ) : (
                          <Switch
                            checked={rule.isActive}
                            size="small"
                            onChange={e => onRuleChange(e, rule.modelName, idx, index)}
                          />)}
                        <Icon style={{color:rule.isActive?'#4291eb':'#989ca3', marginRight:10}} type="info-circle" />
                        <span style={{color:rule.isActive?'#4291eb':'#989ca3', fontSize:12}}>{findDesc(rule.modelName)}</span>
                      </div>
                    ))}
                  </div>}
                </div>
              ))}
              {ollength > 0 && editable && (
                <Button
                  icon="plus"
                  className={styles.plusBtn}
                  style={{marginLeft:'20%'}}
                  onClick={() => this.setState({ ruling: true })}
                />
              )}
              {ollength > 0 && (
                <div className={styles.numbernotif} style={{ marginLeft: editable ? '' : '25%' }}>
                  已开启
                  {ollength}个{editable ? '' : '非匹配场景'}
                </div>
              )}
            </div>
          </div>
          {ruling && (
            <Modal
              title="选择风控规则"
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
                    <CheckboxGroup options={optionList} value={options} onChange={(e)=>this.onRuleChange(e)} />
                  </div>
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    );
  }
}
