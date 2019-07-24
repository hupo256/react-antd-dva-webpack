/* eslint-disable react/no-did-mount-set-state,no-unused-expressions, consistent-return,operator-assignment,no-nested-ternary,no-param-reassign,array-callback-return,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {Button,Row,Col,Form,Breadcrumb,Select,Input,DatePicker,Icon,message,AutoComplete,Checkbox,Card,Tooltip,Modal,Radio} from 'antd';
import _ from 'lodash';
import moment from 'moment';
import { parse } from 'qs';
import locale from 'antd/lib/date-picker/locale/zh_CN';
import styles from '../../product.less';
import gInitial from '../../images/g-initial.svg';
import GradeModal from '../../Components/GradeModal/GradeModal';
import checkCircle from '../../images/check-circle.svg';
import pendingCircle from '../../images/pending.svg';
import save from '../../images/save.svg';
import edit from '../../images/edit.svg';
import DutyDetailSetting from './DutyDetailSetting/DutyDetailSetting';
import CreateMultiples from '../../Single/Preview/CreateMultiples';
import HsptMultiples from '../../Single/Preview/HsptMultiples';
import {CreactDutyList, refactoringDutyList, refactoringFn,setDutyTitle, filterValues, selectToNumber, onLinkClick} from '../../Components/DutyItemSetting/CreactDutyList';

const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;

const insuranceModel = {
  expense: '费用型',
  allowance: '津贴型',
  quota: '定额型',
};
const PREFIX = '_DUTY';

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class EditGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      isSaved: true,
      insuranceAllNames: [],
      insuranceListByCompany: [],
      groupLevelItem: {},
      groupLevelItemIndex: 0,
      groupLevels: [],
      groupItemInfo: {},
      currentTabIndex: 0,
      groupLevelList: [],
      cacheList: [],
      isShowDeleteModal: false,
      isShowDetailSetting: false,
      isShowTipsModal: false,
      isAddTips: true,
      isActiveSaveBtn: true,
      isAllRequired: false,
      dutyDetailSetting: {
        company_code: '',
        groupIndex: 0,
        insIndex: 0,
        sdlIndex: 0,
        dutyTitle: '',
      },
      showMultiples: false,
      renewInd: false,
      insTypeCode: false,
    };
  }

  componentDidMount() {
    const { path } = this.props.match;
    const { location } = this.props;
    const lcsKey = location.state ? location.state.group_id : 'leapIns';
    const lcsObj = localStorage.getItem(lcsKey) ? JSON.parse(localStorage.getItem(lcsKey)) : null;
    // const isrenewID = parse(window.location.href.split('?')[1]).group_id;
    // if(lcsObj && !isrenewID ){
    if(lcsObj){
      this.setState({
        ...lcsObj
      });
      return;
    }

    if (path.split('/').includes('add')) {
      this.setState({
        isAdd: true,
      });
    } else {
      let { state } = location;
      if( !state ) {
        state = parse(window.location.href.split('?')[1]);
        this.setState({
          renewInd: true,
        });
      }
      const { group_id, company_code } = state;
      this.getGroupItemInfo(group_id, company_code);
      this.getAllInsurance(company_code);
      this.setState({
        isAdd: false,
      });
    }
  }

  // 团单信息
  getGroupItemInfo = (group_id, company_code) => {
    const { dispatch } = this.props;
    const { cacheList } = this.state;

    dispatch({
      type: 'product/getGroupProductItem',
      payload: { group_id },
      callback: res => {
        if (res.status === 1) {
          const { data } = res;
          if(this.state.renewInd) data.policy_id = '';
          this.setState({
            groupItemInfo: data,
          });

          const tempGroupLevels = data.group_levels;
          const groupLevels = [];
          let groupCount = 0;
          tempGroupLevels.forEach((groupItem, groupIndex) => {
            const insuranceTypes = groupItem.insurance_types;
            let count = 0;

            const tempInsuranceTypes = [];
            insuranceTypes.forEach((insItem, insIndex) => {
              const { duty_list: currentDutyList, template_id } = insItem;
              dispatch({
                type: 'product/queryInsuranceItem',
                payload: {
                  templateid: template_id,
                },
                callback: resData => {
                  if (resData.status === 1) {
                    const { duty_list: insDutyList } = resData.data;
                    const newInsDutyList = insDutyList.map((insDutyItem, sdlIndex) => {
                      return (
                        currentDutyList.find(curDutyItem => {
                          if (!cacheList[groupIndex]) {
                            cacheList[groupIndex] = [];
                          }
                          if (!cacheList[groupIndex][insIndex]) {
                            cacheList[groupIndex][insIndex] = [];
                          }
                          if (curDutyItem.duty_code === insDutyItem.duty_code) {
                            cacheList[groupIndex][insIndex][sdlIndex] = true;
                            this.setState({
                              cacheList,
                              [`checked${groupIndex}${insIndex}${sdlIndex}`]: true,
                              [`insDutyChecked${groupIndex}${insIndex}${sdlIndex}`]: true,
                              [`detailSetting${groupIndex}${insIndex}${sdlIndex}`]: true,
                            });
                          } else {
                            cacheList[groupIndex][insIndex][sdlIndex] = false;
                            this.setState({
                              cacheList,
                              [`checked${groupIndex}${insIndex}${sdlIndex}`]: false,
                              [`insDutyChecked${groupIndex}${insIndex}${sdlIndex}`]: false,
                              [`detailSetting${groupIndex}${insIndex}${sdlIndex}`]: false,
                            });
                          }
                          return curDutyItem.duty_code === insDutyItem.duty_code;
                        }) || insDutyItem
                      );
                    });
                    const sdlList = [];
                    dispatch({
                      type: 'product/queryDutyConfigFields',
                      payload: {
                        company_code,
                        item_subcategory: insItem.insurance_model,
                        item_category: 'duty',
                      },
                      callback: resDutyItem => {
                        if (resDutyItem.status === 1) {
                          newInsDutyList.forEach(itemDuty => {
                            const bb = refactoringDutyList(itemDuty, resDutyItem.data);
                            const cc = bb.filter(value => {
                              return (
                                value.labelName !== '责任名称' && value.labelName !== '责任代码'
                              );
                            });
                            const dd = bb.filter(value => {
                              return (
                                value.labelName === '责任名称' || value.labelName === '责任代码'
                              );
                            });

                            sdlList.push({
                              title: dd,
                              list: cc,
                              id: Date.now(),
                            });
                          });
                          insItem.duty_list = _.cloneDeep(newInsDutyList);
                          insItem.dutyList = sdlList;

                          count = count + 1;
                          tempInsuranceTypes.push(insItem);

                          if (count === insuranceTypes.length) {
                            groupCount = groupCount + 1;
                            groupLevels.push(groupItem);
                          }

                          if (groupCount === tempGroupLevels.length) {
                            this.setState({
                              groupLevels,
                            }, () => {
                              localStorage.setItem('companyCode', company_code);
                              localStorage.setItem('insDataInCompany', JSON.stringify(this.state));
                            });
                          }
                        } else {
                          message.error(res.message);
                        }
                      },
                    });
                  } else {
                    message.error(resData.message);
                  }
                },
              });
            });
          });
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 所有险种信息
  getAllInsurance = company_code => {
    const { dispatch } = this.props;

    dispatch({
      type: 'product/queryInsuranceList',
      payload: {
        company_code,
        insurance_scope: 'group',
      },
      callback: res => {
        if (res.status === 1) {
          if (res.data.length > 0) {
            const insuranceNameList = [];
            res.data.forEach((item, index) => {
              insuranceNameList.push(`${index}_${item.insurance_type_code}_${item.insurance_type_name}`);
            });

            this.setState({
              insuranceListByCompany: res.data ? res.data : [],
              insuranceAllNames: insuranceNameList,
            });
          }
        } else {
          message.error(res.message);
        }
      },
    });
  };

  removeTheAtt = (obj, nameArr) => {
    const { form: { resetFields }} = this.props;
    resetFields();
    nameArr.forEach(name => {obj[name] = ''});
    this.setState({ obj })
  }

  // 公司险种信息
  queryInsuranceByCompanyCode = code => {
    const nameArr = ['organization_name', 'policy_id', 'limit_amount', 'special_agreement'];
    const { company_code, isActiveSaveBtn, groupItemInfo }  = this.state;
    const { form: { getFieldsValue }} = this.props;
    const comCode = localStorage.getItem('companyCode');
    const values = getFieldsValue();
    const { organization_name, policy_id, limit_amount, special_agreement } = values;
    const valArr = [organization_name, policy_id, limit_amount, special_agreement];
    if(comCode !== code ) this.removeTheAtt(groupItemInfo, nameArr);
    if(isActiveSaveBtn){  // 有数据，则将之前的清空
      console.log(12);
      nameArr.forEach((name, index) => { groupItemInfo[name] = valArr[index] });
      localStorage.setItem('insDataInCompany', JSON.stringify(this.state));
      localStorage.setItem('companyCode', company_code);
      this.removeTheAtt(groupItemInfo, nameArr);
      this.setState({
        groupLevels: [],
        isActiveSaveBtn: false,
      });
    } else { // 没有数据，则需要区别对待
      console.log(comCode, code);
      if(comCode === code){
        console.log(11);
        const insData = JSON.parse(localStorage.getItem('insDataInCompany'));
        this.setState({ ...insData });
      }else{
        // console.log(22)
        this.setState({
          groupLevels: [],
        });
      }
    }

    this.getAllInsurance(code);
    this.setState({
      company_code: code,
    });
  };

  // 选择险种
  queryActiveInsuranceItem = (insuranceItemName, groupIndex, insIndex) => {
    const { groupLevels } = this.state;
    let insCode = true;
    const itemCode = insuranceItemName.split('_')[1];
    groupLevels[groupIndex].insurance_types.forEach(ins => {
      const { insurance_type_code } = ins;
      if (itemCode === insurance_type_code) insCode = false;
    });

    if (!insCode) {
      this.setState({insTypeCode: !insCode});
      return false;
    } 
    if (insCode){
      this.setState({insTypeCode: !insCode});
    }
   
    const { insuranceListByCompany } = this.state;
    const activeInsurance = insuranceListByCompany.filter(item => {
      return item.insurance_type_code === itemCode;
    });
    const theIns = _.cloneDeep(activeInsurance[0]);
    this.getDutyFields(theIns, groupIndex, insIndex);

    this.setState({
      isActiveSaveBtn: true,
    });
  };

  // 险种保额
  saveAmountOfInsurance = (value, groupIndex, insIndex) => {
    const { groupLevels } = this.state;
    const insTypes = Object.assign({}, groupLevels[groupIndex].insurance_types[insIndex], {
      amount_of_insurance: value,
    });
    groupLevels[groupIndex].insurance_types[insIndex] = insTypes;
    this.setState({
      groupLevels,
      isActiveSaveBtn: true,
    });
  };

  // 重组duty_list
  getDutyFields = (activeItem, groupIndex, insIndex) => {
    const { dispatch, location } = this.props;
    const { company_code } = location.state || this.state;
    const { groupLevels } = this.state;

    dispatch({
      type: 'product/queryDutyConfigFields',
      payload: {
        company_code,
        item_subcategory: activeItem ? activeItem.insurance_model : '',
        item_category: 'duty',
      },
      callback: res => {
        if (res.status === 1) {
          const sdlList = [];
          activeItem.duty_list.forEach(item => {
            const bb = refactoringDutyList(item, res.data);
            const cc = bb.filter(value => {
              return value.labelName !== '责任名称' && value.labelName !== '责任代码';
            });
            const dd = bb.filter(value => {
              return value.labelName === '责任名称' || value.labelName === '责任代码';
            });
            sdlList.push({
              title: dd,
              list: cc,
              id: Date.now(),
            });
          });

          console.log(activeItem);
          groupLevels[groupIndex].insurance_types[insIndex] = activeItem;
          groupLevels[groupIndex].insurance_types[insIndex].dutyList = sdlList;

          this.setState({
            groupLevels,
          });
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 增加险种
  addInsuranceItem = groupIndex => {
    const { groupLevels } = this.state;

    groupLevels[groupIndex].insurance_types.push({});

    this.setState({
      isAdd: true,
      groupLevels,
      isActiveSaveBtn: true,
    });
  };

  // 删除险种
  deleteInsuranceItem = (groupIndex, insIndex) => {
    const { groupLevels, cacheList } = this.state;

    groupLevels[groupIndex].insurance_types.splice(insIndex, 1);

    if (cacheList.length > 0) {
      cacheList[groupIndex].splice(insIndex, 1);
    }

    if (insIndex === 0 && groupLevels[groupIndex].insurance_types[insIndex].insurance_type_name) {
      this.props.form.setFieldsValue({
        [`insuranceName${groupIndex}${insIndex}`]: groupLevels[groupIndex].insurance_types[insIndex]
          .insurance_type_name,
      });
    } else {
      this.props.form.setFieldsValue({
        [`insuranceName${groupIndex}${insIndex}`]: '',
      });
    }

    this.setState({
      groupLevels,
      cacheList,
      isActiveSaveBtn: true,
    });
  };

  // 选择险种下的责任
  dutyItemForSelect = (e, groupIndex, insIndex, sdlIndex) => {
    const { cacheList } = this.state;
    if (!cacheList[groupIndex]) {
      cacheList[groupIndex] = [];
    }
    if (!cacheList[groupIndex][insIndex]) {
      cacheList[groupIndex][insIndex] = [];
    }
    e.target.checked
      ? (cacheList[groupIndex][insIndex][sdlIndex] = true)
      : (cacheList[groupIndex][insIndex][sdlIndex] = false);

    this.setState({
      cacheList,
      [`insDutyChecked${groupIndex}${insIndex}${sdlIndex}`]: e.target.checked,
      [`checked${groupIndex}${insIndex}${sdlIndex}`]: e.target.checked,
      isActiveSaveBtn: true,
    });
  };

  // 编辑责任
  editDutyItem = (groupIndex, insIndex, sdlIndex) => {
    const { dispatch } = this.props;
    const { groupLevels } = this.state;
    const dutyList = groupLevels[groupIndex].insurance_types[insIndex].duty_list[sdlIndex];

    const originalDutyList = _.cloneDeep(dutyList);

    dispatch({
      type: 'product/queryDutyConfigFields',
      payload: {
        company_code: dutyList.company_code,
        item_subcategory: groupLevels[groupIndex].insurance_types[insIndex].insurance_model,
        item_category: 'duty',
      },
      callback: res => {
        const dutyFields = res.data;
        selectToNumber(dutyFields)

        const newDutyList = dutyFields.map(dutyFieldsItem => {
          Object.keys(dutyList).filter(dutyItem => {
            if (dutyFieldsItem.item_key === dutyItem) {
              switch (dutyFieldsItem.item_model) {
                case 'input':
                  dutyFieldsItem.item_value.push(dutyList[dutyItem]);
                  break;
                case 'selectMultiple':
                case 'select':
                case 'checkbox':
                case 'radio':
                  dutyFieldsItem.item_value = dutyList[dutyItem];
                  if(dutyItem === 'duty_scope' && dutyList[dutyItem] === -1){
                    dutyFieldsItem.item_value = null;
                  }
                  break;
                default:
                  console.log('error');
              }
            }
          });
          return dutyFieldsItem;
        });

        const ssDutyList = newDutyList.filter(newDutyItem => {
          return newDutyItem.item_key !== 'duty_name' && newDutyItem.item_key !== 'duty_code';
        });

        // 保存责任名称和代码
        const dutyObj = [];
        newDutyList.forEach(item => {
          if (item.item_key === 'duty_name' || item.item_key === 'duty_code') {
            dutyObj[`${item.item_key}`] = item.item_value[0];
          }
        });
        groupLevels[groupIndex].insurance_types[insIndex].duty_list[sdlIndex] = ssDutyList;
        this.setState({
          groupLevels,
          dutyObj,
          originalDutyList,
        });
      },
    });
  };

  // 保存责任
  saveEditDuty = (e, groupIndex, insIndex, sdlIndex) => {
    e.preventDefault();
    const { groupLevels, dutyObj, originalDutyList } = this.state;
    this.props.form.validateFields((err, values) => {
      if (err) return;
      Object.keys(values).forEach(item => {
        if(values[item]) return false;
        if(item.indexOf('duty_scope') > -1 && item.indexOf('icd10') < 0) {
          values[item] = -1;
        }
      });

      const dutyTemp = {};
      Object.keys(values).forEach(item => {
        if (item.indexOf(PREFIX) !== -1) {
          dutyTemp[item] = values[item];
        }
      });
      const realDuty = {};
      Object.keys(dutyTemp).forEach(item => {
        const bb = item.split(PREFIX)[0];
        realDuty[bb] = dutyTemp[item];
      });
      realDuty.duty_code = dutyObj.duty_code;
      realDuty.duty_name = dutyObj.duty_name;

      groupLevels[groupIndex].insurance_types[insIndex].duty_list[sdlIndex] = {
        ...originalDutyList,
        ...realDuty,
      };

      this.getDutyFields(groupLevels[groupIndex].insurance_types[insIndex], groupIndex, insIndex);
      this.setState({
        isSaved: true,
        [`dutyEdit${groupIndex}${insIndex}${sdlIndex}`]: false,
      });
    });
  };

  setLsItem = (id) => {
    const tempValue = this.props.form.getFieldsValue();
    this.dealWithValue(tempValue);
    localStorage.setItem(id, JSON.stringify(this.state));
    localStorage.setItem('leapInsId', id);
    localStorage.setItem('productEditing', 0);
    message.success('暂存成功');
    this.props.history.push('/product/group');
  }

  goBackChange = (id) => {
    Modal.confirm({
      title: '提示',
      content: '已有其他案件的暂存记录，此操作将冲掉已有的暂存记录，是否继续？',
      okText: '继续暂存',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        console.log('OK');
        this.setLsItem(id);
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  // 保存险种
  saveEditGroup = (e, isHold) => {
    e.preventDefault();
    const { dispatch, location } = this.props;
    const { insuranceAllNames, cacheList } = this.state;
    const lcsKey = location.state ? location.state.group_id : 'leapIns';
    const lastId = localStorage.getItem('leapInsId');

    if(isHold){
      if(lastId && lcsKey !== 'leapIns' && lcsKey !== lastId){  // 试图保存多条记录
        this.goBackChange(lcsKey);
        return;
      }

      this.setLsItem(lcsKey);
      return;
    }

    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      if (!(insuranceAllNames.length > 0)) {
        message.error('请先创建团单险种模板');
        return;
      }
      if (!this.state.isSaved) {
        message.error('请先保存相关责任信息');
        return;
      }

      if (cacheList.length < 1) {
        message.error('请至少选择一个责任！');
        return;
      }

      const paramsGroup = this.dealWithValue(values);
      dispatch({
        type: 'product/saveGroupProductItem',
        payload: paramsGroup,
        callback: res => {
          if (res.status === 1) {
            message.success('保存成功', 2).then(() => {
              localStorage.setItem(lcsKey, '');
              localStorage.setItem('productEditing', 0);
              if(lastId && lastId === lcsKey) localStorage.setItem('leapInsId', '');
              return this.props.history.push('/product/group');
            });
          } else {
            message.error(res.message);
          }
        },
      });
    });
  };

  dealWithValue = (values) => {
    const { location } = this.props;
    const { groupLevels, cacheList, groupItemInfo } = this.state;
    console.log(values);

    // 记录头部信息
    const {company_code, organization_name, policy_id, policy_validate,limit_amount,special_agreement, renew_ind} = values;
    const [policy_validate_from, policy_validate_to] = policy_validate;
    Object.assign(groupItemInfo, {company_code, organization_name, policy_id,policy_validate_from,policy_validate_to,limit_amount,special_agreement});

    let group_id = '';
    if (location.state) group_id = location.state.group_id;
    let newGroup = _.cloneDeep(groupLevels);

    cacheList.forEach((c1, i1) => {
      if (c1) {
        const oriInsuranceTypes = newGroup[i1].insurance_types;
        newGroup[i1].insurance_types = [];
        c1.forEach((c2, i2) => {
          if (c2) {
            newGroup[i1].insurance_types[i2] = oriInsuranceTypes[i2];
            const oriDutyList = newGroup[i1].insurance_types[i2].duty_list;
            newGroup[i1].insurance_types[i2].duty_list = [];
            if(c2 instanceof Array){
              c2.forEach((c3, i3) => {
                if (c3) {
                  newGroup[i1].insurance_types[i2].duty_list[i3] = oriDutyList[i3];
                }
              });
            }
            newGroup[i1].insurance_types[i2].duty_list = _.compact(
              newGroup[i1].insurance_types[i2].duty_list
            );
          }
        });
        newGroup[i1].insurance_types = _.compact(newGroup[i1].insurance_types);
      }
    });
    newGroup = _.compact(newGroup);

    const nGroup = [];
    newGroup.forEach(item => {
      item.insurance_types.forEach(ins => {
        delete ins.dutyList;
        delete ins.create_at;
        delete ins.last_modified_date;
      });
      nGroup.push(item);
    });

    const isHasDutyList = nGroup.some(ngItem => {
      return ngItem.insurance_types.some(item => {
        return item.duty_list.length > 0;
      });
    });

    if (cacheList.length < 0 || !isHasDutyList) {
      message.error('请至少选择一个责任！');
      return;
    }

    // 去空
    nGroup.forEach(gItem => {
      const dutyDatd = {};
      Object.keys(gItem).forEach(key => {
        if(gItem[key] && gItem[key] !== 0) {
          if ((gItem[key] instanceof Array) && gItem[key].length === 0) return false;
          dutyDatd[key] = gItem[key];
        }
      })
      gItem = dutyDatd;
      filterValues(gItem.insurance_types);
    })

    const paraArr = [];
    nGroup.forEach(gItem => {
      const dutyDatd = {};
      Object.keys(gItem).forEach(key => {
        if(gItem[key] && gItem[key] !== 0) {
          dutyDatd[key] = gItem[key];
        }
      })
      paraArr.push(dutyDatd);
    });

    const paramsGroup = {
      company_code,
      organization_name,
      policy_id,
      renew_ind,
      policy_validate_from: moment(values.policy_validate[0]).valueOf(),
      policy_validate_to: moment(values.policy_validate[1]).valueOf(),
      group_levels: paraArr,
    };
    if (group_id) {
      Object.assign(paramsGroup, { group_id });
    }
    if (values.limit_amount && values.limit_amount !== 0) {
      Object.assign(paramsGroup, { limit_amount:  values.limit_amount });
    }
    if (special_agreement) {
      Object.assign(paramsGroup, { special_agreement });
    }

    console.log(paramsGroup)
    return paramsGroup;
  }

  // 取消创建
  cancelEditGroup = () => {
    const {match: { path },} = this.props;

    if (path.split('/').includes('add')) {
      this.setState({ isAddTips: true });
    } else {
      this.setState({ isAddTips: false });
    }

    this.setState({
      isShowTipsModal: true,
    });
  };

  // 取消创建提示
  handleOkButton = () => {
    this.setState({
      isShowTipsModal: false,
    });
  };

  handleCancelButton = () => {
    this.setState({
      isShowTipsModal: false,
    });
    this.props.history.push('/product/group');
  };

  // 创建层级
  addGrade = () => {
    const { groupLevels } = this.state;
    this.setState({
      isShowGradeModal: true,
      isAddGrade: true,
      groupLevelItem: {},
      groupLevelItemIndex: groupLevels.length,
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  // 编辑层级
  editGrade = index => {
    const { groupLevels } = this.state;

    this.setState({
      isShowGradeModal: true,
      isAddGrade: false,
      groupLevelItem: groupLevels[index],
      groupLevelItemIndex: index,
    });
  };

  // 删除层级
  handleDeleteGrade = groupLevelItemIndex => {
    const { groupLevels } = this.state;

    const form = this.formRef.props.form;

    if (groupLevels[groupLevelItemIndex].insurance_types.length > 0) {
      this.setState({
        isShowDeleteModal: true,
        deleteGroupIndex: groupLevelItemIndex,
      });
    } else {
      groupLevels.splice(groupLevelItemIndex, 1);
      this.setState({
        isShowGradeModal: false,
        groupLevels,
      });
    }
    form.resetFields();
  };

  handleCancelGroup = () => {
    this.setState({
      isShowDeleteModal: false,
    });
  };

  handleOkGroup = () => {
    const { groupLevels, deleteGroupIndex, cacheList } = this.state;
    groupLevels.splice(deleteGroupIndex, 1);
    cacheList.splice(deleteGroupIndex, 1);
    this.setState({
      isShowGradeModal: false,
      isShowDeleteModal: false,
      isActiveSaveBtn: true,
      cacheList,
      groupLevels,
    });
  };

  // 保存层级
  handleSaveGrade = () => {
    const { groupLevels } = this.state;

    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const groupLevelItem = {
        ...values,
        insurance_types: [{}],
      };

      groupLevels.push(groupLevelItem);
      // console.log(groupLevels);
      form.resetFields();
      this.setState({
        isShowGradeModal: false,
        currentTabIndex: groupLevels.length - 1,
        groupLevels,
      });
    });
  };

  // 编辑层级保存
  handleEditGrade = groupLevelItemIndex => {
    const { groupLevels } = this.state;
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      groupLevels[groupLevelItemIndex] = {
        ...groupLevels[groupLevelItemIndex],
        ...values,
      };

      form.resetFields();
      this.setState({
        isShowGradeModal: false,
        groupLevels,
      });
    });
  };

  // 取消创建层级
  handleCancelGradeModal = () => {
    this.setState({
      isShowGradeModal: false,
    });
  };

  // 层级选择
  tabBarIndexClass = index => {
    const { currentTabIndex } = this.state;
    return index === currentTabIndex ? 'tab-bar-item tab-bar-item-active' : 'tab-bar-item';
  };

  // 显示层级下的险种信息
  tabContentClass = index => {
    const { currentTabIndex } = this.state;
    return index === currentTabIndex
      ? 'tab-content-item tab-content-item-active'
      : 'tab-content-item';
  };

  // 详细配置
  openDutyDetailSetting = (groupIndex, insIndex, sdlIndex) => {
    console.log(groupIndex, insIndex, sdlIndex);
    const { dispatch } = this.props;
    const { dutyDetailSetting, groupLevels, isAdd } = this.state;
    const activeInsuranceItem = groupLevels[groupIndex].insurance_types[insIndex];
    const dutyTitle = activeInsuranceItem.duty_list[sdlIndex].duty_name;
    const company_code = activeInsuranceItem.company_code;
    const insurance_model = activeInsuranceItem.insurance_model;
    const dutyListData = groupLevels[groupIndex].insurance_types[insIndex].duty_list[sdlIndex];

    dispatch({
      type: 'product/queryDutyConfigFields',
      payload: {
        company_code,
        item_subcategory: insurance_model,
        item_category: 'group',
      },
      callback: res => {
        if (res.status === 1) {
          const dutyFieldsList = res.data;
          selectToNumber(dutyFieldsList);
          // console.log(dutyFieldsList);

          dutyFieldsList.forEach(item => {
            if (item.item_model === 'label') {
              if (isAdd) {
                if (!item.selectOptions) {
                  item.selectOptions = [];
                }
                const temps = [];
                temps.push(item.link_item);
                item.selectOptions.push({
                  selectList: temps,
                });
              } else {
                item.selectOptions = [];
              }
            } else {
              item.selectOptions = [];
            }
          });

          const dutyList = dutyFieldsList.map(dutyFieldsItem => {
            Object.keys(dutyListData).filter(dutyItem => {
              if (isAdd) {
                const tempItemValue = [];
                const selectArray = [];
                const tempItemKey = [];

                dutyFieldsItem.select_value_items.forEach(selectItems => {
                  if (selectItems.selected && selectItems.link_item) {
                    tempItemValue.push(selectItems.select_code);
                    selectArray.push({
                      selectList: [selectItems.link_item],
                    });
                    tempItemKey.push({ [dutyFieldsItem.item_key]: selectItems.select_code });
                  }
                });

                // dutyFieldsItem.item_value = tempItemValue;
                // dutyFieldsItem.selectOptions = selectArray;

                if (!dutyListData[dutyFieldsItem.item_key]) {
                  dutyListData[dutyFieldsItem.item_key] = [];
                  dutyListData[dutyFieldsItem.item_key] = tempItemKey;
                } else {
                  dutyListData[dutyFieldsItem.item_key] = tempItemKey;
                }
              } else if (dutyFieldsItem.item_key === dutyItem) {
                switch (dutyFieldsItem.item_model) {
                  case 'input':
                  case 'textArea':
                    dutyFieldsItem.item_value.push(dutyListData[dutyItem]);
                    break;
                  case 'select':
                    if (!dutyFieldsItem.select_value_items.every(item => item.link_item)) {
                      dutyFieldsItem.item_value.push(dutyListData[dutyItem]);
                    } else {
                      const tempArray = [];
                      // console.log(dutyItem, dutyListData[dutyItem])
                      // return;
                      // dutyListData[dutyItem].forEach(item => {
                        const item = dutyListData[dutyItem];
                        tempArray.push(item[dutyItem]);
                        const temp = [];
                        const valueList = [];
                        dutyFieldsItem.select_value_items.forEach(valueItem => {
                          if (item[dutyItem] === valueItem.select_code) {
                            const linkItems = item[valueItem.link_item.item_key];
                            if (Array.isArray(linkItems)) {
                              if (
                                valueItem.link_item &&
                                valueItem.link_item.item_model === 'selectMultiple'
                              ) {
                                valueItem.link_item.selectItemLast = [];
                                linkItems.forEach(linkItem => {
                                  valueItem.link_item.select_value_items.forEach(valueKey => {
                                    if (
                                      valueKey.select_code ===
                                      linkItem[valueItem.link_item.item_key]
                                    ) {
                                      valueItem.link_item.selectItemLast.push({
                                        linkItem: {
                                          ...valueKey.link_item,
                                          item_value: linkItem[valueKey.link_item.item_key],
                                        },
                                        checkedValue: valueKey.select_code,
                                      });
                                    }
                                  });
                                });
                                const tempItemValue = linkItems.map(linkItem => {
                                  return linkItem[valueItem.link_item.item_key];
                                });

                                const copyValueItem = _.cloneDeep(valueItem.link_item);
                                const tempItem = {
                                  ...copyValueItem,
                                  item_value: tempItemValue,
                                };
                                temp.push(tempItem);
                              } else {
                                linkItems.forEach(linkItem => {
                                  const copyValueItem = _.cloneDeep(valueItem.link_item);
                                  const tempLinkItem = {
                                    ...copyValueItem,
                                    item_value: linkItem[valueItem.link_item.item_key],
                                  };

                                  if (tempLinkItem.link_item) {
                                    tempLinkItem.link_item.item_value = [
                                      linkItem[tempLinkItem.link_item.item_key],
                                    ];
                                  }
                                  temp.push(tempLinkItem);
                                  valueList.push(linkItem[valueItem.link_item.item_key]);
                                });
                              }
                            } else {
                              const tempLinkItem = {
                                ...valueItem.link_item,
                                item_value: linkItems || valueItem.select_code,
                              };
                              temp.push(tempLinkItem);
                            }
                          }
                        });
                        dutyFieldsItem.selectOptions.push({
                          selectList: temp,
                          selectValueList: valueList,
                          checkedValue: item[dutyItem],
                        });
                      // });

                      dutyFieldsItem.item_value = tempArray;
                    }
                    break;
                  case 'label':
                    const tempArrays = [];

                    dutyListData[dutyItem].forEach(item => {
                      tempArrays.push(item[dutyItem]);
                      const itemDutyItem = item[dutyItem];
                      const temps = [];
                      itemDutyItem.forEach(aaItem => {
                        const tempLinkItem = {
                          linkItem: {
                            ...dutyFieldsItem.link_item,
                            item_value: aaItem[dutyFieldsItem.link_item.item_key],
                          },
                          checkedValue: '',
                        };
                        if (tempLinkItem.link_item) {
                          tempLinkItem.link_item.item_value = [
                            aaItem[tempLinkItem.link_item.item_key],
                          ];
                        }
                        temps.push(tempLinkItem);
                      });

                      dutyFieldsItem.selectOptions.push({
                        selectList: temps,
                      });
                    });

                    dutyFieldsItem.item_value = tempArrays;
                    break;
                  case 'selectMultiple':
                    const tempArray = [];
                    if (dutyItem !== 'bill_type' && dutyListData[dutyItem].every(item => typeof item === 'string')) {
                      dutyFieldsItem.item_value = dutyListData[dutyItem];
                    } else if(dutyItem === 'cost_scope' || dutyItem === 'bill_type' ) {
                      const valArr = Array.isArray(dutyListData[dutyItem]) ? dutyListData[dutyItem] : [dutyListData[dutyItem]];
                      dutyFieldsItem.item_value = Array.from(new Set(valArr));
                    }else {
                      dutyListData[dutyItem].forEach(item => {
                        tempArray.push(item[dutyItem]);
                        const temp = [];
                        const valueList = [];
                        dutyFieldsItem.select_value_items.forEach(valueItem => {
                          if (item[dutyItem] === valueItem.select_code) {
                            const linkItems = item[valueItem.link_item.item_key];

                            if (linkItems) {
                              if (valueItem.link_item.item_model === 'select') {
                                linkItems.forEach(linkItem => {
                                  const copyValueItem = _.cloneDeep(valueItem.link_item);
                                  const tempLinkItem = {
                                    ...copyValueItem,
                                    item_value: [linkItem[valueItem.link_item.item_key]],
                                  };
                                  if (tempLinkItem.link_item) {
                                    tempLinkItem.link_item.item_value = [
                                      linkItem[tempLinkItem.link_item.item_key],
                                    ];
                                  }

                                  temp.push(tempLinkItem);
                                  valueList.push(linkItem[valueItem.link_item.item_key]);
                                });
                              } else {
                                valueItem.link_item.selectItemLast = [];
                                linkItems.forEach(linkItem => {
                                  valueItem.link_item.select_value_items.forEach(valueKey => {
                                    if (
                                      valueKey.select_code ===
                                      linkItem[valueItem.link_item.item_key]
                                    ) {
                                      valueItem.link_item.selectItemLast.push({
                                        linkItem: {
                                          ...valueKey.link_item,
                                          item_value: linkItem[valueKey.link_item.item_key],
                                        },
                                        checkedValue: valueKey.select_code,
                                      });
                                    }
                                  });
                                });
                                const tempItemValue = linkItems.map(linkItem => {
                                  return linkItem[valueItem.link_item.item_key];
                                });

                                const copyValueItem = _.cloneDeep(valueItem.link_item);
                                const tempItem = {
                                  ...copyValueItem,
                                  item_value: tempItemValue,
                                };
                                temp.push(tempItem);
                              }
                            }
                          }
                        });
                        dutyFieldsItem.selectOptions.push({
                          selectList: temp,
                          selectValueList: valueList,
                          checkedValue: item[dutyItem],
                        });
                      });
                      dutyFieldsItem.item_value = tempArray;
                    }
                    break;
                  case 'checkbox':
                    dutyFieldsItem.item_value = dutyListData[dutyItem];
                    break;
                  case 'radio':
                    dutyFieldsItem.item_value = dutyListData[dutyItem];
                    break;
                  default:
                    dutyFieldsItem.item_value.push(dutyListData[dutyItem]);
                }
              }
            });
            return dutyFieldsItem;
          });

          this.setState({
            isShowDetailSetting: true,
            dutyDetailSetting: {
              ...dutyDetailSetting,
              groupIndex,
              company_code,
              insIndex,
              sdlIndex,
              dutyList,
              dutyFields: dutyListData,
              dutyTitle,
              groupLevels,
            },
          });
        } else {
          message.error(res.message);
        }
      },
    });

    this.setState({
      isActiveSaveBtn: true,
    });
  };

  handleDetailCancel = (dutyFields, groupIndex, insIndex, sdlIndex) => {
    const form = this.formDetailRef.props.form;
    form.validateFields(err => {
      if (!err) {
        this.setState({
          [`detailSetting${groupIndex}${insIndex}${sdlIndex}`]: true,
        });
      } else {
        this.setState({
          [`detailSetting${groupIndex}${insIndex}${sdlIndex}`]: false,
        });
      }
    });
    this.setState({
      isShowDetailSetting: false,
    });
  };

  handleDetailSave = (dutyFields, groupIndex, insIndex, sdlIndex) => {
    console.log(dutyFields);
    const { groupLevels } = this.state;
    groupLevels[groupIndex].insurance_types[insIndex].duty_list[sdlIndex] = {
      ...groupLevels[groupIndex].insurance_types[insIndex].duty_list[sdlIndex],
      ...dutyFields,
    };

    const form = this.formDetailRef.props.form;
    form.validateFields(err => {
      if (err) return;
      form.resetFields();
      // console.log(33);
      this.setState({
        isShowDetailSetting: false,
        groupLevels,
        isAdd: false,
        [`detailSetting${groupIndex}${insIndex}${sdlIndex}`]: true,
      });
    });
  };

  saveDetailFormRef = formRef => {
    this.formDetailRef = formRef;
  };

  inpBlur = () => {
    const { dispatch, form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    const {company_code, organization_name, policy_id} = values;

    dispatch({
      type: 'product/checkPolicyId',
      payload: {company_code, organization_name, policy_id},
      callback: res => {
        console.log(res);
        if (res.status === 1) {
          this.setState({
            theCodeRep: res.data,
          });
        } 
      },
    });
  }

  formIsTouched = (e, indexArr) => {
    if(!e && e !== 0 && !indexArr) return false;
    // console.log(e);
    this.setState({
      isActiveSaveBtn: true,
    });

    if(!e && indexArr){
      console.log(e, indexArr);
      this.setState({
        showMultiples: true,
        indexArr,
      });
    }

    // 标注为正在编辑
    localStorage.setItem('productEditing', 1);
  };

  toggleMultiples = () => {
    const showMultiples = this.state.showMultiples;
    this.setState({
      showMultiples: !showMultiples,
    })
  }

  updateMulValue = (indexArr, itemKey, value) => {
    const { groupLevels } = this.state;
    const insTy = _.cloneDeep(groupLevels);
    const dtList = insTy[indexArr[0]].insurance_types[indexArr[1]].duty_list[indexArr[2]];

    dtList.forEach(dt => {
      if(dt.item_key === itemKey){
        dt.item_value = value;
        return false;
      }
    });

    this.setState({
      groupLevels: insTy,
    })
  }

  dealWithRenewInd = () => {
    const { location } = this.props;
    const { group_id, company_code } = location.state;
    const url = `${window.location.href}?group_id=${group_id}&company_code=${company_code}`;
    window.open(url);
  }

  render() {
    const {
      isAdd,
      isShowGradeModal,
      isAddGrade,
      insuranceAllNames,
      groupLevels,
      groupLevelItem,
      groupLevelItemIndex,
      groupItemInfo,
      isShowDeleteModal,
      isShowDetailSetting,
      isShowTipsModal,
      isAddTips,
      dutyDetailSetting,
      isActiveSaveBtn,
      cacheList,
      renewInd,
    } = this.state;
    const {
      product: {
        companyList: { data: companyList },
      },
    } = this.props;

    const { policyId } = this.props.match.params;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <div>
        <div className={styles.uiHeader}>
          <Row type="flex" justify="space-between">
            <Col span={6}>
              <Breadcrumb separator="/">
                <Breadcrumb.Item className={styles.breadCrumb}>
                  <Link to="/product/group" onClick={(e) => onLinkClick(e, '/product/group', this.props)}>保单列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className={styles.breadCrumb}>
                  {!isAdd ? `团单${policyId}` : '团单配置'}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={16} className={styles.alignRight}>
              <Button
                style={{ marginRight: '10px' }}
                type="primary"
                onClick={this.saveEditGroup}
                disabled={!isActiveSaveBtn || this.state.theCodeRep}
              >
                保存
              </Button>

              {!isAdd && 
                <Button
                  style={{ marginRight: '10px' }}
                  type="primary"
                  onClick={this.dealWithRenewInd}
                  disabled={renewInd}
                >
                  续保
                </Button>
              }

              {!renewInd && 
                <Button
                  style={{ marginRight: '10px' }}
                  type="primary"
                  onClick={(e) => this.saveEditGroup(e, true)}
                  disabled={!isActiveSaveBtn}
                >
                  暂存
                </Button>
              }

              <Button type="primary" ghost onClick={this.cancelEditGroup}>
                取消
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles.fixCard}>
          <Form onSubmit={this.queryInsuranceList}>
            <div className={styles.uiTitle}>团单概览</div>
            <div className={styles.uiBody}>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="所属保险公司">
                    {getFieldDecorator('company_code', {
                      initialValue: groupItemInfo.company_code || '',
                      rules: [
                        {
                          required: true,
                          message: '请选择所属保险公司!',
                        },
                      ],
                    })(
                      <Select
                        placeholder="所属保险公司"
                        onChange={this.queryInsuranceByCompanyCode}
                      >
                        {companyList &&
                          companyList.map(item => {
                            return (
                              <Option value={item.company_code} key={item.company_code}>
                                {item.company_name}
                              </Option>
                            );
                          })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="团体名称">
                    {getFieldDecorator('organization_name', {
                      initialValue: groupItemInfo.organization_name || '',
                      rules: [
                        {
                          required: true,
                          message: '团体名称不能为空！',
                        },
                      ],
                    })(<Input placeholder="输入团体名称" onChange={this.formIsTouched} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem 
                    {...formItemLayout} 
                    label="团体保单号" 
                    validateStatus={this.state.theCodeRep ? 'error' : ''}
                    help={this.state.theCodeRep ? '此团体保单号已配置过，请勿重复配置' : ''}
                  >
                    {getFieldDecorator('policy_id', {
                      initialValue: groupItemInfo.policy_id || '',
                      rules: [{
                        required: true,
                        message: '请填写团体保单号',
                      }],
                    })(
                      <Input placeholder="输入团体保单号" onChange={this.formIsTouched} disabled={!isAdd && !renewInd} onBlur={this.inpBlur} />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="保单有效期">
                    {getFieldDecorator('policy_validate', {
                      initialValue: isAdd || renewInd ? ''  : [
                          moment(moment(groupItemInfo.policy_validate_from), 'YYYY-MM-DD'),
                          moment(moment(groupItemInfo.policy_validate_to), 'YYYY-MM-DD'),
                        ],
                      rules: [{
                        required: true,
                        message: '请选择保单有效期！',
                      }],
                    })(
                      <RangePicker
                        style={{ width: '100%' }}
                        locale={locale}
                        onChange={this.formIsTouched}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="团体限额">
                    {getFieldDecorator('limit_amount', {
                      initialValue: groupItemInfo.limit_amount || '',
                    })(
                      <Input
                        placeholder="输入团体限额"
                        addonAfter="元"
                        onChange={this.formIsTouched}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="团单特别约定">
                    {getFieldDecorator('special_agreement', {
                      initialValue: groupItemInfo.special_agreement || '',
                    })(<Input placeholder="输入特别约定" onChange={this.formIsTouched} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="投保人身份">
                    {getFieldDecorator('renew_ind', {
                      initialValue: isAdd ? false : (renewInd ? true : groupItemInfo.renew_ind),
                    })(
                      <Radio.Group>
                        <Radio value>续保</Radio>
                        <Radio value={false}>新被保险人</Radio>
                      </Radio.Group>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className={styles.uiTitle}>层级及险种配置</div>
            <div className={styles.tabsBox}>
              <Row gutter={16}>
                <Col span={4} style={{ padding: '0' }}>
                  <ul className={styles.gradeList}>
                    {groupLevels.map((item, index) => {
                      return (
                        <li
                          className={this.tabBarIndexClass(index)}
                          onClick={() => {
                            this.setState({ currentTabIndex: index });
                          }}
                          key={item.group_level_code}
                        >
                          <span className="grade-title">{item.group_level_name}</span>
                          <Icon
                            className="grade-edit"
                            type="edit"
                            theme="outlined"
                            onClick={() => {
                              this.editGrade(index);
                            }}
                          />
                        </li>
                      );
                    })}
                    <li className={styles.gradeItemLast} onClick={this.addGrade}>
                      <span className="grade-title">
                        <Icon type="plus" theme="outlined" /> 新建层级
                      </span>
                    </li>
                  </ul>
                </Col>
                <Col
                  span={20}
                  style={{ padding: '0', borderLeft: '1px solid #e5e5e5', minHeight: '800px' }}
                >
                  <div className={styles.groupContainer}>
                    {!groupLevels.length > 0 && (
                      <div className={styles.initGrade}>
                        <figure>
                          <img src={gInitial} alt="创建新层级" />
                          <p>请先在左侧创建新层级</p>
                        </figure>
                      </div>
                    )}
                    {groupLevels.length > 0 &&
                      groupLevels.map((groupItem, groupIndex) => {
                        return (
                          <div key={groupItem.group_level_code || groupIndex}>
                            <div className={this.tabContentClass(groupIndex)}>
                              {groupItem.insurance_types.map((insuranceItem, insIndex) => {
                                return (
                                  <div key={insuranceItem.insurance_type_code || insIndex}>
                                    <div className={styles.uiBody}>
                                      <Row>
                                        <Col span={11}>
                                          <FormItem
                                            {...formItemLayout}
                                            label="险种名称"
                                            validateStatus={this.state.insTypeCode ? 'error' : ''}
                                            help={this.state.insTypeCode ? '此团体保单号已配置过，请勿重复配置' : ''}
                                          >
                                            {getFieldDecorator(`insuranceName${groupIndex}${insIndex}`,
                                              {rules: [{
                                                  required: true,
                                                  message: '请选择险种名称！',
                                                }],
                                                initialValue:insuranceItem.insurance_type_name || '',
                                              }
                                            )(
                                              <AutoComplete
                                                dataSource={insuranceAllNames}
                                                placeholder="输入险种名称进行查询"
                                                onSelect={e => this.queryActiveInsuranceItem(e,groupIndex,insIndex)}
                                                filterOption={(inputValue, option) => {
                                                  const bool = option.key.toUpperCase().indexOf(inputValue.toUpperCase()) > -1;
                                                  if(bool) return bool;

                                                  if(!bool){
                                                    const { insuranceListByCompany } = this.state;
                                                    let codeBool = false;
                                                    insuranceListByCompany.forEach(ins =>{
                                                      const code = ins.insurance_type_code;
                                                      const name = ins.insurance_type_name;
                                                      if(name === option.key){
                                                        codeBool = code.indexOf(inputValue) > -1;
                                                      }
                                                    })
                                                    return codeBool;
                                                  }
                                                }}
                                              />
                                            )}
                                          </FormItem>
                                        </Col>
                                        <Col span={9} className={styles.alignVertical}>
                                          <Row>
                                            {insuranceItem.dutyList &&
                                              insuranceItem.dutyList.length > 0 && (
                                                <Col span={8}>
                                                  <span>
                                                    险种类型：
                                                    {insuranceModel[insuranceItem.insurance_model]}
                                                  </span>
                                                </Col>
                                              )}
                                            <Col span={16}>
                                              <FormItem {...formItemLayout} label="险种保额">
                                                {getFieldDecorator(`amount_of_insurance${groupIndex}${insIndex}`,{initialValue:insuranceItem.amount_of_insurance || '',}
                                                )(
                                                  <Input
                                                    placeholder="险种保额"
                                                    style={{ width: '80px' }}
                                                    onChange={e => {
                                                      this.saveAmountOfInsurance(
                                                        e.target.value,
                                                        groupIndex,
                                                        insIndex
                                                      );
                                                    }}
                                                  />
                                                )}
                                              </FormItem>
                                            </Col>
                                          </Row>
                                        </Col>
                                        <Col span={3} className={styles.alignRight}>
                                          {insuranceItem.dutyList &&
                                            insuranceItem.dutyList.length > 0 &&
                                            this.state[`extendButton${groupIndex}${insIndex}`] && (
                                              <div
                                                className={styles.textExtend}
                                                onClick={() => {
                                                  this.setState({
                                                    [`extendButton${groupIndex}${insIndex}`]: false,
                                                  });
                                                }}
                                              >
                                                展开责任
                                                <Icon type="down" />
                                              </div>
                                            )}
                                          {insuranceItem.dutyList &&
                                            insuranceItem.dutyList.length > 0 &&
                                            !this.state[`extendButton${groupIndex}${insIndex}`] && (
                                              <div
                                                className={styles.textExtend}
                                                onClick={() => {
                                                  this.setState({
                                                    [`extendButton${groupIndex}${insIndex}`]: true,
                                                  });
                                                }}
                                              >
                                                收起责任
                                                <Icon type="up" />
                                              </div>
                                            )}
                                        </Col>
                                      </Row>
                                      {!this.state[`extendButton${groupIndex}${insIndex}`] && (
                                        <div className="duty-list">
                                          {insuranceItem.dutyList &&
                                            insuranceItem.dutyList.map((sdlItem, sdlIndex) => {
                                              return (
                                                <Row
                                                  key={sdlIndex}
                                                  style={{ marginBottom: '20px' }}
                                                >
                                                  <Col span={1} className={styles.alignCenter}>
                                                    <Checkbox
                                                      style={{ marginTop: '120px' }}
                                                      checked={cacheList[groupIndex] && cacheList[groupIndex][insIndex] && cacheList[groupIndex][insIndex][sdlIndex]}
                                                      // checked={this.state[`checked${groupIndex}${insIndex}${sdlIndex}`]}
                                                      onChange={e => {
                                                        this.dutyItemForSelect( e,groupIndex,insIndex,sdlIndex);
                                                      }}
                                                    />
                                                  </Col>
                                                  <Col span={23}>
                                                    <Card
                                                      title={setDutyTitle(sdlItem, insIndex)}
                                                      style={
                                                        cacheList[groupIndex] && cacheList[groupIndex][insIndex] && cacheList[groupIndex][insIndex][sdlIndex]
                                                          ? {
                                                              border: '1px solid #b8f2ea',
                                                              borderRadius: '2px',
                                                              boxShadow: '2px 2px 2px #eee',
                                                            }
                                                          : {}
                                                      }
                                                      headStyle={
                                                        cacheList[groupIndex] && cacheList[groupIndex][insIndex] && cacheList[groupIndex][insIndex][sdlIndex]
                                                          ? {
                                                              backgroundColor: '#b8f2ea',
                                                              padding: '0 10px',
                                                              borderBottom: '1px solid #b8f2ea',
                                                            }
                                                          : {
                                                              backgroundColor: '#f0f2f5',
                                                              padding: '0 10px',
                                                            }
                                                      }
                                                      bodyStyle={{ padding: '30px 10px 10px 10px' }}
                                                      extra={
                                                        cacheList[groupIndex] && cacheList[groupIndex][insIndex] && cacheList[groupIndex][insIndex][sdlIndex] ? (
                                                          !this.state[
                                                            `dutyEdit${groupIndex}${insIndex}${sdlIndex}`
                                                          ] ? (
                                                            <img
                                                              src={edit}
                                                              style={{ cursor: 'pointer' }}
                                                              alt="save edit"
                                                              onClick={() => {
                                                                this.editDutyItem(
                                                                  groupIndex,
                                                                  insIndex,
                                                                  sdlIndex
                                                                );
                                                                if (!this.state.isSaved) {
                                                                  message.warn(
                                                                    '请先保存相关责任信息'
                                                                  );
                                                                } else {
                                                                  this.setState({
                                                                    isSaved: false,
                                                                    [`dutyEdit${groupIndex}${insIndex}${sdlIndex}`]: true,
                                                                  });
                                                                }
                                                              }}
                                                            />
                                                          ) : (
                                                            <img
                                                              src={save}
                                                              style={{ cursor: 'pointer' }}
                                                              alt="save edit"
                                                              onClick={e => {
                                                                this.saveEditDuty(
                                                                  e,
                                                                  groupIndex,
                                                                  insIndex,
                                                                  sdlIndex
                                                                );
                                                              }}
                                                            />
                                                          )
                                                        ) : (
                                                          ''
                                                        )
                                                      }
                                                    >
                                                      {!this.state[ `dutyEdit${groupIndex}${insIndex}${sdlIndex}`] &&
                                                        refactoringFn(sdlItem.list).map((item, sdInd) => {
                                                            return (
                                                              <Row key={sdInd}>
                                                                {item.cols.map(key => {
                                                                  return (
                                                                    <Col span={12} key={key.labelName}>
                                                                      <Row style={{ marginBottom: '15px'}}>
                                                                        <Col span={11} style={{ textAlign: 'right', paddingRight: '10px',}}>
                                                                          {key.labelName} :
                                                                        </Col>
                                                                        <Col span={13}>
                                                                          {key.labelNameValue}
                                                                        </Col>
                                                                      </Row>
                                                                    </Col>
                                                                  );
                                                                })}
                                                              </Row>
                                                            );
                                                          }
                                                        )}
                                                      {this.state[
                                                        `dutyEdit${groupIndex}${insIndex}${sdlIndex}`
                                                      ] &&
                                                        refactoringFn(this.state.groupLevels[groupIndex].insurance_types[insIndex].duty_list[sdlIndex]).map((item, duInd) => {
                                                          return (
                                                            <Row key={duInd}>
                                                              {item.cols.map(list => {
                                                                const config = {
                                                                  list, getFieldDecorator, 
                                                                  postfix: PREFIX + groupIndex + insIndex + sdlIndex,
                                                                  indexArr: [groupIndex,insIndex,sdlIndex],
                                                                  onchange: this.formIsTouched,
                                                                }
                                                                return CreactDutyList(config);
                                                              })}
                                                            </Row>
                                                          );
                                                        })}
                                                      {this.state[`insDutyChecked${groupIndex}${insIndex}${sdlIndex}`] && !this.state[`dutyEdit${groupIndex}${insIndex}${sdlIndex}`] && (
                                                        <div style={{color: '#529ad8',cursor: 'pointer',float: 'right', }}>
                                                          <Tooltip
                                                            title={this.state[`detailSetting${groupIndex}${insIndex}${sdlIndex}`] ? '已配置所有必填项' : '有必填项未配置'}
                                                            placement="topRight"
                                                            trigger="hover"
                                                          >
                                                            <div onClick={() => this.openDutyDetailSetting( groupIndex,insIndex,sdlIndex)}>
                                                              详细配置
                                                              <img src={this.state[`detailSetting${groupIndex}${insIndex}${sdlIndex}`]? checkCircle : pendingCircle} alt="详细配置" />
                                                            </div>
                                                          </Tooltip>
                                                        </div>
                                                      )}
                                                    </Card>
                                                  </Col>
                                                </Row>
                                              );
                                            })}
                                        </div>
                                      )}
                                      <Row>
                                        <Col span={24} className={styles.alignRight}>
                                          <Button
                                            icon="minus"
                                            type="danger"
                                            disabled={groupItem.insurance_types.length === 1}
                                            onClick={() =>
                                              this.deleteInsuranceItem(groupIndex, insIndex)
                                            }
                                          >
                                            删除险种
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  </div>
                                );
                              })}
                              <div className={styles.uiFooter}>
                                <Row>
                                  <Col span={24} className={styles.alignRight}>
                                    <Button
                                      icon="plus"
                                      type="primary"
                                      onClick={() => this.addInsuranceItem(groupIndex)}
                                    >
                                      增加险种
                                    </Button>
                                  </Col>
                                </Row>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
        {/* 层级 */}
        <GradeModal
          modalTitle={isAddGrade ? '创建新层级' : '编辑层级'}
          isShowGradeModal={isShowGradeModal}
          isAddGrade={isAddGrade}
          handleCancel={this.handleCancelGradeModal}
          handleDeleteGrade={this.handleDeleteGrade}
          handleSaveGrade={this.handleSaveGrade}
          handleEditGrade={this.handleEditGrade}
          groupLevelItem={groupLevelItem}
          groupLevelItemIndex={groupLevelItemIndex}
          history={this.props.history}
          wrappedComponentRef={this.saveFormRef}
          key={Date.now()}
          groupLevels={groupLevels}
        />
        <Modal
          visible={isShowDeleteModal}
          zIndex={2000}
          title={
            <div style={{ fontSize: 16 }}>
              <Icon type="warning" style={{ color: 'rgb(245, 34, 45)', fontSize: 24, margin: 6 }} />
              删除
            </div>
          }
          onOk={this.handleOkGroup}
          onCancel={this.handleCancelGroup}
          footer={[
            <Button key="back" onClick={this.handleCancelGroup}>
              取消
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOkGroup}>
              删除
            </Button>,
          ]}
        >
          <p>删除后， 所选层级下的所有险种会同时删除，无法恢复，确定要删除该层级？</p>
        </Modal>

        <Modal
          visible={isShowTipsModal}
          zIndex={1500}
          title={
            <div style={{ fontSize: 16 }}>
              <Icon
                type="warning"
                style={{ color: 'rgb(241, 194, 22)', fontSize: 24, margin: 6 }}
              />
              提示
            </div>
          }
          onOk={this.handleOkButton}
          onCancel={this.handleCancelButton}
          footer={[
            <Button key="back" onClick={this.handleCancelButton}>
              取消
              {isAddTips ? '创建' : '编辑'}
            </Button>,
            <Button key="submit" type="primary" onClick={this.handleOkButton}>
              继续
              {isAddTips ? '创建' : '编辑'}
            </Button>,
          ]}
        >
          {isAddTips ? (
            <p>取消创建后， 所选数据将不被保存且无法恢复，确认取消？</p>
          ) : (
            <p>是否取消此次编辑？</p>
          )}
        </Modal>

        {/* 详细配置 */}
        <DutyDetailSetting
          isShowDetailSetting={isShowDetailSetting}
          dutyDetailSetting={dutyDetailSetting}
          handleDetailCancel={this.handleDetailCancel}
          handleDetailSave={this.handleDetailSave}
          history={this.props.history}
          wrappedComponentRef={this.saveDetailFormRef}
        />

        {/* 疾病责免 */}
        {this.state.showMultiples &&
          <CreateMultiples
            data={this.state}
            form={this.props.form}
            updateMulValue={this.updateMulValue}
            isShow={this.toggleMultiples}
          />
        }

        {this.state.hsptMultiples && 
          <HsptMultiples 
            data={this.state}
            form={this.props.form}
            updateMulValue={this.updateMulValue}
            isShow={this.toggleMultiples}
          />
        }
      </div>
    );
  }
}

export default EditGroup;
