import React, { Component } from 'react';
import { Icon, Button, AutoComplete } from 'antd';
import { cloneDeep } from 'lodash';
import styles from '../style.less';
import SingleDuty from './SingleDuty';

export default class GroupInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      name: '',
      dutyList: [],
      insurancekeyword:''
    };
  }

  componentDidMount() {
    const { data } = this.props;
    if (data) {
      const { name, code, dutyList } = data;
      this.setState({ dutyList, name: code ? `${name}(${code})` : '', insurancekeyword:code ? `${name}(${code})` : '' });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { name: statename } = this.state;
    const { companyCode } = this.props;
    const { name, code, dutyList } = nextProps.data;
    if (nextProps.data.name !== statename) {
      this.setState({ dutyList, name: code ? `${name}(${code})` : '',insurancekeyword:code ? `${name}(${code})` : '' });
    }
    if(nextProps.companyCode !== companyCode){
      this.setState({name: '', dutyList: [], insurancekeyword:'' });
    }
  }

  onRuleChange = (value, name, modelid, idx) => {
    const { dutyList } = this.state;
    const dutyline = dutyList[idx];
    const names = dutyline.sceneGroupList[modelid].ruleorModelNames;
    const rid = names.map(a => a.modelName).indexOf(name);
    names[rid].isActive = value;
    dutyline.sceneGroupList[modelid].ruleorModelNames = names;
    dutyList[idx] = dutyline;
    this.setState({ dutyList });
  }

  setDuties = e => {
    const code = e.split('(')[1].split(')')[0];
    const { riskList, attachInsurance, index } = this.props;
    const risk = riskList && riskList.filter(trisk => trisk.code === code)[0];
    const therisk = cloneDeep(risk);
    this.setState({
      dutyList: therisk.dutyList,
    });
    attachInsurance(index, risk);
  };

  editDuty = (dutyindex, modelList, selected = true) => {
    const { onDutySave, index } = this.props;
    onDutySave(index, dutyindex, modelList, selected);
  };

  ruleEditing2 = (value, idx) => {
    const { ruleEditing, index } = this.props;
    ruleEditing(value, idx, index);
  };

  handleInsuranceSearch = (value) => {
    const { riskNameList, companyCode } = this.props;
    const opts = !companyCode?[]:riskNameList;
    const result = opts.filter((comp)=>comp.indexOf(value)> -1);
    this.setState({insuranceopts: result, insurancekeyword: value});
  }

  render() {
    const { isOpen, dutyList, insurancekeyword, insuranceopts } = this.state;
    const { onDelGroup, index, sceneList, models, companyCode } = this.props;
    let { riskNameList } = this.props;
    riskNameList = companyCode? riskNameList:[];
    return (
      <div style={{ overflow: 'hidden' }}>
        <div className={styles.attrList}>
          <div className={styles.attrItem}>
            <div className={styles.label}>险种名称：</div>
            <AutoComplete
              className={styles.attrInput}
              value={insurancekeyword || ''}
              onSelect={e => this.setState({ name: e, insurancekeyword: e }, this.setDuties(e))}
              dataSource={insurancekeyword.length>0?insuranceopts:riskNameList}
              onChange={(e)=>this.handleInsuranceSearch(e)}
            />
          </div>
        </div>
        <div className={styles.foldBtn} onClick={() => this.setState({ isOpen: !isOpen })}>
          {isOpen ? '收起' : '展开'}
          责任
          <Icon style={{ marginLeft: 10 }} type={!isOpen ? 'down' : 'up'} />
        </div>
        <div style={{ overflow: 'hidden', width: '100%' }}>
          {isOpen &&
            dutyList &&
            dutyList.map((item, iindex) => (
              <SingleDuty
                name={item.name}
                code={item.code}
                sceneList={sceneList}
                modelList={item.sceneGroupList}
                selected={item.selected}
                index={iindex}
                onDutySave={this.editDuty}
                key={`${item.sceneGroupCode}${iindex + 1}`}
                ruleEditing={this.ruleEditing2}
                onRuleChange={this.onRuleChange}
                models={models}
              />
            ))}
        </div>
        {onDelGroup && (
          <Button icon="minus" className={`${styles.delBtn}`} onClick={() => onDelGroup(index)}>
            删除险种
          </Button>
        )}
        <div className={styles.divider} />
      </div>
    );
  }
}
