/* eslint-disable prefer-destructuring,react/destructuring-assignment */
import React from 'react';
import _ from 'lodash';
import { Col, Form, Select, Input, Checkbox, Radio, InputNumber, message, Modal, Icon} from 'antd';
import RangeInput from '../../Insurance/EditInsurance/RangeInput/RangeInput';
import styles from './CreactDutyList.less';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 7 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export function CreactDutyList (config) {
  const { list, getFieldDecorator, onchange, postfix = '', indexArr, inpValidator } = config;
  let fieldItem = null;
  let initialValue = '';
  const itype = list.item_type;
  const key = list.item_key;
  const ivalue = list.item_value;
  const options = [];
  const rules = [{
    required: list.is_required,
    message: `${list.item_label}不能为空！`
  }];
  if((key === 'duty_name' || key === 'duty_code') && inpValidator) {
    rules.push({
      validator: (rule, value, callback) => inpValidator(rule, value, callback, key)
    })
  }
  switch (`${list.item_model}`) {
    case 'input':
      if (list.item_unit) {
        fieldItem = itype > 2 ? 
          <Input onChange={onchange} placeholder={list.item_label} addonAfter={list.item_unit} /> : 
          <InputNumber min={0} onChange={onchange} /> 
      } else {
        fieldItem = itype > 2 ? 
          <Input onChange={onchange} placeholder={list.item_label} /> :
          <InputNumber min={0} onChange={onchange} />
      }
      
      initialValue = ivalue ? ivalue[0] : -1;
      break;
    case 'checkbox':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          options.push({
            label: forItem.select_text,
            value,
          });
        }
      );
      initialValue = ivalue;
      fieldItem =  <CheckboxGroup onChange={onchange} options={options} />
      break;
    case 'radio':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          options.push({
            label: forItem.select_text,
            value,
          });
        }
      );
      initialValue = ivalue;
      fieldItem =  <RadioGroup onChange={onchange} options={options}  />
      break;
    case 'select':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          options.push(
            <Option value={value} list={forItem.select_code} key={forItem.select_code}>
              {forItem.select_text}
            </Option>
          );
        }
      );
      initialValue = ivalue || null;
      fieldItem = (
        <Select onChange={onchange}>
          {options.map(opts => opts)}
        </Select>
      );
      break;
    case 'selectMultiple':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          options.push(
            <Option value={value} list={forItem.select_code} key={forItem.select_code}>
              {forItem.select_text}
            </Option>
          );
        }
      ); 
      initialValue = ivalue;
      fieldItem =  (
        <Select mode="multiple" onChange={onchange}>
          {options.map(opts => opts)}
        </Select>);
      if (key === 'ill_disclaim'){
        fieldItem = (
          <Select mode="multiple" open={false} onFocus={e => onchange(e, indexArr)}>
            {options.map(opts => opts)}
          </Select>)
      }
      if (key === 'exclude_hospitals' || key === 'extend_hospitals') {
        initialValue = ivalue.length>0 ? `共${ivalue.length}家` : '';
        fieldItem = 
          <Input
            className={styles.inpHospitals}
            onFocus={e => onchange(e, indexArr, key, "0")}
            suffix={<Icon onClick={e => onchange(e, indexArr, key)} type="plus-square" />}
          />
      }
      break;
    case 'range':
      initialValue = { 
        start_value: +list.range_value_item.start_value,
        end_value: +list.range_value_item.end_value,
      };
      fieldItem = (
        <RangeInput 
          onChange={onchange} 
          item_unit={`${list.item_unit}`} 
          connect_text={`${list.range_value_item.connect_text }`}
          start_value={+list.range_value_item.start_value}
          end_value={+list.range_value_item.end_value}
        />
      );
      break;
    default:
      fieldItem = (
        <Input placeholder={list.item_label} onChange={onchange} />
      );
  }
  return (
    <Col span={12} key={key}>
      <FormItem {...formItemLayout} label={list.item_label}>
        {getFieldDecorator( 
          `${key}${postfix}`, 
          {rules,initialValue}
        )(fieldItem)}
        {list.item_type < 3 && list.item_unit}
      </FormItem>
    </Col>
  );
}

