import React, { Component } from 'react';
import { Button, Input, Checkbox, Select } from 'antd';
import styles from '../style.less';

const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

export default class GroupDuty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // id: window.location.href.split('=')[1],
    };
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

  render() {
    const { duty, index, isFundationType, onChange, delDuty } = this.props;
    // const { id } = this.state;
    // const dutyTypeOpt = {
    //   '1': '门诊费用型',
    //   '2': '住院费用型',
    //   '3': '津贴',
    //   '4': '重疾',
    //   '5': '伤残',
    //   '6': '身故',
    // };
    // const accidentTypeOpt = {
    //   '1': '疾病',
    //   '2': '意外',
    //   '3': '其他',
    // };
    const accidentTypeOpt = [{label: '疾病', value: '1'}, {label: '意外', value: '2'}, {label: '其他', value: '3'} ]
    return (
      <div>
        <div className={styles.divider} />
        <div className={styles.titleLine}>
          责任
          {this.getIndex(index + 1)}
        </div>
        <div className={styles.attrList} style={{ marginBottom: 25 }}>
          <div className={styles.attrItem}>
            <div
              className={
                isFundationType ? `${styles.notrequiredlabel} ${styles.label}` : styles.label
              }
            >
              责任名称：
            </div>
            <Input
              className={styles.attrInput}
              value={duty.dutyName}
              placeholder='输入责任名称'
              onChange={e => onChange('dutyName', e.target.value, index)}
            />
          </div>
          <div className={styles.attrItem}>
            <div
              className={
                isFundationType ? `${styles.notrequiredlabel} ${styles.label}` : styles.label
              }
            >
              责任代码：
            </div>
            <Input
              className={styles.attrInput}
              value={duty.dutyCode}
              placeholder='输入代码'
              onChange={e => onChange('dutyCode', e.target.value, index)}
            />
          </div>
          <div className={styles.attrItem}>
            <div
              className={
                isFundationType ? `${styles.notrequiredlabel} ${styles.label}` : styles.label
              }
            >
              出险类型：
            </div>
            <CheckboxGroup
              className={styles.attrInput}
              style={{ marginTop: 4 }}
              value={duty.accidentTypes}
              options={accidentTypeOpt}
              onChange={e => onChange('accidentTypes', e.map((item)=>item.replace(/[\u4e00-\u9fa5]/g, "")), index)}
            />
          </div>
          <div className={styles.attrItem}>
            <div
              className={
                isFundationType ? `${styles.notrequiredlabel} ${styles.label}` : styles.label
              }
            >
              险种责任类型：
            </div>
            <Select
              className={styles.attrInput}
              placeholder="请选择"
              mode="multiple"
              value={duty.dutyTypes}
              onChange={e => onChange('dutyTypes', e, index)}
            >
              <Option value="1">门诊费用型</Option>
              <Option value="2">住院费用型</Option>
              <Option value="3">津贴</Option>
              <Option value="4">重疾</Option>
              <Option value="5">伤残</Option>
              <Option value="6">身故</Option>
            </Select>
          </div>
        </div>
        {delDuty && (
          <Button icon="minus" className={`${styles.delBtn}`} onClick={() => delDuty(index)}>
            删除责任
          </Button>
        )}
      </div>
    );
  }
}
