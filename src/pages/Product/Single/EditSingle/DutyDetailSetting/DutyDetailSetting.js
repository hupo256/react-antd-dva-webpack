/* eslint-disable react/no-did-mount-set-state,no-restricted-syntax,guard-for-in,no-lonely-if,react/no-array-index-key,no-unused-vars, no-nested-ternary,no-param-reassign,array-callback-return,prefer-destructuring,react/no-array-index-item,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */

import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Checkbox, Col, Form, Input, message, Modal, Radio, Row, Select, InputNumber } from 'antd';
import _ from 'lodash';
import styles from '../../../product.less';
import RangeInput from '../../../Insurance/EditInsurance/RangeInput/RangeInput';

const FormItem = Form.Item;
const Option = Select.Option;
const TextArea = Input.TextArea;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class DutyDetailSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dutyState: {},
      dutyFields: {},
    };
  }

  componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      dutyState: nextProps.dutyDetailSetting,
      dutyFields: nextProps.dutyDetailSetting.dutyFields,
    });
  }

  onSelectHandle = (value, index, options, item_key) => {
    const { dutyState, dutyFields } = this.state;
    const { dutyList } = dutyState;

    if (!options.every(item => item.link_item)) {
      dutyFields[item_key] = value;
    } else {
      if (item_key === 'pay_ratio_type') {
        dutyFields[item_key] = [];
        dutyFields[item_key] = {
          [item_key]: value,
        }
        console.log(dutyFields[item_key]);
      } else {
        if (dutyFields[item_key] && dutyFields[item_key].length) {
          dutyFields[item_key].push({
            [item_key]: value,
          });
        } else {
          dutyFields[item_key] = [];
          dutyFields[item_key].push({
            [item_key]: value,
          });
        }
      }
    }

    options.forEach(item => {
      if (item.link_item) {
        if (item.select_code === value) {
          dutyList[index].selectOptions.length = 0;
          const push = dutyList[index].selectOptions.push({ selectList: [] });
          dutyList[index].selectOptions[push - 1].selectList.push(item.link_item);
        }
      }
    });

    this.setState({
      dutyFields,
      dutyState,
    });
  };

  onSelectMultipleHandle = (value, index, options, item_key) => {
    const { dutyState, dutyFields } = this.state;
    const { dutyList } = dutyState;

    if (!options.every(item => item.link_item)) {
      if (dutyFields[item_key] && dutyFields[item_key].length) {
        dutyFields[item_key].push(value);
      } else {
        dutyFields[item_key] = [];
        dutyFields[item_key].push(value);
      }
    } else {
      if (dutyFields[item_key] && dutyFields[item_key].length) {
        dutyFields[item_key].push({
          [item_key]: value,
        });
      } else {
        dutyFields[item_key] = [];
        dutyFields[item_key].push({
          [item_key]: value,
        });
      }
    }

    options.forEach(item => {
      if (item.link_item) {
        if (item.select_code === value) {
          const push = dutyList[index].selectOptions.push({
            selectList: [],
            selectValueList: [],
            checkedValue: value,
          });
          item.link_item.selectItemLast = [];
          const copyLinkItem = _.cloneDeep(item.link_item);
          if (copyLinkItem.link_item) {
            copyLinkItem.link_item.item_value = [];
          }
          dutyList[index].selectOptions[push - 1].selectList.push(copyLinkItem);
        }
      }
    });

    this.setState({
      dutyFields,
      dutyState,
    });
  };

  // 二级下栏选择
  onSelectPublic = (value, index, selectIndex, xIndex, selectItemKey, itemKey) => {
    const { dutyState, dutyFields } = this.state;
    const { dutyList } = dutyState;
    if (dutyFields[itemKey][selectIndex][selectItemKey]) {
      if (dutyList[index].selectOptions[selectIndex].selectValueList.includes(value)) {
        message.error('有重复选项，请重新选择');
        return;
      }
      dutyFields[itemKey][selectIndex][selectItemKey].push({
        [selectItemKey]: value,
      });
      dutyList[index].selectOptions[selectIndex].selectValueList.push(value);
    } else {
      dutyFields[itemKey][selectIndex][selectItemKey] = [];
      dutyFields[itemKey][selectIndex][selectItemKey].push({
        [selectItemKey]: value,
      });
      dutyList[index].selectOptions[selectIndex].selectValueList.push(value);
    }

    this.setState({
      dutyFields,
      dutyState,
    });
  };

  // 删除选择
  onDeselectHandle = (value, index, item_key) => {
    const { dutyState, dutyFields } = this.state;
    const { dutyList } = dutyState;

    if (Array.isArray(dutyFields[item_key])) {
      dutyFields[item_key].forEach((item, arrIndex) => {
        if (typeof item === 'string') {
          if (item === value) {
            const valueIndex = dutyFields[item_key].indexOf(value);
            dutyFields[item_key].splice(valueIndex, 1);
          }
        } else {
          if (item[item_key] === value) {
            dutyFields[item_key].splice(arrIndex, 1);
          }
        }
      });
    }

    _.remove(dutyList[index].selectOptions, item => {
      return item.checkedValue === value;
    });

    console.log(dutyFields[item_key])
    
    this.setState({
      dutyState,
      dutyFields,
    });
  };

  // 多选删除
  onDeselectSecondHandle = (value, index, selectIndex, xIndex, itemKey, selectItemKey) => {
    const { dutyState, dutyFields } = this.state;
    const { dutyList } = dutyState;

    _.remove(dutyFields[itemKey][selectIndex][selectItemKey], item => {
      return item[selectItemKey] === value;
    });
    _.remove(dutyList[index].selectOptions[selectIndex].selectList[xIndex].selectItemLast, item => {
      return item.checkedValue === value;
    });

    this.setState({
      dutyState,
      dutyFields,
    });
  };

  // 一级Input
  inputOnChange = (e, item_key) => {
    if(!e && e !== 0) return false;
    const { dutyFields } = this.state;
    dutyFields[item_key] = e.target ? e.target.value : e;
    this.setState({
      dutyFields,
    });
  };

  secondInputChange = (e, selectIndex, selectItemKey, itemKey) => {
    const { dutyFields } = this.state;

    dutyFields[itemKey] = Object.assign(dutyFields[itemKey], {[selectItemKey] : +e.target.value})
    console.log(dutyFields[itemKey])

    this.setState({
      dutyFields,
    });
  };

  multipleInputChange = (e, selectIndex, xIndex, selectItemKey, itemKey) => {
    const { dutyFields } = this.state;

    if (!dutyFields[itemKey]) {
      dutyFields[itemKey] = [{ [itemKey]: [] }];
    }
    if (!dutyFields[itemKey][selectIndex][itemKey][xIndex]) {
      dutyFields[itemKey][selectIndex][itemKey].push({
        [selectItemKey]: e.target.value,
      });
    }
    dutyFields[itemKey][selectIndex][itemKey][xIndex] = {
      [selectItemKey]: e.target.value,
    };

    this.setState({
      dutyFields,
    });
  };

   // 多选 特殊限额定义
   onSecondSelect = (value, select, index, selectIndex, xIndex, selectItemKey, itemKey) => {
    const { dutyState, dutyFields } = this.state;
    const { dutyList } = dutyState;
    if(Array.isArray(dutyFields[itemKey])){
      if (dutyFields[itemKey][selectIndex][selectItemKey]) {
        dutyFields[itemKey][selectIndex][selectItemKey].push({[selectItemKey]: value});
      } else {
        dutyFields[itemKey][selectIndex][selectItemKey] = [];
        dutyFields[itemKey][selectIndex][selectItemKey].push({[selectItemKey]: value});
      }
    } else {
      if (dutyFields[itemKey][selectItemKey]) {
        dutyFields[itemKey][selectItemKey].push({[selectItemKey]: value});
      } else {
        dutyFields[itemKey][selectItemKey] = [];
        dutyFields[itemKey][selectItemKey].push({[selectItemKey]: value});
      }
    }
    
    console.log(dutyFields[itemKey])
    select.select_value_items.forEach(item => {
      if (item.link_item) {
        if (item.select_code === value) {
          dutyList[index].selectOptions[selectIndex].selectList[xIndex].selectItemLast.push({
            linkItem: item.link_item,
            checkedValue: value,
          });
        }
      }
    });
    this.setState({ dutyState, dutyFields});
  };

  // 最后一级Input
  lastInputChange = (e,selectIndex,xIndex,lastItemKey,selectItemKey,itemKey,lastIndex, model) => {
    const { dutyFields } = this.state;
    const value = +e.target.value;
    if (model === 'selectMultiple') {
      if(itemKey === 'pay_ratio_type') {
        dutyFields[itemKey][selectItemKey][lastIndex][lastItemKey] = value;
      }else if (dutyFields[itemKey][selectIndex][selectItemKey]) {
        dutyFields[itemKey][selectIndex][selectItemKey][lastIndex][lastItemKey] = value;
      }
    } else {
      if (itemKey === 'pay_ratio_label') {
        if (dutyFields[itemKey][selectIndex][itemKey]) {
          dutyFields[itemKey][selectIndex][itemKey][xIndex][lastItemKey] = value;
        }
      } else if(itemKey === 'pay_ratio_type') {
        dutyFields[itemKey][selectItemKey][xIndex].pay_ratio = value;
      }else {
        if (dutyFields[itemKey][selectIndex][selectItemKey]) {
          dutyFields[itemKey][selectIndex][selectItemKey][xIndex][lastItemKey] = value;
        }
      }
    }
    console.log(dutyFields[itemKey]);
    this.setState({
      dutyFields,
    });
  };

  // 分段 start
  handleNumberStartChange = (e, selectIndex, xIndex, selectItemKey, itemKey) => {
    console.log(selectIndex, xIndex, selectItemKey, itemKey);
    const { dutyFields } = this.state;
    if (!dutyFields[itemKey][selectItemKey]) {
      dutyFields[itemKey][selectItemKey] = [];
    }
    dutyFields[itemKey][selectItemKey][xIndex] = {
      [selectItemKey]: {
        start_value: +e.target.value,
        start_include: true,
        end_value: 0,
        end_include: true,
      },
    };
    
    console.log(dutyFields[itemKey]);
    this.setState({
      dutyFields,
    });
  };

  // 分段 end
  handleNumberEndChange = (e, selectIndex, xIndex, selectItemKey, itemKey) => {
    const { dutyFields } = this.state;
    dutyFields[itemKey][selectItemKey][xIndex][selectItemKey].end_value = +e.target.value;

    console.log(dutyFields[itemKey]);
    this.setState({
      dutyFields,
    });
  };

  // 单选
  radioOnChange = (e, item_key) => {
    const { dutyFields } = this.state;
    dutyFields[item_key] = e.target.value;
    this.setState({
      dutyFields,
    });
  };

  // 增加
  onPlusButton = (index, selectIndex, xIndex, select) => {
    const { dutyState } = this.state;
    const { dutyList } = dutyState;
    const copySelect = _.cloneDeep(select);
    copySelect.item_value = [];
    copySelect.link_item.item_value = [];
    dutyList[index].selectOptions[selectIndex].selectList.push(copySelect);
    this.setState({
      dutyState,
    });
  };

  // 减少
  onMinusButton = (itemKey, selectItemKey, index, sIndex, xIndex) => {
    console.log(itemKey, selectItemKey, index, sIndex, xIndex);
    const { dutyState, dutyFields } = this.state;
    const { dutyList } = dutyState;

    if(Array.isArray(dutyFields[itemKey])){
      dutyFields[itemKey][sIndex][selectItemKey].splice(xIndex, 1);
      dutyList[index].selectOptions[sIndex].selectList.splice(xIndex, 1);
      if (dutyList[index].selectOptions[sIndex].selectValueList) {
        dutyList[index].selectOptions[sIndex].selectValueList.splice(xIndex, 1);
      }
    } else {
      console.log(dutyFields[itemKey]);
      dutyFields[itemKey][selectItemKey].splice(xIndex, 1);
      dutyList[index].selectOptions[0].selectList.splice(xIndex, 1);
      if (dutyList[index].selectOptions[0].selectValueList) {
        dutyList[index].selectOptions[0].selectValueList.splice(xIndex, 1);
      }
    }

    this.setState({
      dutyState,
      dutyFields,
    });
  };

  percentageValidator = (rule, value, callback, unit) => {
    if ((unit === '%' || unit === '元') && value && value !== 0) {
      if (+value > 100 && unit === '%') callback('比例不能大于100');
      if (!+value) callback('请输入有效数字');
    }
    callback();
  }

  render() {
    const { isShowDetailSetting, handleDetailSave, handleDetailCancel } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { dutyState, dutyFields } = this.state;
    const { dutyTitle, insIndex, sdlIndex, dutyList = [] } = dutyState;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <Modal
        title={`责任${sdlIndex + 1} ${dutyTitle} 详细配置`}
        visible={isShowDetailSetting}
        width={1400}
        maskClosable={false}
        onCancel={() => handleDetailCancel(dutyFields, insIndex, sdlIndex)}
        footer={[
          <Button
            className={styles.cusModalButton}
            key="submit"
            onClick={() => handleDetailSave(dutyFields, insIndex, sdlIndex)}
          >
            保存
          </Button>,
        ]}
      >
        <div className={styles.cusModalBody}>
          {dutyList.map((item, index) => {
            let fieldItem = null;
            let initialValue = '';
            switch (`${item.item_model}`) {
              case 'input':
                if (item.item_unit) {
                  const itype = item.item_type;
                  fieldItem = itype > 2 ? 
                    <Input
                      placeholder={item.item_label}
                      addonAfter={item.item_unit}
                      style={{ width: '100%' }}
                      onChange={e => this.inputOnChange(e, item.item_key)}
                    /> :
                    <InputNumber 
                      min={0} 
                      style={{ width: '90%' }}
                      onChange={e => this.inputOnChange(e, item.item_key)}
                    /> 
                } else {
                  const itype = item.item_type;
                  fieldItem = itype > 2 ? 
                    <Input
                      onChange={e => this.inputOnChange(e, item.item_key)}
                      placeholder={item.item_label}
                      style={{ width: '100%' }}
                    /> :
                    <InputNumber 
                      min={0} 
                      style={{ width: '90%' }}
                      onChange={e => this.inputOnChange(e, item.item_key)}
                    />   
                }
                initialValue = item.item_value[0];
                break;
              case 'checkbox':
                const checkboxOptions = [];
                item.select_value_items.forEach(forItem => {
                  checkboxOptions.push({
                    label: forItem.select_text,
                    value: forItem.select_code,
                  });
                });
                initialValue = item.item_value;
                fieldItem = (
                  <CheckboxGroup
                    options={checkboxOptions}
                    onChange={e => {
                      this.checkBoxOnChange(e, item.item_key);
                    }}
                  />
                );
                break;
              case 'radio':
                const radioOptions = [];
                item.select_value_items.forEach(forItem => {
                  radioOptions.push({
                    label: forItem.select_text,
                    value: forItem.select_code,
                  });
                });
                initialValue = item.item_value[0];
                fieldItem = (
                  <RadioGroup
                    options={radioOptions}
                    onChange={e => {
                      this.radioOnChange(e, item.item_key);
                    }}
                  />
                );
                break;
              case 'select':
                const selectOptions = [];
                item.select_value_items.forEach(forItem => {
                  selectOptions.push(
                    <Option value={forItem.select_code} key={forItem.select_code}>
                      {forItem.select_text}
                    </Option>
                  );
                });
                initialValue = item.item_value[0];
                fieldItem = (
                  <Select
                    style={{ width: '100%' }}
                    onSelect={value =>
                      this.onSelectHandle(value, index, item.select_value_items, item.item_key)
                    }
                  >
                    {selectOptions.map(opts => opts)}
                  </Select>
                );
                break;
              case 'selectMultiple':
                const selectMulOptions = [];
                item.select_value_items.forEach(forItem => {
                  selectMulOptions.push(
                    <Option value={+forItem.select_code} key={forItem.select_code}>
                      {forItem.select_text}
                    </Option>
                  );
                });
                initialValue = item.item_value;
                fieldItem = (
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    onSelect={value =>this.onSelectMultipleHandle(value,index,item.select_value_items,item.item_key)}
                    onDeselect={value => this.onDeselectHandle(value, index, item.item_key)}
                  >
                    {selectMulOptions.map(opts => opts)}
                  </Select>
                );
                break;
              case 'range':
                initialValue = {
                  start_value: `${item.range_value_item.start_value}`,
                  end_value: `${item.range_value_item.end_value}`,
                };
                fieldItem = (
                  <RangeInput
                    item_unit={`${item.item_unit}`}
                    connect_text={`${item.range_value_item.connect_text}`}
                    start_value={`${item.range_value_item.start_value}`}
                    end_value={`${item.range_value_item.end_value}`}
                  />
                );
                break;
              case 'textArea':
                initialValue = item.item_value;
                fieldItem = (
                  <TextArea
                    autosize={{ minRows: 2 }}
                    placeholder={item.item_label}
                    onChange={e => this.inputOnChange(e, item.item_key)}
                  />
                );
                break;
              case 'label':
                initialValue = '';
                fieldItem = <Input style={{ display: 'none' }} />;
                break;
              default:
                fieldItem = <Input placeholder={item.item_label} />;
            }
            return (
              <div className="setting-item" key={`${item.item_label}${index}`}>
                <Row>
                  <Col span={8}>
                    <FormItem {...formItemLayout} label={item.item_label}>
                      {getFieldDecorator(`${item.item_key}`, {
                        rules: [
                          {
                            required: item.is_required,
                            message: `${item.item_label}不能为空！`,
                          },
                          { 
                            validator: (rule, value, callback) => 
                            this.percentageValidator(rule, value, callback, item.item_unit) 
                          }
                        ],
                        initialValue,
                      })(fieldItem)}
                      {item.item_type < 3 && item.item_unit}
                    </FormItem>
                  </Col>
                  <Col span={16}>
                    {item.selectOptions &&
                      item.selectOptions.map((selectItem, selectIndex) => {
                        return (
                          <Row key={`select${selectIndex}`}>
                            {selectItem.selectList.length > 0 &&
                              selectItem.selectList.map((select, xIndex) => {
                                const selectOptions = [];
                                let isAddable = false;
                                if (select.is_addable) {
                                  isAddable = true;
                                } else {
                                  isAddable = false;
                                }
                                const mode = select.item_model;
                                let selectMode = '';
                                if (mode === 'selectMultiple') {
                                  selectMode = 'multiple';
                                } else {
                                  selectMode = 'select';
                                }
                                let selectFieldItems = '';
                                const selectItemLast = select.selectItemLast ? [...select.selectItemLast] : [];
                                select.selectItemLast = [];
                                if (select.item_key === 'pay_balance') {
                                  selectFieldItems = (
                                    <Input
                                      placeholder={select.item_label}
                                      addonAfter={select.item_unit}
                                      style={{ width: '100%' }}
                                      onChange={e => {
                                        this.secondInputChange(
                                          e,
                                          selectIndex,
                                          select.item_key,
                                          item.item_key
                                        );
                                      }}
                                    />
                                  );
                                } else if (select.item_key === 'pay_ratio_segment') {
                                  select.selectItemLast.push({
                                    linkItem: select.link_item,
                                    checkedValue: '',
                                  });
                                  selectFieldItems = (
                                    <span style={{ textAlign: 'right' }}>
                                      <span style={{ paddingRight: '10px', lineHeight: '40px' }}>
                                        <em style={{ color: 'red', fontStyle: 'normal' }}>*</em>
                                        {select.item_label}
                                      </span>
                                      <span>
                                        <Input
                                          type="number"
                                          onChange={e => {
                                            this.handleNumberStartChange(e,selectIndex, xIndex, select.item_key, item.item_key);
                                          }}
                                          style={{ width: '100px', marginRight: '3%' }}
                                          addonAfter={select.item_unit}
                                          defaultValue={select.item_value.start_value}
                                        />
                                        <span style={{ paddingRight: '3%' }}>
                                          {select.range_value_item.connect_text}
                                        </span>
                                        <Input
                                          type="number"
                                          onChange={e => {
                                            this.handleNumberEndChange(e, selectIndex, xIndex,select.item_key,item.item_key);
                                          }}
                                          addonAfter={select.item_unit}
                                          style={{ width: '100px', marginRight: '3%' }}
                                          defaultValue={select.item_value.end_value}
                                        />
                                      </span>
                                    </span>
                                  );
                                } else if (
                                  select.item_key === 'special_limit_definition' ||
                                  select.item_key === 'settlement_type' ||
                                  select.item_key === 'social_security_type'
                                ) {
                                  select.select_value_items.forEach(forItem => {
                                    selectOptions.push(
                                      <Option value={forItem.select_code} key={forItem.select_code}>
                                        {forItem.select_text}
                                      </Option>
                                    );
                                  });
                                  select.selectItemLast = selectItemLast;
                                  selectFieldItems = (
                                    <Select
                                      style={{ width: '100%' }}
                                      mode={selectMode}
                                      onSelect={value => this.onSecondSelect( value,select,index, selectIndex, xIndex,select.item_key,item.item_key)}
                                      onDeselect={value => this.onDeselectSecondHandle(value,index,selectIndex,xIndex,item.item_key,select.item_key)
                                      }
                                    >
                                      {selectOptions.map(opts => opts)}
                                    </Select>
                                  );
                                } else if (select.item_key === 'pay_ratio_level') {
                                  select.selectItemLast.push({
                                    linkItem: select.link_item,
                                    checkedValue: '',
                                  });
                                  selectFieldItems = (
                                    <Input
                                      placeholder={select.item_label}
                                      addonAfter={select.item_unit}
                                      style={{ width: '100%' }}
                                      onChange={e => this.multipleInputChange(e, selectIndex,xIndex,select.item_key,item.item_key)}
                                    />
                                  );
                                } else {
                                  select.select_value_items.forEach(forItem => {
                                    selectOptions.push(
                                      <Option value={forItem.select_code} key={forItem.select_code}>
                                        {forItem.select_text}
                                      </Option>
                                    );
                                  });
                                  select.selectItemLast.push({
                                    linkItem: select.link_item,
                                    checkedValue: '',
                                  });
                                  selectFieldItems = (
                                    <Select
                                      style={{ width: '100%' }}
                                      mode={selectMode}
                                      onSelect={value => {
                                        this.onSelectPublic(
                                          value,
                                          index,
                                          selectIndex,
                                          xIndex,
                                          select.item_key,
                                          item.item_key
                                        );
                                      }}
                                    >
                                      {selectOptions.map(opts => opts)}
                                    </Select>
                                  );
                                }
                                return (
                                  <Row key={`${select.item_label}${xIndex}`}>
                                    <Col span={16}>
                                      <Row>
                                        <Col span={20} style={{ textAlign: 'right' }}>
                                          {select.item_key === 'pay_ratio_segment' ? (
                                            selectFieldItems
                                          ) : (
                                            <FormItem
                                              {...formItemLayout}
                                              label={`${select.item_label}`}
                                            >
                                              {getFieldDecorator(`${select.item_key}${xIndex}`, {
                                                rules: [
                                                  {
                                                    required: select.is_required,
                                                    message: `${select.item_label}不能为空！`,
                                                  },
                                                  { 
                                                    validator: (rule, value, callback) => 
                                                    this.percentageValidator(rule, value, callback, select.item_unit) 
                                                  }
                                                ],
                                                initialValue: select.item_value,
                                              })(selectFieldItems)}
                                            </FormItem>
                                          )}
                                        </Col>
                                        {isAddable && (
                                          <Col span={4}>
                                            {selectItem.selectList.length > 1 && (
                                              <Button
                                                shape="circle"
                                                size="small"
                                                icon="minus"
                                                className={styles.btnRoundMinus}
                                                onClick={() => {
                                                  this.onMinusButton(
                                                    item.item_key,
                                                    select.item_key,
                                                    index,
                                                    selectIndex,
                                                    xIndex
                                                  );
                                                }}
                                              />
                                            )}
                                            {xIndex === 0 && (
                                              <Button
                                                shape="circle"
                                                size="small"
                                                icon="plus"
                                                className={styles.btnRoundPlus}
                                                onClick={() => {
                                                  this.onPlusButton(
                                                    index,
                                                    selectIndex,
                                                    xIndex,
                                                    select
                                                  );
                                                }}
                                              />
                                            )}
                                          </Col>
                                        )}
                                      </Row>
                                    </Col>
                                    <Col span={8}>
                                      {select.selectItemLast.map((lastItem, lastIndex) => {
                                        if (!Array.isArray(lastItem)) {
                                          return (
                                            <Row key={`${lastItem.linkItem.item_label}${lastIndex}`}>
                                              <Col>
                                                <FormItem {...formItemLayout} label={`${lastItem.linkItem.item_label}`}>
                                                  {getFieldDecorator(`${lastItem.linkItem.item_key}${xIndex}${lastIndex}`,
                                                    {
                                                      rules: [{
                                                        required: lastItem.linkItem.is_required,
                                                        message: `${lastItem.linkItem.item_label}不能为空！`,
                                                      },
                                                      { 
                                                        validator: (rule, value, callback) => 
                                                        this.percentageValidator(rule, value, callback, lastItem.linkItem.item_unit) 
                                                      }],
                                                      initialValue: lastItem.linkItem.item_value,
                                                    }
                                                  )(
                                                    lastItem.linkItem.item_unit ? (
                                                      <Input
                                                        placeholder={lastItem.linkItem.item_label}
                                                        addonAfter={lastItem.linkItem.item_unit}
                                                        style={{ width: '100%' }}
                                                        onChange={e =>
                                                          this.lastInputChange(e,selectIndex, xIndex,lastItem.linkItem.item_key,select.item_key,item.item_key,lastIndex,select.item_model)
                                                        }
                                                      />
                                                    ) : (
                                                      <Input
                                                        placeholder={lastItem.linkItem.item_label}
                                                        style={{ width: '100%' }}
                                                        onChange={e =>
                                                          this.lastInputChange(e,selectIndex, xIndex,lastItem.linkItem.item_key,select.item_key,item.item_key,lastIndex,select.item_model)
                                                        }
                                                      />
                                                    )
                                                  )}
                                                </FormItem>
                                              </Col>
                                            </Row>
                                          );
                                        }
                                        return '';
                                      })}
                                    </Col>
                                  </Row>
                                );
                              })}
                          </Row>
                        );
                      })}
                  </Col>
                </Row>
              </div>
            );
          })}
        </div>
      </Modal>
    );
  }
}

export default DutyDetailSetting;