export function CreactDutyListForIns (list, getFieldDecorator, layout, onchange, index=0, postfix = '_relDuty', inpValidator) {
  let fieldItem = null;
  let initialValue = '';
  const itype = list.item_type;
  const key = list.item_key;
  const ivalue = list.item_value;
  const checkboxOptions = [];
  const radioOptions = [];
  const selectOptions = [];
  const selectMulOptions = [];
  const rules = [{
    required: list.is_required,
    message: `${list.item_label}不能为空！`
  }];
  if(key === 'duty_name' || key === 'duty_code') {
    rules.push({
      validator: (rule, value, callback) => inpValidator(rule, value, callback, key)
    })
  }

  switch (`${list.item_model}`) {
    case 'input':
      if (list.item_unit) {
        fieldItem = itype > 2 ? 
          <Input onChange={e => onchange(e, index, key)} placeholder={list.item_label} addonAfter={list.item_unit} /> : 
          <InputNumber min={0} onChange={e => onchange(e, index, key)} /> 
      } else {
        fieldItem = itype > 2 ? 
          <Input onChange={e => onchange(e, index, key)} placeholder={list.item_label} /> :
          <InputNumber min={0} onChange={e => onchange(e, index, key)} />
      }
      
      initialValue = ivalue instanceof Array ? ivalue[0] : ivalue;
      break;
    case 'checkbox':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          checkboxOptions.push({
            label: forItem.select_text,
            value,
          });
        }
      );
      initialValue = ivalue;
      fieldItem =  <CheckboxGroup onChange={e => onchange(e, index, key)} options={checkboxOptions} />
      break;
    case 'radio':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          radioOptions.push({
            label: forItem.select_text,
            value,
          });
        }
      );
      initialValue = ivalue;
      fieldItem =  <RadioGroup onChange={e => onchange(e, index, key)} options={radioOptions}  />
      break;
    case 'select':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          selectOptions.push(
            <Option value={value} list={forItem.select_code} key={forItem.select_code}>
              {forItem.select_text}
            </Option>
          );
        }
      );
      initialValue = ivalue || null;
      fieldItem = (
        <Select onChange={e => onchange(e, index, key)}>
          {selectOptions.map(opts => opts)}
        </Select>
      );
      break;
    case 'selectMultiple':
      list.select_value_items.forEach(
        forItem => {
          const value = list.item_type > 2 ? forItem.select_code : +forItem.select_code;
          selectMulOptions.push(
            <Option value={value} list={forItem.select_code} key={forItem.select_code}>
              {forItem.select_text}
            </Option>
          );
        }
      );
      initialValue = ivalue;
      fieldItem =  (
        <Select mode="multiple" onChange={e => onchange(e, index, key)}>
          {selectMulOptions.map(opts => opts)}
        </Select>);
      if (key === 'ill_disclaim' || key === 'exclude_hospitals' || key === 'extend_hospitals'){
        fieldItem = (
          <Select mode="multiple" open={false} onFocus={e => onchange(e, index)}>
            {selectMulOptions.map(opts => opts)}
          </Select>)
      }
      break;
    case 'range':
      initialValue = { 
        start_value: +list.range_value_item.start_value,
        end_value: +list.range_value_item.end_value,
      };
      fieldItem = (
        <RangeInput 
          onChange={e => onchange(e, index, key)} 
          item_unit={`${list.item_unit}`} 
          connect_text={`${list.range_value_item.connect_text }`}
          start_value={+list.range_value_item.start_value}
          end_value={+list.range_value_item.end_value}
        />
      );
      break;
    default:
      fieldItem = (
        <Input placeholder={list.item_label} onChange={e => onchange(e, index, key)} />
      );
  }
  return (
    <Col span={12} key={key}>
      <FormItem {...layout} label={list.item_label}>
        {getFieldDecorator( `${key}${postfix}`, {
            rules,
            initialValue,
          }
        )(fieldItem)}
        {list.item_type < 3 && list.item_unit}
      </FormItem>
    </Col>
  );
}

// 转成labelName
export function refactoringDutyList (activeInsuranceItem, activeInsuranceItemFields) {
  const displayDutyList = [];
  const tempDisplayDutyList = JSON.parse(JSON.stringify(activeInsuranceItemFields));
  tempDisplayDutyList.forEach(dutyItem => {
    const key = dutyItem.item_key;
    const tempArray = [];
    let actVal = activeInsuranceItem[key];
    if (key.includes('_hospitals')){
      actVal = activeInsuranceItem[key];
    }
    if (key && dutyItem.item_label) {
      switch (dutyItem.item_model) {
        case 'input':
          displayDutyList.push({
            labelName: dutyItem.item_label,
            labelNameValue: actVal ? `${actVal}${dutyItem.item_unit}`: '',
          });
          break;
        case 'select':
        case 'radio':
        case 'checkbox':
        case 'selectMultiple':
          if (Array.isArray(actVal)) {
            const tepArr = _.cloneDeep(actVal);
            if(key === 'ill_disclaim' && tepArr.length > 3) tepArr.length = 4;
            if (key.includes('_hospitals')) {
              tempArray.push(`共${tepArr.length}家`);
            } else {
              tepArr.forEach((items,ind) => {
                dutyItem.select_value_items.forEach(selectItem => {
                  if (+selectItem.select_code === items) {
                    if(key === 'ill_disclaim' && ind ===3){
                      tempArray.push(' ...');
                    }else{
                      tempArray.push(selectItem.select_text);
                    }
                  }
                });
              });
            }
          } else {
            dutyItem.select_value_items.forEach(selectItem => {
              if (+selectItem.select_code === actVal) {
                tempArray.push(selectItem.select_text);
              }
            });
          }

          displayDutyList.push({
            labelName: dutyItem.item_label,
            labelNameValue: tempArray.join(),
          });
          break;
        default:
          console.log('error');
      }
    }
  });

  return displayDutyList;
};

