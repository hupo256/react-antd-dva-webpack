/* eslint-disable react/no-did-mount-set-state,no-unused-expressions, consistent-return,operator-assignment,no-nested-ternary,no-param-reassign,array-callback-return,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {  Button, Row, Col, Form, Breadcrumb, Select, Input, Icon, message, AutoComplete, Checkbox, Card, Tooltip, Modal} from 'antd';
import _ from 'lodash';
import styles from '../../product.less';
import checkCircle from '../../images/check-circle.svg';
import pendingCircle from '../../images/pending.svg';
import save from '../../images/save.svg';
import edit from '../../images/edit.svg';
import DutyDetailSetting from './DutyDetailSetting/DutyDetailSetting';
import HsptMultiples from '../Preview/HsptMultiples';
import CreateMultiples from '../Preview/CreateMultiples';
import {CreactDutyList, refactoringDutyList, refactoringFn,setDutyTitle, filterValues, selectToNumber, onLinkClick} from '../../Components/DutyItemSetting/CreactDutyList';

const FormItem = Form.Item;
const Option = Select.Option;

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
      insuranceTypes: [{}],
      groupItemInfo: {},
      groupLevelList: [],
      cacheList: [],
      isShowDeleteModal: false,
      isShowDetailSetting: false,
      isShowTipsModal: false,
      isAddTips: true,
      isActiveSaveBtn: true,
      theCodeRep:false,
      dutyDetailSetting: {
        company_code: '',
        insIndex: 0,
        sdlIndex: 0,
        dutyTitle: '',
      },
      showMultiples: false,
    };
  }

  componentDidMount() {
    const { path } = this.props.match;
    const { location } = this.props;

    const lcsKey = location.state ? location.state.product_id : 'leapIns';
    const lcsObj = localStorage.getItem(lcsKey) ? JSON.parse(localStorage.getItem(lcsKey)) : null;
    if(lcsObj){
      this.setState({ ...lcsObj });
      return;
    }

    if (path.split('/').includes('add')) {
      this.setState({
        isAdd: true,
        isActiveSaveBtn: true,
      });
    } else {
      const { product_id, company_code } = location.state;
      this.getGroupItemInfo(product_id);
      this.getAllInsurance(company_code);
      this.setState({
        isAdd: false,
        isActiveSaveBtn: false,
      });
    }
  }

  warning = () => {
    Modal.warning({
      title: 'This is a warning message',
      content: 'some messages...some messages...',
    });
  }

  // 个单信息
  getGroupItemInfo = product_id => {
    const { dispatch, location } = this.props;
    const { company_code } = location.state;
    const { cacheList } = this.state;

    dispatch({
      type: 'product/getSingleProductItem',
      payload: {
        product_id,
      },
      callback: res => {
        if (res.status === 1) {
          this.setState({
            groupItemInfo: res.data,
          });

          const insuranceTypesArray = res.data.insurance_types;
          let count = 0;
          const tempInsuranceTypes = [];
          insuranceTypesArray.forEach((insItem, insIndex) => {
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
                        if (!cacheList[insIndex]) {
                          cacheList[insIndex] = [];
                        }
                        if (curDutyItem.duty_code === insDutyItem.duty_code) {
                          cacheList[insIndex][sdlIndex] = true;
                          this.setState({
                            cacheList,
                            [`checked${insIndex}${sdlIndex}`]: true,
                            [`insDutyChecked${insIndex}${sdlIndex}`]: true,
                            [`detailSetting${insIndex}${sdlIndex}`]: true,
                          });
                        } else {
                          cacheList[insIndex][sdlIndex] = false;
                          this.setState({
                            cacheList,
                            [`checked${insIndex}${sdlIndex}`]: false,
                            [`insDutyChecked${insIndex}${sdlIndex}`]: false,
                            [`detailSetting${insIndex}${sdlIndex}`]: false,
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

                        insItem.duty_list = _.cloneDeep(newInsDutyList);
                        insItem.dutyList = sdlList;

                        tempInsuranceTypes.push(insItem);
                        count = count + 1;
                        if (count === tempInsuranceTypes.length) {
                          this.setState({
                            insuranceTypes: tempInsuranceTypes,
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
        insurance_scope: 'personal',
      },
      callback: res => {
        if (res.status === 1) {
          if (res.data.length > 0) {
            const insuranceNameList = [];
            // console.log(res.data);
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

  // 选择险种
  queryActiveInsuranceItem = (insuranceItemName, insIndex) => {
    // console.log(insuranceItemName, insIndex);
    const itemName = insuranceItemName.split('_')[2];
    const { insuranceListByCompany } = this.state;
    const activeInsurance = insuranceListByCompany.filter(item => {
      return item.insurance_type_name === itemName;
    });
    this.getDutyFields(activeInsurance[0], insIndex);

    this.setState({
      isActiveSaveBtn: true,
    });
  };

  // 重组duty_list
  getDutyFields = (activeItem, insIndex) => {
    const { dispatch, location } = this.props;
    const { company_code } = location.state || this.state;
    const { insuranceTypes } = this.state;

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
            // console.log(item);
            // console.log(res.data);
            const bb = refactoringDutyList(item, res.data);
            const cc = bb.filter(value => (value.labelName !== '责任名称' && value.labelName !== '责任代码'));
            const dd = bb.filter(value => (value.labelName === '责任名称' || value.labelName === '责任代码'));
            sdlList.push({
              title: dd,
              list: cc,
              id: Date.now(),
            });
          });

          insuranceTypes[insIndex] = activeItem;
          insuranceTypes[insIndex].dutyList = sdlList;

          this.setState({insuranceTypes});
        } else {
          message.error(res.message);
        }
      },
    });
  };


  // 增加险种
  addInsuranceItem = () => {
    const { insuranceTypes } = this.state;

    insuranceTypes.push({});

    this.setState({
      isAdd: true,
      insuranceTypes,
      isActiveSaveBtn: true,
    });
  };

  // 删除险种
  deleteInsuranceItem = insIndex => {
    const { insuranceTypes, cacheList } = this.state;
    insuranceTypes.splice(insIndex, 1);
    if (cacheList.length > 0) {
      cacheList.splice(insIndex, 1);
    }
    if (insIndex === 0 && insuranceTypes[insIndex].insurance_type_name) {
      this.props.form.setFieldsValue({
        [`insuranceName${insIndex}`]: insuranceTypes[insIndex].insurance_type_name,
      });
    } else {
      this.props.form.setFieldsValue({
        [`insuranceName${insIndex}`]: '',
      });
    }
    
    this.setState({
      insuranceTypes,
      cacheList,
    });
  };

  // 选择险种下的责任
  dutyItemForSelect = (e, insIndex, sdlIndex) => {
    const { cacheList } = this.state;
    if (!cacheList[insIndex]) {
      cacheList[insIndex] = [];
    }
    e.target.checked
      ? (cacheList[insIndex][sdlIndex] = true)
      : (cacheList[insIndex][sdlIndex] = false);

    this.setState({
      cacheList,
      [`insDutyChecked${insIndex}${sdlIndex}`]: e.target.checked,
      [`checked${insIndex}${sdlIndex}`]: e.target.checked,
      isActiveSaveBtn: true,
    });
  };

  // 编辑责任
  editDutyItem = (insIndex, sdlIndex) => {
    const { dispatch } = this.props;
    const { insuranceTypes } = this.state;
    const dutyList = insuranceTypes[insIndex].duty_list[sdlIndex];

    const originalDutyList = _.cloneDeep(dutyList);

    dispatch({
      type: 'product/queryDutyConfigFields',
      payload: {
        company_code: dutyList.company_code,
        item_subcategory: insuranceTypes[insIndex].insurance_model,
        item_category: 'duty',
      },
      callback: res => {
        const dutyFields = res.data;
        selectToNumber(dutyFields)

        // 拿到数据后，为每一个item的 item_value赋值
        const newDutyList = dutyFields.map(dutyFieldsItem => {
          Object.keys(dutyList).filter(dutyItem => {
            if (dutyFieldsItem.item_key === dutyItem) {
              const vValue = dutyList[dutyItem];
              switch (dutyFieldsItem.item_model) {
                case 'input':
                  dutyFieldsItem.item_value.push(vValue);
                  break;
                case 'selectMultiple':
                case 'select':
                case 'checkbox':
                case 'radio':
                  dutyFieldsItem.item_value = vValue;
                  if (dutyItem.includes('_hospitals')){
                    dutyFieldsItem.item_value_len = `共${vValue.length}家`;
                  }
                  break;
                default:
                  dutyFieldsItem.item_value = vValue;
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
        insuranceTypes[insIndex].duty_list[sdlIndex] = ssDutyList;

        this.setState({
          insuranceTypes,
          dutyObj,
          originalDutyList,
        });
      },
    });
  };

  // 保存责任
  saveEditDuty = (e, insIndex, sdlIndex) => {
    e.preventDefault();
    const { insuranceTypes, dutyObj, originalDutyList } = this.state;
    const { form: { getFieldsValue, validateFields } } = this.props;
    const keyArr = Object.keys(getFieldsValue()).filter(key => key.includes(PREFIX));
    const theValueList = insuranceTypes[insIndex].duty_list[sdlIndex];
    
    validateFields(keyArr, (err, values) => {
      if (err) return;
      const realDuty = {};
      Object.keys(values).forEach(key => {
        const vKey = key.split(PREFIX)[0];
        if(values[key] || values[key] === 0) {
          realDuty[vKey] = values[key];
          if (key.includes('_hospitals')){
            for(let i = 0, k=theValueList.length; i<k; i += 1) {
              const item = theValueList[i];
              if(item.item_key === vKey) {
                realDuty[vKey] = item.item_value;
                break;
              }
            }
          }
        }
      });
      realDuty.duty_code = dutyObj.duty_code;
      realDuty.duty_name = dutyObj.duty_name;
      insuranceTypes[insIndex].duty_list[sdlIndex] = {
        ...originalDutyList,
        ...realDuty,
      };

      this.getDutyFields(insuranceTypes[insIndex], insIndex);
      this.setState({
        isSaved: true,
        [`dutyEdit${insIndex}${sdlIndex}`]: false,
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
    this.props.history.push('/product/single');
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
    const { dispatch } = this.props;
    const { insuranceAllNames } = this.state;
    const lcsKey = this.state.groupItemInfo.product_id ? this.state.groupItemInfo.product_id : 'leapIns';
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
        message.error('请先创建个单险种模板');
        return;
      }
     
      if (!this.state.isSaved) {
        message.error('请先保存相关责任信息');
        return;
      }

      const paramsGroup = this.dealWithValue(values);
      dispatch({
        type: 'product/saveSingleProductItem',
        payload: paramsGroup,
        callback: res => {
          if (res.status === 1) {
            message.success('保存成功', 2).then(() => {
              localStorage.setItem(lcsKey, '');
              localStorage.setItem('productEditing', 0);
              if(lastId && lastId === lcsKey) localStorage.setItem('leapInsId', '');
              return this.props.history.push('/product/single');
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
    const { insuranceTypes, cacheList, groupItemInfo } = this.state;

    // 记录头部信息
    const {company_code, product_code, product_name} = values;
    Object.assign(groupItemInfo, {company_code, product_code, product_name});

    let product_id = ''
    if (location.state) {
      product_id = location.state.product_id;
    }

    let newGroup = _.cloneDeep(insuranceTypes);

    cacheList.forEach((c1, i1) => {
      if (c1) {
        const oriInsuranceTypes = newGroup[i1].duty_list;
        newGroup[i1].duty_list = [];
        c1.forEach((c2, i2) => {
          if (c2) {
            newGroup[i1].duty_list[i2] = oriInsuranceTypes[i2];
          }
        });
        newGroup[i1].duty_list = _.compact(newGroup[i1].duty_list);
      }
    });
    newGroup = _.compact(newGroup);

    const nGroup = [];
    newGroup.forEach(item => {
      delete item.dutyList;
      delete item.create_at;
      delete item.last_modified_date;
      nGroup.push(item);
    });

    const isHasDutyList = nGroup.some(ngItem => {
      return ngItem.duty_list.length > 0;
    });

    if (cacheList.length < 0 || !isHasDutyList) {
      message.error('请至少选择一个责任！');
      return;
    }

    const params = {
      company_code, 
      product_code, 
      product_name,
      require_claim: values.require_claim,
      create_at: Date.now(),
      insurance_types: filterValues(nGroup),
    };
    if (product_id) {
      Object.assign(params, { product_id });
    }
    console.log(params);
    return params;
  }

  // 取消创建
  cancelEditGroup = () => {
    const {
      match: { path },
    } = this.props;

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
    this.props.history.push('/product/single');
  };

  // 详细配置
  openDutyDetailSetting = (insIndex, sdlIndex) => {
    const { dispatch } = this.props;
    const { dutyDetailSetting, insuranceTypes, isAdd } = this.state;

    const activeInsuranceItem = insuranceTypes[insIndex];

    const dutyTitle = activeInsuranceItem.duty_list[sdlIndex].duty_name;

    const company_code = activeInsuranceItem.company_code;
    const insurance_model = activeInsuranceItem.insurance_model;
    const dutyListData = activeInsuranceItem.duty_list[sdlIndex];

    dispatch({
      type: 'product/queryDutyConfigFields',
      payload: {
        company_code,
        item_subcategory: insurance_model,
        item_category: 'personal',
      },
      callback: res => {
        if (res.status === 1) {
          const dutyFieldsList = res.data;
          selectToNumber(dutyFieldsList);
          console.log(dutyFieldsList);

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
                                    item_value:
                                      linkItem[valueItem.link_item.item_key] ||
                                      valueItem.select_code,
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
                          ...dutyFieldsItem.link_item,
                          item_value: aaItem[dutyFieldsItem.link_item.item_key],
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
                                      +valueKey.select_code ===
                                      linkItem[valueItem.link_item.item_key]
                                    ) {
                                      valueItem.link_item.selectItemLast.push({
                                        linkItem: {
                                          ...valueKey.link_item,
                                          item_value: linkItem[valueKey.link_item.item_key],
                                        },
                                        checkedValue: +valueKey.select_code,
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

          // console.log(dutyListData);

          this.setState({
            isShowDetailSetting: true,
            dutyDetailSetting: {
              ...dutyDetailSetting,
              company_code,
              insIndex,
              sdlIndex,
              dutyList,
              dutyFields: dutyListData,
              dutyTitle,
              insuranceTypes,
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

  handleDetailCancel = (dutyFields, insIndex, sdlIndex) => {
    const form = this.formDetailRef.props.form;
    form.validateFields(err => {
      if (!err) {
        this.setState({
          [`detailSetting${insIndex}${sdlIndex}`]: true,
        });
      } else {
        this.setState({
          [`detailSetting${insIndex}${sdlIndex}`]: false,
        });
      }
    });

    this.setState({
      isShowDetailSetting: false,
    });
  };

  handleDetailSave = (dutyFields, insIndex, sdlIndex) => {
    console.log(dutyFields);
    const { insuranceTypes } = this.state;
    insuranceTypes[insIndex].duty_list[sdlIndex] = {
      ...insuranceTypes[insIndex].duty_list[sdlIndex],
      ...dutyFields,
    };

    const form = this.formDetailRef.props.form;
    form.validateFields(err => {
      if (err) return;

      form.resetFields();
      this.setState({
        isShowDetailSetting: false,
        insuranceTypes,
        isAdd: false,
        [`detailSetting${insIndex}${sdlIndex}`]: true,
      });
    });
  };

  saveDetailFormRef = formRef => {
    this.formDetailRef = formRef;
  };

  inpBlur = () => {
    const { dispatch, form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    const {company_code, product_code} = values;

    dispatch({
      type: 'product/checkProductcode',
      payload: {company_code, product_code},
      callback: res => {
        if (res.status === 1) {
          this.setState({
            theCodeRep: res.data,
          });
        } 
      },
    });
  }

  formIsTouched = (e, indexArr, key, tabIndex) => {
    if(!e && e !== 0 && !indexArr) return false;
    this.setState({
      isActiveSaveBtn: true,
    });

    if(!e && indexArr){
      this.setState({
        showMultiples: true,
        indexArr,
      });
    } else {
      this.setState({
        hsptMultiples: true,
        hsptKey: key,
        hsptIndex: tabIndex || "0",
        indexArr,
      });
    }

    // 标注为正在编辑
    localStorage.setItem('productEditing', 1);
  };

  toggleMultiples = (bool) => {
    const { showMultiples, hsptMultiples } = this.state;
    if (bool) {
      this.setState({ hsptMultiples: !hsptMultiples})
    } else {
      this.setState({ showMultiples: !showMultiples})
    }
  }

  updateMulValue = (indexArr, itemKey, value) => {
    console.log(indexArr, itemKey, value);
    const { insuranceTypes } = this.state;
    const insTy = _.cloneDeep(insuranceTypes);
    const dtList = insTy[indexArr[0]].duty_list[indexArr[1]];

    for (let i=0, k=dtList.length; i<k; i += 1) {
      const dt = dtList[i];
      if(dt.item_key === itemKey){
        dt.item_value = value;
        if (itemKey.includes('_hospitals')) {
          dt.item_value = value;
          dt.item_value_len = `共${value.length}家`;
        }
        break;
      }
    }
    this.setState({
      insuranceTypes: insTy,
    })
  }

  removeTheAtt = (obj, nameArr) => {
    const { form: { resetFields }} = this.props;
    resetFields();
    nameArr.forEach(name => {obj[name] = ''});
    this.setState({ obj })
  }

  // 选择公司
  queryInsuranceByCompanyCode = code => {
    const nameArr = ['product_name', 'product_code'];
    const { company_code, isActiveSaveBtn, groupItemInfo }  = this.state;
    const { form: { getFieldsValue }} = this.props;
    const comCode = localStorage.getItem('companyCode');
    const values = getFieldsValue();
    const { product_code, product_name } = values;
    const valArr = [product_code, product_name]
    if(comCode !== code ) this.removeTheAtt(groupItemInfo, nameArr);
    if(isActiveSaveBtn){  // 有数据，则将之前的清空
      nameArr.forEach((name, index) => { groupItemInfo[name] = valArr[index] });
      localStorage.setItem('insDataInCompany', JSON.stringify(this.state));
      localStorage.setItem('companyCode', company_code);
      this.removeTheAtt(groupItemInfo, nameArr);
      this.setState({ 
        insuranceTypes: [{}],
        isActiveSaveBtn: false,
      });
    } else { // 没有数据，则需要区别对待
      console.log(comCode, code);
      if(comCode === code){
        const insData = JSON.parse(localStorage.getItem('insDataInCompany'));
        this.setState({ ...insData });
      }else{
        this.setState({
          insuranceTypes: [{}],
        });
      }
    }
    
    this.getAllInsurance(code);
    this.setState({
      company_code: code,
    });
  };

  render() {
    const {
      isAdd,
      insuranceAllNames,
      insuranceTypes,
      isShowDetailSetting,
      dutyDetailSetting,
      groupItemInfo,
      isShowTipsModal,
      isAddTips,
      isActiveSaveBtn,
      cacheList,
    } = this.state;
    const {
      product: {
        companyList: { data: companyList },
      },
    } = this.props;

    const { singleCode } = this.props.match.params;
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
          <Row>
            <Col span={18}>
              <Breadcrumb separator="/">
                <Breadcrumb.Item className={styles.breadCrumb}>
                  <Link to="/product/single" onClick={(e) => onLinkClick(e, '/product/single', this.props)}>个单列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className={styles.breadCrumb}>
                  {!isAdd ? `个单${singleCode}` : '产品配置'}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={6} className={styles.alignRight}>
              <Button
                style={{ marginRight: '10px' }}
                type="primary"
                onClick={this.saveEditGroup}
                disabled={!isActiveSaveBtn || this.state.theCodeRep}
              >
                保存
              </Button>

              <Button
                style={{ marginRight: '10px' }}
                type="primary"
                onClick={(e) => this.saveEditGroup(e, true)}
                disabled={!isActiveSaveBtn}
              >
                暂存
              </Button>

              <Button type="primary" ghost onClick={this.cancelEditGroup}>
                取消
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles.fixCard}>
          <Form onSubmit={this.queryInsuranceList}>
            <div className={styles.uiTitle}>产品概览</div>
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
                      <Select placeholder="所属保险公司" onChange={this.queryInsuranceByCompanyCode}>
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
                  <FormItem 
                    {...formItemLayout} 
                    label="产品代码" 
                    validateStatus={this.state.theCodeRep ? 'error' : ''}
                    help={this.state.theCodeRep && '此产品代码已配置过，请勿重复配置'}
                  >
                    {getFieldDecorator('product_code', {
                      initialValue: groupItemInfo.product_code || '',
                      rules: [{
                        required: true,
                        message: '请填写产品代码',
                      }],
                    })(<Input placeholder="产品代码" onChange={this.formIsTouched} disabled={!isAdd} onBlur={this.inpBlur} />)}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="产品名称">
                    {getFieldDecorator('product_name', {
                      initialValue: groupItemInfo.product_name || '',
                      rules: [
                        {
                          required: true,
                          message: '产品名称不能为空！',
                        },
                      ],
                    })(<Input placeholder="产品名称" onChange={this.formIsTouched} />)}
                  </FormItem>
                </Col>
              </Row>
            </div>
            <div className={styles.uiTitle}>险种配置</div>
            <div>
              <Row gutter={16}>
                <Col span={24}>
                  <div className={styles.groupContainer}>
                    {insuranceTypes.map((insuranceItem, insIndex) => {
                      const typeName = insuranceItem.insurance_type_name;
                      // console.log(insuranceTypes);
                      // console.log(typeName);
                      return (
                        <div key={insIndex}>
                          <div className={styles.uiBody}>
                            <Row>
                              <Col span={10}>
                                <FormItem {...formItemLayout} label="险种名称">
                                  {getFieldDecorator(`insuranceName${insIndex}`, {
                                    rules: [
                                      {
                                        required: true,
                                        message: '请选择险种名称！',
                                      },
                                    ],
                                    initialValue: typeName,
                                  })(
                                    <AutoComplete
                                      style={{ width: '100%' }}
                                      dataSource={insuranceAllNames}
                                      placeholder="输入险种名称进行查询"
                                      onSelect={e => { this.queryActiveInsuranceItem(e, insIndex)}}
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
                              <Col span={11} className={styles.alignVertical}>
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
                                </Row>
                              </Col>
                              <Col span={3} className={styles.alignRight}>
                                {insuranceItem.dutyList &&
                                  insuranceItem.dutyList.length > 0 &&
                                  this.state[`extendButton${insIndex}`] && (
                                    <div
                                      className={styles.textExtend}
                                      onClick={() => {
                                        this.setState({
                                          [`extendButton${insIndex}`]: false,
                                        });
                                      }}
                                    >
                                      展开责任
                                      <Icon type="down" />
                                    </div>
                                  )}
                                {insuranceItem.dutyList &&
                                  insuranceItem.dutyList.length > 0 &&
                                  !this.state[`extendButton${insIndex}`] && (
                                    <div
                                      className={styles.textExtend}
                                      onClick={() => {
                                        this.setState({
                                          [`extendButton${insIndex}`]: true,
                                        });
                                      }}
                                    >
                                      收起责任
                                      <Icon type="up" />
                                    </div>
                                  )}
                              </Col>
                            </Row>
                            {!this.state[`extendButton${insIndex}`] && (
                              <div className="duty-list">
                                {insuranceItem.dutyList &&
                                  insuranceItem.dutyList.map((sdlItem, sdlIndex) => {
                                    return (
                                      <Row key={sdlIndex} style={{ marginBottom: '20px' }}>
                                        <Col span={1} className={styles.alignCenter}>
                                          <Checkbox
                                            style={{ marginTop: '120px' }}
                                            checked={cacheList[insIndex] && cacheList[insIndex][sdlIndex]}
                                            onChange={e => {
                                              this.dutyItemForSelect(e, insIndex, sdlIndex);
                                            }}
                                          />
                                        </Col>

                                        <Col span={23}>
                                          <Card
                                            title={setDutyTitle(sdlItem, sdlIndex)}
                                            style={
                                              cacheList[insIndex] && cacheList[insIndex][sdlIndex]
                                                ? {
                                                    border: '1px solid #b8f2ea',
                                                    borderRadius: '2px',
                                                    boxShadow: '2px 2px 2px #eee',
                                                  }
                                                : {}
                                            }
                                            headStyle={
                                              cacheList[insIndex] && cacheList[insIndex][sdlIndex]
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
                                              cacheList[insIndex] && cacheList[insIndex][sdlIndex] ? (
                                                !this.state[`dutyEdit${insIndex}${sdlIndex}`] ? (
                                                  <img
                                                    src={edit}
                                                    style={{ cursor: 'pointer' }}
                                                    alt="save edit"
                                                    onClick={() => {
                                                      this.editDutyItem(insIndex, sdlIndex);
                                                      if (!this.state.isSaved) {
                                                        message.warn('请先保存相关责任信息');
                                                      } else {
                                                        this.setState({
                                                          isSaved: false,
                                                          [`dutyEdit${insIndex}${sdlIndex}`]: true,
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
                                                      this.saveEditDuty(e, insIndex, sdlIndex);
                                                    }}
                                                  />
                                                )
                                              ) : (
                                                ''
                                              )
                                            }
                                          >
                                            {!this.state[`dutyEdit${insIndex}${sdlIndex}`] &&
                                              refactoringFn(sdlItem.list).map((item, sInd) => {
                                                return (
                                                  <Row key={sInd}>
                                                    {item.cols.map((key, colInd) => {
                                                      return (
                                                        <Col span={12} key={colInd}>
                                                          <Row style={{marginBottom: '15px'}}>
                                                            <Col span={10} style={{textAlign: 'right',paddingRight: '10px'}}> {key.labelName} :</Col>

                                                            {(key.labelName === '除外医院' || key.labelName === '扩展医院') ? 
                                                              <Col 
                                                                className={styles.inpHospitals}
                                                                onClick={(e) => this.formIsTouched(e, [insIndex, sdlIndex], 'hsptLenShow', '1')}
                                                                span={14}
                                                              >
                                                                {key.labelNameValue}
                                                              </Col> : 
                                                              <Col span={14}>{key.labelNameValue}</Col>
                                                            }
                                                          </Row>
                                                        </Col>
                                                      );
                                                    })}
                                                  </Row>
                                                );
                                              })}
                                            {this.state[`dutyEdit${insIndex}${sdlIndex}`] &&
                                              refactoringFn(this.state.insuranceTypes[insIndex].duty_list[sdlIndex]).map((item, duInd) => {
                                                return (
                                                  <Row key={duInd}>
                                                    {item.cols.map(list => {
                                                      const config = {
                                                        list, getFieldDecorator, 
                                                        postfix: PREFIX + insIndex + sdlIndex,
                                                        indexArr: [insIndex,sdlIndex],
                                                        onchange: this.formIsTouched,
                                                      }
                                                      return CreactDutyList(config);
                                                    })}
                                                  </Row>
                                                );
                                              })}
                                            {this.state[`insDutyChecked${insIndex}${sdlIndex}`] && !this.state[`dutyEdit${insIndex}${sdlIndex}`] && (
                                              <div style={{color: '#529ad8',cursor: 'pointer',float: 'right',}}>
                                                <Tooltip
                                                  title={
                                                    this.state[
                                                      `detailSetting${insIndex}${sdlIndex}`
                                                    ]
                                                      ? '已配置所有必填项'
                                                      : '有必填项未配置'
                                                  }
                                                  placement="topRight"
                                                >
                                                  <div onClick={() => this.openDutyDetailSetting(insIndex, sdlIndex)}>
                                                    详细配置
                                                    <img
                                                      src={
                                                        this.state[
                                                          `detailSetting${insIndex}${sdlIndex}`
                                                        ]
                                                          ? checkCircle
                                                          : pendingCircle
                                                      }
                                                      alt="详细配置"
                                                    />
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
                                  disabled={insuranceTypes.length === 1}
                                  onClick={() => this.deleteInsuranceItem(insIndex)}
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
                            onClick={() => this.addInsuranceItem()}
                          >
                            增加险种
                          </Button>
                        </Col>
                      </Row>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>
          </Form>
        </div>
        <Modal
          visible={isShowTipsModal}
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
