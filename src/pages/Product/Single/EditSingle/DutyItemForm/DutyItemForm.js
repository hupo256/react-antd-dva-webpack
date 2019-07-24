/* eslint-disable react/no-did-mount-set-state,no-unused-state,no-nested-ternary,no-param-reassign,array-callback-return,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */
import React, { Component } from 'react';
import { Input, Form, Select, Col, Row, Checkbox, Radio, Button } from 'antd';
import RangeInput from '../../../Insurance/EditInsurance/RangeInput/RangeInput';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

export default class DutyItemForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  saveDutyForm = () => {
    const { saveHandleOk } = this.props;
    saveHandleOk();
  };

  render() {
    const { item } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };

    return (
      <div>
        <Button type="primary" onClick={this.saveDutyForm}>
          保存
        </Button>
        <Form>
          <Row key={Math.random()}>
            {item.cols.map(key => {
              let fieldItem = null;
              let initialValue = '';
              switch (`${key.item_model}`) {
                case 'input':
                  if (key.item_unit) {
                    fieldItem = (
                      <Input
                        onChange={this.formIsTouched}
                        placeholder={key.item_label}
                        addonAfter={key.item_unit}
                      />
                    );
                  } else {
                    fieldItem = <Input placeholder={key.item_label} />;
                  }
                  initialValue = key.item_value[0];
                  break;
                case 'checkbox':
                  const checkboxOptions = [];
                  key.select_value_items.forEach(forItem => {
                    checkboxOptions.push({
                      label: forItem.select_text,
                      value: forItem.select_code,
                    });
                  });
                  initialValue = key.item_value;
                  fieldItem = (
                    <CheckboxGroup onChange={this.formIsTouched} options={checkboxOptions} />
                  );
                  break;
                case 'radio':
                  const radioOptions = [];
                  key.select_value_items.forEach(forItem => {
                    radioOptions.push({
                      label: forItem.select_text,
                      value: forItem.select_code,
                    });
                  });
                  initialValue = key.item_value[0];
                  fieldItem = <RadioGroup onChange={this.formIsTouched} options={radioOptions} />;
                  break;
                case 'select':
                  const selectOptions = [];
                  key.select_value_items.forEach(forItem => {
                    selectOptions.push(
                      <Option value={forItem.select_code} key={forItem.select_code}>
                        {forItem.select_text}
                      </Option>
                    );
                  });
                  initialValue = key.item_value[0];
                  fieldItem = (
                    <Select onChange={this.formIsTouched}>{selectOptions.map(opts => opts)}</Select>
                  );
                  break;
                case 'selectMultiple':
                  const selectMulOptions = [];
                  key.select_value_items.forEach(forItem => {
                    selectMulOptions.push(
                      <Option value={forItem.select_code} key={forItem.select_code}>
                        {forItem.select_text}
                      </Option>
                    );
                  });
                  initialValue = key.item_value;
                  fieldItem = (
                    <Select mode="multiple" onChange={this.formIsTouched}>
                      {selectMulOptions.map(opts => opts)}
                    </Select>
                  );
                  break;
                case 'range':
                  initialValue = {
                    start_value: `${key.range_value_item.start_value}`,
                    end_value: `${key.range_value_item.end_value}`,
                  };
                  fieldItem = (
                    <RangeInput
                      onChange={this.formIsTouched}
                      item_unit={`${key.item_unit}`}
                      connect_text={`${key.range_value_item.connect_text}`}
                      start_value={`${key.range_value_item.start_value}`}
                      end_value={`${key.range_value_item.end_value}`}
                    />
                  );
                  break;
                default:
                  fieldItem = <Input placeholder={key.item_label} onChange={this.formIsTouched} />;
              }
              return (
                <Col span={12} key={key.item_key}>
                  <FormItem {...formItemLayout} label={key.item_label}>
                    {getFieldDecorator(`${key.item_key}`, {
                      rules: [
                        {
                          required: `${key.is_required}`,
                          message: `${key.item_label}不能为空！`,
                        },
                      ],
                      initialValue,
                    })(fieldItem)}
                  </FormItem>
                </Col>
              );
            })}
          </Row>
        </Form>
      </div>
    );
  }
}