// 重组duty_list
export function getDutyFields (config) {
  const { dispatch, activeItem, insIndex, groupIndex} = config;
  const listName = config.groupIndex ? 'groupLevels' : 'insuranceTypes';
  const dyList = config[listName];

  dispatch({
    type: 'product/queryDutyConfigFields',
    payload: {
      company_code: config.company_code,
      item_subcategory: activeItem ? activeItem.insurance_model : '',
      item_category: 'duty',
    },
    callback: res => {
      if (res.status === 1) {
        const sdlList = [];
        activeItem.duty_list.forEach(item => {
          const bb = refactoringDutyList(item, res.data);
          const cc = bb.filter(value => value.labelName !== '责任名称' && value.labelName !== '责任代码')
          const dd = bb.filter(value => value.labelName === '责任名称' || value.labelName === '责任代码')
          sdlList.push({
            title: dd,
            list: cc,
            id: Date.now(),
          });
        });

        if(!groupIndex){
          dyList[insIndex] = activeItem;
          dyList[insIndex].dutyList = sdlList;
        }else{
          dyList[groupIndex].insurance_types[insIndex] = activeItem;
          dyList[groupIndex].insurance_types[insIndex].dutyList = sdlList;
        }
          

        config.toSet(dyList);
      } else {
        message.error(res.message);
      }
    }
  });
};

// 重组数组
export function refactoringFn (fromArray){
  const toArray = [];
  for (let i = 0; i < fromArray.length; i += 2) {
    toArray.push({ cols: [...fromArray.slice(i, i + 2)], colsId: `colsId${i}` });
  }
  return toArray;
};

// 设置责任标题
export function setDutyTitle (sdlItem, sdlIndex){
  const duty = sdlItem.title.map(titleItem => `${titleItem.labelNameValue} `)

  return `责任${sdlIndex + 1}: ${duty}`;
};

// 删除对象中为空为NULL的属性
export function getFullValue (valueData){
  const valueObj = {}
  Object.keys(valueData).forEach(key => {
    if(valueData[key]) {
      if(valueData[key] !== 0){
        valueObj[key] = valueData[key];
      }
      if((valueData[key] instanceof Array) && valueData[key].length > 0){
        valueObj[key] = valueData[key];
      }
    };
  });

  return valueObj;
};

// 过滤需要提交的值 
export function filterValues (dataList){
  dataList.forEach(data => {
    const ageAt = data.age_at_issue;
    if(ageAt){
      ageAt.end_value = +ageAt.end_value;
      ageAt.start_value = +ageAt.start_value;
    }

    if(!data.duty_list || data.duty_list.length === 0) return false;
    const dutys = [];
    data.duty_list.forEach(duty => {
      const dutyDatd = {};
      Object.keys(duty).forEach(key => {
        if(duty[key] || duty[key] === 0 ) {
          if ((duty[key] instanceof Array) && duty[key].length === 0) return false;
          dutyDatd[key] = duty[key];
        }
      });
      dutys.push(dutyDatd);   // 组成新的dutylist
    })

    data.duty_list = dutys;
  })

  return dataList;
}

// 转换 select_code 为 number 
export function selectToNumber (dataList){
  dataList.forEach(item => {
    const itype = item.item_type;
    const selectArr = item.select_value_items;
    function trunNumber (obj) {
      const type = obj.item_type;
      const arr = obj.select_value_items;
      if ((type < 3 ) && arr && arr.length > 0) {
        arr.forEach( sel => { 
          sel.select_code = sel.select_code  === '' ? '' : +sel.select_code;
          if(sel.link_item) trunNumber(sel.link_item);
        })
      }
    }

    if ((itype < 3 )  && selectArr && selectArr.length > 0) {
      selectArr.forEach( select => {
        select.select_code = select.select_code  === '' ? '' : +select.select_code;
        if(select.link_item) trunNumber(select.link_item)
      })
    }
  })
}

function goBackChange(itemPath, props) {
  Modal.confirm({
    title: '提示',
    content: '离开页面后，所有编辑的数据将丢失，确认离开此页面？',
    okText: '离开',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => {
      localStorage.setItem('productEditing', 0);
      props.history.push(itemPath);
    },
    onCancel: () => {
      console.log('Cancel');
    },
  });
}

export function onLinkClick(e, url, props) {
  e.preventDefault();
  const num = +localStorage.getItem('productEditing');
  if (num){
    e.preventDefault();
    goBackChange(url, props);
  }
}

export default CreactDutyList;
