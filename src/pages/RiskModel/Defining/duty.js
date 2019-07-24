import React, { Component } from 'react';
import { Button, InputNumber, Select } from 'antd';
import styles from '../style.less';

const { Option } = Select;

export default class GroupDuty extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    const { duty, index, isFundationType, onChange, delDuty, models, rradioWarning, rnameWarning } = this.props;
    const opts = [];
    (models||[]).forEach((model)=>{
      opts.push(<Option value={model.modelName}>{model.name}</Option>);
    });
    const returnDesc = (modelName) => {
      const result = (models||[]).find((model)=>model.modelName===modelName);
      return result?result.description:'-';
    }
    return (
      <div>
        <div className={styles.attrList} style={{ marginBottom: 25 }}>
          <div className={styles.attrItem}>
            <div
              className={
                isFundationType ? `${styles.notrequiredlabel} ${styles.label}` : styles.label
              }
            >
              规则名称：
            </div>
            <Select
              className={`${styles.attrInput} ${rnameWarning[index]&&styles.warningSelect}`}
              value={duty.modelName}
              placeholder='输入名称'
              dropdownMatchSelectWidth={false}
              onChange={e => {onChange('modelName', e, index); onChange('description', returnDesc(e), index)}}
            >
              {opts}
            </Select>
          </div>
          <div className={styles.attrItem}>
            <div
              className={
                isFundationType ? `${styles.notrequiredlabel} ${styles.label}` : styles.label
              }
            >
              规则权重：
            </div>
            <InputNumber
              className={`${styles.attrInput} ${rradioWarning[index]&&styles.warningItem}`}
              value={duty.radio}
              step={0.01}
              min={0}
              max={1}
              placeholder='输入权重'
              onChange={e => onChange('radio', e, index)}
            />
          </div>
          <div className={styles.attrItem} style={{height:'fit-content'}}>
            <div
              className={
                 `${styles.notrequiredlabel} ${styles.label}`
              }
            >
              规则描述：
            </div>
            <div className={styles.labelcontent} style={{width:'68%', float:'right'}}>{duty.description}</div>
          </div>
        </div>
        {delDuty && (
          <Button icon="minus" className={`${styles.delBtn}`} onClick={() => delDuty(index)}>
            删除规则
          </Button>
        )}
        <div className={styles.divider} style={{margin:'0 40px'}} />
      </div>
    );
  }
}
