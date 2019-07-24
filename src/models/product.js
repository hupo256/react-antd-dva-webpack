/* eslint-disable array-callback-return,no-param-reassign,prefer-destructuring,camelcase */
import {
  getCompanyList,
  queryInsuranceConfigFields,
  queryDutyConfigFields,
  queryInsuranceList,
  queryInsuranceItem,
  saveInsuranceItem,
  getSingleProductList,
  getSingleProductItem,
  saveSingleProductItem,
  getGroupProductList,
  getGroupProductItem,
  saveGroupProductItem,
  getCustomFieldList,
  getFieldItemById,
  editFieldItem,
  checkTemplateCode,
  checkProductcode,
  checkPolicyId,
} from '../services/product';

export default {
  namespace: 'product',

  state: {
    companyList: [],
    loading: false,
  },

  effects: {
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      yield put({
        type: 'saveCompanyList',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    *queryInsuranceList({ payload, callback }, { call, put }) {
      const response = yield call(queryInsuranceList, payload);
      yield put({
        type: 'saveInsuranceList',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    *queryInsuranceItem({ payload, callback }, { call, put }) {
      const response = yield call(queryInsuranceItem, payload);
      yield put({
        type: 'getInsuranceItem',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    *saveInsuranceItem({ payload, callback }, { call }) {
      const response = yield call(saveInsuranceItem, payload);
      if (callback) {
        callback(response);
      }
    },
    *queryInsuranceConfigFields({ payload, callback }, { call, put }) {
      const response = yield call(queryInsuranceConfigFields, payload);
      yield put({
        type: 'saveInsuranceFields',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    *queryDutyConfigFields({ payload, callback }, { call, put }) {
      const response = yield call(queryDutyConfigFields, payload);
      yield put({
        type: 'saveDutyFields',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },

    *editInsuranceInfo({ payload, callback }, { call }) {
      const insuranceFields = yield call(queryInsuranceConfigFields, payload.insFields);
      const dutyFields = yield call(queryDutyConfigFields, payload.dutyFields);
      const insuranceInfo = yield call(queryInsuranceItem, payload.insItem);

      const { data: dutyFieldsData } = dutyFields;
      const { data: insuranceFieldsData } = insuranceFields;
      const { data: insuranceData } = insuranceInfo;

      const {
        company_code,
        insurance_model,
        insurance_scope,
        template_id,
        duty_list,
        ...resInsFields
      } = insuranceData;

      // 险种字段
      const newInsFields = insuranceFieldsData.map(item => {
        Object.keys(resInsFields).filter(insItem => {
          if (item.item_key === insItem) {
            switch (item.item_model) {
              case 'input':
                item.item_value.push(insuranceData[insItem]);
                break;
              case 'range':
                item.range_value_item.start_value = insuranceData[insItem].start_value;
                item.range_value_item.end_value = insuranceData[insItem].end_value;
                break;
              case 'selectMultiple':
              case 'select':
              case 'checkbox':
              case 'radio':
                item.item_value = insuranceData[insItem];
                break;
              default:
                item.item_value = insuranceData[insItem];
            }
          }
        });
        return item;
      });

      // 责任
      const dutyListTemp = [];
      const newDutyList = duty_list.map(item => {
        const dutyFieldsList = JSON.parse(JSON.stringify(dutyFieldsData));
        Object.keys(item).filter(dutyItem => {
          dutyFieldsList.forEach(dutyFieldsItem => {
            if (dutyFieldsItem.item_key === dutyItem) {
              let iValue = item[dutyItem];
              if(iValue === -1) iValue = '';
              switch (dutyFieldsItem.item_model) {
                case 'input':
                  dutyFieldsItem.item_value.push(iValue);
                  break;
                case 'selectMultiple':
                case 'select':
                case 'checkbox':
                case 'radio':
                  dutyFieldsItem.item_value = iValue;
                  break;
                default:
                  dutyFieldsItem.item_value = iValue;
              }
            }
          });
        });
        return dutyListTemp.concat(dutyFieldsList);
      });

      // 组装 dutyRenderList
      // 原始duty字段 dutyFieldsData
      // 返回 newInsFields
      if (callback) {
        callback({
          dutyFieldsData,
          newDutyList,
          newInsFields,
          company_code,
          insurance_model,
          insurance_scope,
          template_id,
        });
      }
    },

    *queryInsListAndCompany({ payload, callback }, { call }) {
      const insList = yield call(queryInsuranceList, payload);
      const comList = yield call(getCompanyList, payload);

      const insuranceData = insList.data.map(item => {
        let company_name = '';
        comList.data.forEach(it => {
          if (item.company_code === it.company_code) {
            company_name = it.company_name;
          }
        });
        return {
          ...item,
          company_name,
        };
      });

      if (callback) {
        callback(insuranceData);
      }
    },

    // 个单
    *getSingleProductList({ payload, callback }, { call, put }) {
      const response = yield call(getSingleProductList, payload);
      yield put({
        type: 'singleProductList',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    *querySingleListAndCompany({ payload, callback }, { call }) {
      const singleList = yield call(getSingleProductList, payload);
      const comList = yield call(getCompanyList, payload);

      const singleData = singleList.data.list.map(item => {
        let company_name = '';
        comList.data.forEach(it => {
          if (item.company_code === it.company_code) {
            company_name = it.company_name;
          }
        });
        return {
          ...item,
          company_name,
        };
      });

      if (callback) {
        callback({
          singleData,
          totalElement: singleList.data.total_element,
        });
      }
    },

    // 生成预览数据
    *queryViewData({ payload, callback }, { call }) {
      let valueData = [];
      let itemCategory = ''
      if(payload.isGroup) {
        valueData = yield call(getGroupProductItem, payload.pid);
        itemCategory = 'group';
      }else{
        valueData = yield call(getSingleProductItem, payload.pid);
        itemCategory = 'personal';
      }

      const nameDate = yield call(queryDutyConfigFields, payload.nameFields);
      const expenseNameData = yield call(queryDutyConfigFields, {
        company_code: payload.nameFields.company_code,
        item_subcategory: 'expense',
        item_category: itemCategory,
      });
      const allowanceNameData = yield call(queryDutyConfigFields, {
        company_code: payload.nameFields.company_code,
        item_subcategory: 'allowance',
        item_category: itemCategory,
      });
      const quotaNameData = yield call(queryDutyConfigFields, {
        company_code: payload.nameFields.company_code,
        item_subcategory: 'quota',
        item_category: itemCategory,
      });

      console.log(valueData);
      const expenseArr = nameDate.data.concat(expenseNameData.data);
      const allowanceArr = nameDate.data.concat(allowanceNameData.data);
      const quotaArr = nameDate.data.concat(quotaNameData.data);
      const insuranceModel = {
        expense: '费用型',
        allowance: '津贴型',
        quota: '定额型',
      };
      const nameArrByModel = {
        expense: expenseArr,
        allowance: allowanceArr,
        quota: quotaArr,
      };

      let groupLevels = null; 
      let groupTit = null;
      let insuranceTypes=null;
      let viewData=[];

      function dealWithData(insuranceArr, nameArr, insModels){
        const viewArr = [];
        let InsAmount = '';
        insuranceArr.forEach((ins) => {
          InsAmount = ins.amount_of_insurance || '-';
          const dutyList = ins.duty_list;
          const insModel = ins.insurance_model;
          const namesArr = nameArr[insModel];
          const insArr = [];  // 险种
          dutyList.forEach((duty) => {
            const cellDuty = [];  // 责任
            let dName = '';
            let dCode = '';

            namesArr.forEach((name) => {
              const arr = [];  // 名值对 [name, value, key]
              const key = name.item_key;
              const unit = name.item_unit;
              let vData = duty[key];

              if(key === 'duty_name') { 
                dName = duty[key];
                return false;
              }

              if(key === 'duty_code') {
                dCode = duty[key];
                return false;
              }
              
              if(key.indexOf('_type_expense') > 0){  // 免赔类型
                const tagArr = [];
                if(!vData || (vData instanceof Array && vData.length < 1)) return false;
                vData.forEach(vd =>{
                  const tagInd = vd[key];
                  const tItem = name.select_value_items[tagInd -1];
                  const linkItem = tItem.link_item;
                  const tagKey = linkItem.item_key;
                  if(!vd[tagKey]) return false;
                  const tArr = [];  // 名值对集合
                  const vName = tItem.select_text;
                  vd[tagKey].forEach(obj =>{  // 第二层的数组
                    linkItem.select_value_items.forEach(sc =>{
                      if(obj[tagKey] === +sc.select_code){
                        const val = obj[linkItem.link_item.item_key] || '';
                        tArr.push([
                          sc.select_text,
                          `${val} ${linkItem.link_item.item_unit}`
                        ])
                      }
                    })
                  })
                  tagArr.push({vName,tArr})
                })
                vData.list = tagArr;
                console.log(vData);
              }else if(key === 'pay_ratio_type') {   // 赔付比例类型
                if(!vData || vData[key] === 0) return false;
                console.log(key, vData);
                const tagInd = vData.pay_ratio_type;
                const linkItem = name.select_value_items[tagInd -1].link_item;
                const tagKey = linkItem.item_key;
                const vName = linkItem.item_label;
                let tagArr = [];
                if(tagKey === 'pay_balance'){  // 均一比例
                  tagArr = vData.pay_balance; 
                }else{
                  const tArr = [];  // 名值对集合
                  vData[tagKey].forEach(obj =>{  // 第二层的数组
                    const tcode = obj[tagKey];
                    linkItem.select_value_items.forEach(sc =>{
                      if(tcode === +sc.select_code){
                        tArr.push([
                          sc.select_text,
                          obj[sc.link_item.item_key]
                        ])
                      }else if(typeof tcode === 'object'){  // 分段
                        tArr.push([
                          `${tcode.start_value} ~ ${tcode.end_value} ${linkItem.item_unit}`,
                          obj[linkItem.link_item.item_key]
                        ])
                      }
                    })
                  })
                  tagArr.push({vName,tArr});
                }
                vData.list = tagArr;
                console.log(vData);
              }else if(vData instanceof Array) {  // 如果是数组则将值代进去
                const selectValues = [];
                vData.forEach(code => {
                  name.select_value_items.forEach(sc =>{
                    if(code === +sc.select_code) selectValues.push(sc.select_text);
                  })
                })
                if(selectValues.length === 0) vData = '-';
                vData = selectValues.join('，');
              }

              // 如果是number则将值代进去
              if(typeof vData === 'number') {
                name.select_value_items.forEach(sc =>{
                  if(vData === +sc.select_code) vData = sc.select_text;
                })
              }

              arr[0] = name.item_label;
              arr[1] = vData || '-';
              arr[1] = unit ? arr[1] + unit : arr[1];  // 如果有单位就带上
              arr[2] = key;

              cellDuty.push(arr);
            });

            const dutyObj = {
              duty_list: cellDuty,
              duty_name: dName,
              duty_code: dCode,
            }
            insArr.push(dutyObj);
          })

          const insuranceData = {
            list: insArr,
            insurance_name: ins.insurance_type_name,
            insurance_model: insModels[ins.insurance_model],
            amount_of_insurance: InsAmount
          }
          viewArr.push(insuranceData);
        });

        return viewArr;
      }

      if(!payload.isGroup){
        insuranceTypes = valueData.data.insurance_types;
        viewData = dealWithData(insuranceTypes, nameArrByModel, insuranceModel);
      }else{
        groupLevels = valueData.data.group_levels;
        groupTit = {
          ...valueData.data,
          levelList: []
        }

        groupLevels.forEach(level => {
          const dArr = dealWithData(level.insurance_types, nameArrByModel, insuranceModel);
          groupTit.levelList.push(level.group_level_name);
          viewData.push(dArr);
        })
      }

      const dataObj = {
        viewData,
        groupTit
      }
      if (callback) {
        callback(dataObj);
      }
    },


    *getSingleProductItem({ payload, callback }, { call, put }) {
      const response = yield call(getSingleProductItem, payload);
      yield put({
        type: 'singleProductItem',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    *saveSingleProductItem({ payload, callback }, { call }) {
      const response = yield call(saveSingleProductItem, payload);
      if (callback) {
        callback(response);
      }
    },

    // 团单
    *queryGroupListAndCompany({ payload, callback }, { call }) {
      const GroupList = yield call(getGroupProductList, payload);
      const comList = yield call(getCompanyList, payload);

      const groupData = GroupList.data.list.map(item => {
        let company_name = '';
        comList.data.forEach(it => {
          if (item.company_code === it.company_code) {
            company_name = it.company_name;
          }
        });
        return {
          ...item,
          company_name,
        };
      });

      if (callback) {
        callback({
          groupData,
          totalElement: GroupList.data.total_element,
        });
      }
    },

    *getGroupProductItem({ payload, callback }, { call, put }) {
      const response = yield call(getGroupProductItem, payload);
      yield put({
        type: 'groupProductItem',
        payload: response,
      });
      if (callback) {
        callback(response);
      }
    },
    
    *saveGroupProductItem({ payload, callback }, { call }) {
      const response = yield call(saveGroupProductItem, payload);
      if (callback) {
        callback(response);
      }
    },

    // 自定义字段
    *queryFieldListAndCompany({ payload, callback }, { call }) {
      const fieldList = yield call(getCustomFieldList, payload);
      const comList = yield call(getCompanyList, payload);

      const groupData = fieldList.data.list.map(item => {
        let company_name = '';
        comList.data.forEach(it => {
          if (item.company_code === it.company_code) {
            company_name = it.company_name;
          }
        });
        return {
          ...item,
          company_name,
        };
      });

      if (callback) {
        callback({
          groupData,
          totalElement: fieldList.data.total_element,
        });
      }
    },

    *getFieldItem({ payload, callback }, { call }) {
      const response = yield call(getFieldItemById, payload);
      if (callback) {
        callback(response);
      }
    },
    *editFieldItem({ payload, callback }, { call }) {
      const response = yield call(editFieldItem, payload);
      if (callback) {
        callback(response);
      }
    },

    *checkTemplateCode({ payload, callback }, { call }) {
      const response = yield call(checkTemplateCode, payload);
      if (callback) {
        callback(response);
      }
    },
    
    *checkProductcode({ payload, callback }, { call }) {
      const response = yield call(checkProductcode, payload);
      if (callback) {
        callback(response);
      }
    },
    *checkPolicyId({ payload, callback }, { call }) {
      const response = yield call(checkPolicyId, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    saveCompanyList(state, action) {
      return {
        ...state,
        companyList: action.payload,
      };
    },
    saveInsuranceList(state, action) {
      return {
        ...state,
        insuranceList: action.payload,
      };
    },
    getInsuranceItem(state, action) {
      return {
        ...state,
        insuranceItem: action.payload,
      };
    },
    saveInsuranceFields(state, action) {
      return {
        ...state,
        insuranceConfigFields: action.payload,
      };
    },
    saveDutyFields(state, action) {
      return {
        ...state,
        dutyConfigFields: action.payload,
      };
    },
    singleProductList(state, action) {
      return {
        ...state,
        singleProductList: action.payload,
      };
    },
    singleProductItem(state, action) {
      return {
        ...state,
        singleProductItem: action.payload,
      };
    },
    groupProductItem(state, action) {
      return {
        ...state,
        groupProductItem: action.payload,
      };
    },
  },
};
