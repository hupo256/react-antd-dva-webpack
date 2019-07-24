import React, { Component } from 'react';
import styles from './viewtopdf.less'

export default class InsTable extends Component {
  state = {};

  render() {
    const {conArr, isGroup, groupTit, insInd} = this.props;
    return (
      <>
        {conArr.map((ins) => (
          <div className={isGroup ? styles.insbox : ''} key={ins.insurance_name}>
            {isGroup && 
              <p className={styles.titips}>{groupTit.levelList[insInd]}</p>
            }
            <h4 className={styles.instit}>
              <span>{`险种名称：${ins.insurance_name}`}</span>
              <span>{`险种类型：${ins.insurance_model}`}</span>
              {isGroup && `险种保额：${ins.amount_of_insurance || '-'}`}
            </h4>
            
            {ins.list.map((duty, index) => (
              <div key={duty.duty_name}>
                <h4 className={styles.dutytit}>
                  <span>{`责任${index+1}:${duty.duty_name}`}</span>
                  <span>{` ${duty.duty_code}`}</span>
                </h4>

                <ul className={styles.dutybox}>
                  {duty.duty_list.map(item => {
                    const ikey = item[2];
                    const w100 = ikey === 'deductible_type' ||    // 免赔类型
                                  ikey === 'limit_type' ||        // 限额类型
                                  ikey === 'pay_ratio_type' ||    // 赔付比例类型
                                  ikey === 'bill_type' ||         // 发票类型
                                  ikey === 'day_allowance' ||     // 发票类型
                                  ikey === 'pay_ratio_level10' || // 10级
                                  ikey === 'special_aggreement' || // 特别约定
                                  ikey.indexOf('_type_expense') > 0; // 免赔类型
                    return(
                      <li key={item[2]} className={w100 ? styles.w100 : null}>
                        <span>{item[0]}</span>
                        <span>
                          {item[1] && !item[1].list && item[1].toString()}
                          {item[1] && item[1].list && item[1].list.length > 0 && item[1].list.map((d, i) => (
                            <u key={i}>
                              <span>{d.vName}</span>
                              <span>
                                {d.tArr.map((t, ind) => (
                                  <span key={ind}>
                                    <span>{t[0]}</span>
                                    <span>{t[1]}</span>
                                  </span>
                                ))}
                              </span>
                            </u>
                          ))}
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </>
    );
  }
}


