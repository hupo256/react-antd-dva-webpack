/* eslint-disable prefer-destructuring,react/destructuring-assignment,arrow-body-style,no-case-declarations,react/no-array-index-key */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Checkbox, Col, Form, Input, Radio, Row, Select } from 'antd';
import styles from '../../../product.less';

const FormItem = Form.Item;
// const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;
const Option = Select.Option;

const originalDutyFieldList = [
  {
    item_label: '责任名称',
    item_key: 'dutyName',
    item_category: 'duty',
    item_subcategory: 'fee',
    item_position: 1,
    item_value: ['住院医疗费用保险金'],
    item_model: 'input',
    item_unit: '',
    select_value_items: [
      {
        select_code: '',
        select_text: '',
        selected: false,
      },
    ],
    range_value_item: {
      start_value: 0,
      end_value: 0,
      connect_text: '~',
    },
    is_required: true,
  },
  {
    item_label: '责任代码',
    item_key: 'dutyCode',
    item_category: 'duty',
    item_subcategory: 'fee',
    item_position: 2,
    item_value: ['F323232'],
    item_model: 'input',
    item_unit: '',
    select_value_items: [
      {
        select_code: '',
        select_text: '',
        selected: false,
      },
    ],
    range_value_item: {
      start_value: 0,
      end_value: 0,
      connect_text: '~',
    },
    is_required: true,
  },
  {
    item_label: '就诊类型',
    item_key: 'clinicType',
    item_category: 'duty',
    item_subcategory: 'fee',
    item_position: 3,
    item_value: ['ui', 'dev'],
    item_model: 'checkbox',
    item_unit: '',
    select_value_items: [
      {
        select_code: 'ui',
        select_text: '门诊',
        selected: true,
      },
      {
        select_code: 'dev',
        select_text: '住院',
        selected: false,
      },
      {
        select_code: 'ued',
        select_text: '药房',
        selected: false,
      },
      {
        select_code: 'other',
        select_text: '其他',
        selected: false,
      },
    ],
    range_value_item: {
      start_value: 0,
      end_value: 0,
      connect_text: '~',
    },
    is_required: true,
  },
  {
    item_label: '出险类型',
    item_key: 'accidentType',
    item_category: 'duty',
    item_subcategory: 'fee',
    item_position: 6,
    item_value: ['ui'],
    item_model: 'select',
    item_unit: '',
    select_value_items: [
      {
        select_code: 'ui',
        select_text: '不限',
        selected: true,
      },
      {
        select_code: 'dev',
        select_text: '一级以上',
        selected: false,
      },
    ],
    range_value_item: {
      start_value: 0,
      end_value: 0,
      connect_text: '~',
    },
    is_required: true,
  },
  {
    item_label: '索赔事故性质',
    item_key: 'malfunctionType',
    item_category: 'duty',
    item_subcategory: 'fee',
    item_position: 6,
    item_value: ['ui'],
    item_model: 'selectMultiple',
    item_unit: '',
    select_value_items: [
      {
        select_code: 'ui',
        select_text: '不限',
        selected: true,
      },
      {
        select_code: 'dev',
        select_text: '一级以上',
        selected: false,
      },
    ],
    range_value_item: {
      start_value: 0,
      end_value: 0,
      connect_text: '~',
    },
    is_required: true,
  },
];

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class DutyConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    const { loading } = this.state;
    console.log(loading);
    const { isDisabled, deleteDutyItem } = this.props;
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

    const dutyFieldList = [];
    for (let i = 0; i < originalDutyFieldList.length; i += 2) {
      dutyFieldList.push({ cols: [...originalDutyFieldList.slice(i, i + 2)] });
    }

    return (
      <div>
        <div className={styles.uiBody}>
          {dutyFieldList.map((item, index) => {
            return (
              <Row key={`row${index}`}>
                {item.cols.map(key => {
                  let fieldItem = null;
                  let initialValue = '';
                  switch (`${key.item_model}`) {
                    case 'input':
                      fieldItem = <Input placeholder={key.item_label} />;
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
                      fieldItem = <CheckboxGroup options={checkboxOptions} />;
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
                      fieldItem = <RadioGroup options={radioOptions} />;
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
                      fieldItem = <Select>{selectOptions.map(opts => opts)}</Select>;
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
                        <Select mode="multiple">{selectMulOptions.map(opts => opts)}</Select>
                      );
                      break;

                    default:
                      fieldItem = <Input placeholder={key.item_label} />;
                  }
                  return (
                    <Col span={12} key={key.item_key}>
                      <FormItem {...formItemLayout} label={key.item_label}>
                        {getFieldDecorator(`${key.item_key}`, {
                          rules: [
                            {
                              required: `${key.is_required}`,
                              message: '',
                            },
                          ],
                          initialValue,
                        })(fieldItem)}
                      </FormItem>
                    </Col>
                  );
                })}
              </Row>
            );
          })}
          {/*
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="责任名称">
                {getFieldDecorator('dutyName', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(<Input placeholder="责任名称" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="就诊类型">
                {getFieldDecorator('clinicType', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <CheckboxGroup
                    options={['门诊', '住院', '药房', '其他']}
                    onChange={this.checkBoxChange}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="责任代码">
                {getFieldDecorator('dutyCode', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(<Input placeholder="责任代码" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="医院等级">
                {getFieldDecorator('hospitalGrade', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <RadioGroup onChange={this.radioChange}>
                    <Radio value={1}>不限</Radio>
                    <Radio value={2}>一级以上</Radio>
                    <Radio value={3}>二级以上</Radio>
                    <Radio value={4}>三级以上</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="出险类型">
                {getFieldDecorator('accidentType', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <Select placeholder="出险类型">
                    <Option value="000" key="001">
                      请选择
                    </Option>
                    <Option value="002" key="002">
                      农业
                    </Option>
                    <Option value="003" key="003">
                      林业
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="医院性质">
                {getFieldDecorator('hospitalNature', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <RadioGroup onChange={this.radioChange}>
                    <Radio value={1}>不限</Radio>
                    <Radio value={2}>公立</Radio>
                    <Radio value={3}>民营</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="索赔事故性质">
                {getFieldDecorator('malfunctionType', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <Select placeholder="索赔事故性质">
                    <Option value="000" key="001">
                      请选择
                    </Option>
                    <Option value="002" key="002">
                      农业
                    </Option>
                    <Option value="003" key="003">
                      林业
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="医院社保性质">
                {getFieldDecorator('hospitalSecurityNature', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <RadioGroup onChange={this.radioChange}>
                    <Radio value={1}>不限</Radio>
                    <Radio value={2}>定点</Radio>
                    <Radio value={3}>不定点</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="承保责任范围">
                {getFieldDecorator('dutyScope', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <Select placeholder="承保责任范围">
                    <Option value="000" key="001">
                      请选择
                    </Option>
                    <Option value="002" key="002">
                      农业
                    </Option>
                    <Option value="003" key="003">
                      林业
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="观察期">
                {getFieldDecorator('obsPeriod', {
                  rules: [
                    {
                      required: true,
                      message: '',
                    },
                  ],
                })(
                  <Input
                    placeholder="天数"
                    style={{ width: '100px', display: 'inline', margin: '0 10px 0 0' }}
                  />
                )}
                <span>天</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="疾病责免">
                {getFieldDecorator('dutyDisease')(
                  <Select placeholder="疾病责免">
                    <Option value="000" key="001">
                      请选择
                    </Option>
                    <Option value="002" key="002">
                      农业
                    </Option>
                    <Option value="003" key="003">
                      林业
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label="药品责免">
                {getFieldDecorator('hospitalSecurityNature')(<Input placeholder="输入药品名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout} label="出险地区">
                {getFieldDecorator('accidentArea')(
                  <Select placeholder="出险地区">
                    <Option value="000" key="001">
                      请选择
                    </Option>
                    <Option value="002" key="002">
                      北京
                    </Option>
                    <Option value="003" key="003">
                      上海
                    </Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          */}
          <Row>
            <Col span={24} className={styles.alignRight}>
              <Button icon="minus" type="danger" disabled={isDisabled} onClick={deleteDutyItem}>
                删除责任
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default DutyConfig;
