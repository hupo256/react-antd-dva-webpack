/* eslint-disable react/no-did-mount-set-state,operator-assignment,no-nested-ternary,no-param-reassign,array-callback-return,prefer-destructuring,react/no-array-index-key,react/destructuring-assignment,camelcase,arrow-body-style,no-case-declarations */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import {
  Button,
  Row,
  Col,
  Form,
  Breadcrumb,
  Select,
  Input,
  AutoComplete,
  Icon,
  message,
  Checkbox,
  Card,
  Tooltip,
  Radio,
} from 'antd';
import styles from '../../product.less';
import checkCircle from '../../images/check-circle.svg';
import save from '../../images/save.svg';
import edit from '../../images/edit.svg';
import RangeInput from '../../Insurance/EditInsurance/RangeInput/RangeInput';
import DutyDetailSetting from './DutyDetailSetting/DutyDetailSetting';

const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

const insuranceModel = {
  expense: '费用型',
  allowance: '津贴型',
  quota: '定额型',
};

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class EditInsurance extends Component {
  constructor(props) {
    super(props);
    window.ss = 0;
    this.state = {
      isAdd: true,
      insuranceRenderList: [],
      insuranceListByCompany: [],
      insuranceAllNames: [],
      saveInsurance: [],
      selectInsDutyIndex: [
        {
          insIndex: '',
          dutyIndex: [],
        },
      ],
      company_code: '',
      isSaved: true,
      isShowDetailSetting: false,
      dutyDetailSetting: {
        company_code: '',
        insIndex: 0,
        sdlIndex: 0,
        activeInsuranceItem: {},
        dutyDetailRenderList: [],
        dutyTitle: '',
      },
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: { path },
      location,
    } = this.props;

    if (path.split('/').includes('add')) {
      this.setState({
        isAdd: true,
        insuranceRenderList: [
          {
            insuranceAllNames: [],
            activeInsuranceItem: {},
            showDutyList: [],
          },
        ],
      });
    } else {
      const {
        product_name,
        product_code,
        company_code,
        require_claim,
        product_id,
      } = location.state;
      this.setState({
        isAdd: false,
        company_code,
        product_name,
        product_code,
        product_id,
        require_claim,
      });

      let { saveInsurance } = this.state;

      // 所有险种信息
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
              res.data.forEach(item => {
                insuranceNameList.push(item.insurance_type_name);
              });
              this.setState({
                insuranceListByCompany: res.data ? res.data : [],
                insuranceAllNames: insuranceNameList,
              });
            } else {
              message.warn(res.message);
            }
          } else {
            message.error(res.message);
          }
        },
      });

      // 1. product_id 查出 insurance_types
      // insuranceRenderList=>insurance_types[]
      // 2. template_id 查险种模板  duty_list 确定当前选中duty_list=>showDutyList
      // 3. 当前险种 insurance_type_name => 当前duty_list => activeInsuranceItem
      // 4. insuranceAllNames
      dispatch({
        type: 'product/getSingleProductItem',
        payload: {
          product_id,
        },
        callback: res => {
          if (res.status === 1) {
            const insuranceTypes = res.data.insurance_types;
            saveInsurance = res.data.insurance_types;
            const insTypesTemp = [];
            const selectInsIndex = [];
            let count = 0;
            insuranceTypes.forEach((item, index) => {
              const { duty_list: currentDutyList, template_id } = item;

              // const insDutyListTemp = [];
              dispatch({
                type: 'product/queryInsuranceItem',
                payload: {
                  templateid: template_id,
                },
                callback: resData => {
                  if (resData.status === 1) {
                    const { duty_list: insDutyList } = resData.data;

                    console.log('=========', resData.data);

                    const resInsData = {};
                    const dIndex = [];
                    const newInsDutyList = insDutyList.map((insDutyItem, insDutyIndex) => {
                      return (
                        currentDutyList.find(curDutyItem => {
                          dIndex.push(insDutyIndex);
                          if (curDutyItem.duty_code === insDutyItem.duty_code) {
                            this.setState({
                              [`checked${index}${insDutyIndex}`]: true,
                              [`insDutyChecked${index}${insDutyIndex}`]: true,
                            });
                          } else {
                            this.setState({
                              [`checked${index}${insDutyIndex}`]: false,
                              [`insDutyChecked${index}${insDutyIndex}`]: false,
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
                        item_subcategory: item.insurance_model,
                        item_category: 'duty',
                      },
                      callback: resDutyItem => {
                        if (resDutyItem.status === 1) {
                          newInsDutyList.forEach(itemDuty => {
                            const bb = this.refactoringDutyList(itemDuty, resDutyItem.data);
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
                            });
                          });
                          selectInsIndex[index] = {
                            insIndex: index,
                            dutyIndex: dIndex,
                          };
                          insTypesTemp[index] = Object.assign(resInsData, {
                            activeInsuranceItem: resData.data,
                            showDutyList: sdlList,
                          });
                          count = count + 1;
                          if (count === insuranceTypes.length) {
                            this.setState({
                              insuranceRenderList: insTypesTemp,
                              selectInsDutyIndex: selectInsIndex,
                              saveInsurance,
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
    }
  }

  // componentDidUpdate(prevState) {
  //   console.log('prevState', prevState);
  // }

  queryInsuranceByCompanyCode = value => {
    this.setState({
      company_code: value,
    });
    const { dispatch } = this.props;
    dispatch({
      type: 'product/queryInsuranceList',
      payload: {
        company_code: value,
        insurance_scope: 'personal',
      },
      callback: res => {
        if (res.status === 1) {
          if (res.data.length > 0) {
            const insuranceNameList = [];
            res.data.forEach(item => {
              insuranceNameList.push(item.insurance_type_name);
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

  refactoringDutyList = (activeInsuranceItem, activeInsuranceItemFields) => {
    const displayDutyList = [];
    Object.keys(activeInsuranceItem).forEach(item => {
      const tempDisplayDutyList = JSON.parse(JSON.stringify(activeInsuranceItemFields));
      tempDisplayDutyList.forEach(dutyItem => {
        if (dutyItem.item_key === item) {
          switch (dutyItem.item_model) {
            case 'input':
              displayDutyList.push({
                labelName: dutyItem.item_label,
                labelNameValue: activeInsuranceItem[item],
              });
              break;
            case 'select':
            case 'radio':
            case 'checkbox':
            case 'selectMultiple':
              const tempArray = [];
              if (Array.isArray(activeInsuranceItem[item])) {
                activeInsuranceItem[item].forEach(items => {
                  dutyItem.select_value_items.forEach(selectItem => {
                    if (selectItem.select_code === items) {
                      tempArray.push(selectItem.select_text);
                    }
                  });
                });
              } else {
                dutyItem.select_value_items.forEach(selectItem => {
                  if (selectItem.select_code === activeInsuranceItem[item]) {
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
    });

    return displayDutyList;
  };

  queryActiveInsuranceItem = (insuranceItemName, insIndex) => {
    const { insuranceListByCompany, saveInsurance } = this.state;
    this.setState(
      {
        activeItem: insuranceListByCompany.filter(item => {
          return item.insurance_type_name === insuranceItemName;
        }),
      },
      () => {
        this.getDutyFields(this.state.activeItem[0] ? this.state.activeItem[0] : [], insIndex);
      }
    );

    // 保存选中的险种 去掉未选中的duty
    const saveIns = insuranceListByCompany.filter(item => {
      return item.insurance_type_name === insuranceItemName;
    });

    const {
      last_modified_user,
      last_modified_date,
      create_at,
      created_by,
      ...restSaveIns
    } = saveIns[0];

    saveInsurance[insIndex] = restSaveIns;

    this.setState({
      saveInsurance,
    });
  };

  // 查询责任配置字段
  getDutyFields = (activeItem, index) => {
    const { dispatch } = this.props;
    const { company_code, insuranceRenderList } = this.state;
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
            const bb = this.refactoringDutyList(item, res.data);
            const cc = bb.filter(value => {
              return value.labelName !== '责任名称' && value.labelName !== '责任代码';
            });
            const dd = bb.filter(value => {
              return value.labelName === '责任名称' || value.labelName === '责任代码';
            });
            sdlList.push({
              title: dd,
              list: cc,
            });
          });

          insuranceRenderList[index].activeInsuranceItem = activeItem;
          insuranceRenderList[index].showDutyList = sdlList;
          this.setState({
            insuranceRenderList,
          });
        } else {
          message.error(res.message);
        }
      },
    });
  };

  // 保存
  saveEditInsurance = e => {
    e.preventDefault();

    const { dispatch } = this.props;
    const { saveInsurance, selectInsDutyIndex, product_id } = this.state;

    // console.log('saveInsurance', saveInsurance);

    if (!selectInsDutyIndex.some(item => item.dutyIndex.length > 0)) {
      message.error('请至少选择一个责任！');
      return;
    }

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      let savePayloadTemp = '';
      if (product_id) {
        savePayloadTemp = {
          ...values,
          product_id,
          insurance_types: saveInsurance,
        };
      } else {
        savePayloadTemp = {
          ...values,
          insurance_types: saveInsurance,
        };
      }
      // delete savePayloadTemp.last_modified_date;
      // delete savePayloadTemp.last_modified_user;

      const savePayLoad = {};
      Object.keys(savePayloadTemp).forEach(item => {
        if (!item.includes(`insuranceName`)) {
          savePayLoad[item] = savePayloadTemp[item];
        }
      });

      const { insurance_types: insuranceTypes, ...restSavePayLoad } = savePayLoad;

      const sidIndex = selectInsDutyIndex.filter(item => {
        return item.insIndex !== '';
      });

      const insTypes = [];
      sidIndex.forEach(item => {
        const { duty_list: dutyList, ...resFields } = insuranceTypes[item.insIndex];

        const tempDutyList = [];
        item.dutyIndex.forEach(dutyIndex => {
          tempDutyList.push(dutyList[dutyIndex]);
        });

        const newObj = {
          duty_list: tempDutyList,
          ...resFields,
        };
        insTypes.push(newObj);
      });

      const newSavePayLoad = {
        insurance_types: insTypes,
        ...restSavePayLoad,
      };

      dispatch({
        type: 'product/saveSingleProductItem',
        payload: newSavePayLoad,
        callback: res => {
          if (res.status === 1) {
            this.props.history.push('/product/single');
          } else {
            message.error(res.message);
          }
        },
      });
    });
  };

  // 保存责任
  saveEditDuty = (e, insIndex, sdlIndex) => {
    const { insuranceRenderList, dutyObj } = this.state;
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (err) {
        return;
      }
      const dutyTemp = {};
      Object.keys(values).forEach(item => {
        if (item.indexOf('duty') !== -1) {
          dutyTemp[item] = values[item];
        }
      });

      const realDuty = {};
      Object.keys(dutyTemp).forEach(item => {
        const bb = item.split('_duty')[0];
        realDuty[bb] = dutyTemp[item];
      });
      realDuty.duty_code = dutyObj.duty_code;
      realDuty.duty_name = dutyObj.duty_name;

      insuranceRenderList[insIndex].activeInsuranceItem.duty_list[sdlIndex] = realDuty;

      this.getDutyFields(insuranceRenderList[insIndex].activeInsuranceItem, insIndex);

      this.setState({
        isSaved: true,
        [`dutyEdit${insIndex}${sdlIndex}`]: false,
        insuranceRenderList,
      });
    });
  };

  setDutyTitle = (sdlItem, ins) => {
    const duty = sdlItem.title.map(titleItem => {
      return `${titleItem.labelNameValue} `;
    });

    return `责任${ins + 1}: ${duty}`;
  };

  // 重组数组
  refactoringFn = fromArray => {
    const toArray = [];

    for (let i = 0; i < fromArray.length; i += 2) {
      toArray.push({ cols: [...fromArray.slice(i, i + 2)] });
    }

    return toArray;
  };

  // 取消配置
  cancelEditInsurance = () => {
    this.props.history.push('/product/single');
  };

  // 增加险种
  addInsuranceItem = () => {
    const { insuranceRenderList, selectInsDutyIndex } = this.state;
    this.setState({
      isAdd: true,
      insuranceRenderList: insuranceRenderList.concat({
        insuranceAllNames: [],
        activeInsuranceItem: {},
        showDutyList: [],
      }),
      selectInsDutyIndex: selectInsDutyIndex.concat({ insIndex: '', dutyIndex: [] }),
    });
  };

  // 删除个单险种
  deleteInsuranceItem = k => {
    const { insuranceRenderList, selectInsDutyIndex } = this.state;
    insuranceRenderList.splice(k, 1);
    selectInsDutyIndex.splice(k, 1);
    this.setState({
      insuranceRenderList,
      selectInsDutyIndex,
    });
  };

  dutyItemForSelect = (e, insIndex, sdlIndex) => {
    const { selectInsDutyIndex } = this.state;
    if (e.target.checked) {
      selectInsDutyIndex[insIndex].dutyIndex.push(sdlIndex);
      selectInsDutyIndex[insIndex].insIndex = insIndex;
    } else {
      selectInsDutyIndex[insIndex].dutyIndex.splice(sdlIndex, 1);
      selectInsDutyIndex[insIndex].insIndex = '';
    }

    this.setState({
      [`insDutyChecked${insIndex}${sdlIndex}`]: e.target.checked,
      selectInsDutyIndex,
      [`checked${insIndex}${sdlIndex}`]: e.target.checked,
    });
  };

  // 编辑责任
  editDutyItem = (insIndex, sdlIndex) => {
    const { dispatch } = this.props;
    const { insuranceRenderList } = this.state;

    // console.log('insIndex', insIndex);
    // console.log('sdlIndex', sdlIndex);
    // console.log('============insuranceRenderList', insuranceRenderList);

    const editInsurance = insuranceRenderList[insIndex].activeInsuranceItem;

    const { company_code, insurance_model, duty_list } = editInsurance;

    const dutyList = duty_list[sdlIndex];

    dispatch({
      type: 'product/queryDutyConfigFields',
      payload: {
        company_code,
        item_subcategory: insurance_model,
        item_category: 'duty',
      },
      callback: res => {
        const dutyFields = res.data;

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

        insuranceRenderList[insIndex].activeInsuranceItem.duty_list[sdlIndex] = ssDutyList;

        this.setState({
          insuranceRenderList,
          dutyObj,
          isSaved: false,
          [`dutyEdit${insIndex}${sdlIndex}`]: true,
        });
      },
    });
  };

  // 详细配置
  openDutyDetailSetting = (insIndex, sdlIndex) => {
    const { dispatch } = this.props;
    const { dutyDetailSetting, insuranceRenderList } = this.state;

    const activeInsuranceItem = insuranceRenderList[insIndex].activeInsuranceItem;

    const dutyTitle = activeInsuranceItem.duty_list[sdlIndex].duty_name;

    const company_code = activeInsuranceItem.company_code;
    const insurance_model = activeInsuranceItem.insurance_model;

    dispatch({
      type: 'product/queryDutyConfigFields',
      payload: {
        company_code,
        item_subcategory: insurance_model,
        item_category: 'personal',
      },
      callback: res => {
        if (res.status === 1) {
          const dutyList = res.data;

          dutyList.forEach((item, index) => {
            item.selectOptions = [];
            item.counter = index;
          });

          this.setState({
            isShowDetailSetting: true,
            dutyDetailSetting: {
              ...dutyDetailSetting,
              insIndex,
              sdlIndex,
              dutyTitle,
              dutyDetailRenderList: dutyList,
              activeInsuranceItem,
              insuranceRenderList,
            },
          });
        } else {
          message.error(res.message);
        }
      },
    });
  };

  handleCancel = () => {
    this.setState({
      isShowDetailSetting: false,
    });
  };

  handleSave = dutyState => {
    const {
      dutyDetailSetting: { insIndex, sdlIndex, activeInsuranceItem },
      insuranceRenderList,
    } = this.state;

    const form = this.formRef.props.form;

    console.log(dutyState);

    form.validateFields(err => {
      if (err) {
        return;
      }

      activeInsuranceItem.duty_list[sdlIndex] = {
        ...activeInsuranceItem.duty_list[sdlIndex],
        ...dutyState,
      };
      insuranceRenderList[insIndex].activeInsuranceItem = activeInsuranceItem;

      this.setState({
        isShowDetailSetting: false,
        insuranceRenderList,
      });
    });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  render() {
    const {
      isAdd,
      insuranceRenderList,
      insuranceAllNames,
      product_name,
      product_code,
      company_code,
      require_claim,
      isShowDetailSetting,
      dutyDetailSetting,
    } = this.state;

    console.log('insuranceRenderList', insuranceRenderList);

    const { singleCode } = this.props.match.params;
    const {
      product: {
        companyList: { data: companyList },
      },
    } = this.props;

    // const toolTipsTitle = <span>有必填项未配置</span>;

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

    const isCanDelete = insuranceRenderList.length === 1;

    return (
      <div>
        <div className={styles.uiHeader}>
          <Row>
            <Col span={18}>
              <Breadcrumb separator="/">
                <Breadcrumb.Item className={styles.breadCrumb}>
                  <Link to="/product/single">个单列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className={styles.breadCrumb}>
                  {!isAdd ? `个单${singleCode}` : '产品配置'}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={6} className={styles.alignRight}>
              <Button className={styles.tableButton} onClick={this.saveEditInsurance}>
                保存
              </Button>
              <Button type="primary" ghost onClick={this.cancelEditInsurance}>
                {!isAdd ? '取消' : '取消配置'}
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles.fixCard}>
          <Form>
            <div className={styles.uiTitle}>产品概览</div>
            <div className={styles.uiBody}>
              {isAdd ? (
                <div>
                  <Row>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="所属保险公司">
                        {getFieldDecorator('company_code', {
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
                      <FormItem {...formItemLayout} label="产品代码">
                        {getFieldDecorator('product_code', {
                          rules: [
                            {
                              required: true,
                              message: '产品代码不能为空！',
                            },
                          ],
                        })(<Input placeholder="产品代码" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="产品名称">
                        {getFieldDecorator('product_name', {
                          rules: [
                            {
                              required: true,
                              message: '产品名称不能为空！',
                            },
                          ],
                        })(<Input placeholder="产品名称" />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="告知要求">
                        {getFieldDecorator('require_claim', {})(
                          <Select placeholder="请选择">
                            <Option value="1" key="1">
                              肝功能异常
                            </Option>
                            <Option value="2" key="1">
                              重大疾病
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div>
                  <Row>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="所属保险公司">
                        {getFieldDecorator('company_code', {
                          initialValue: company_code || '所属保险公司',
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
                      <FormItem {...formItemLayout} label="产品代码">
                        {getFieldDecorator('product_code', {
                          initialValue: product_code || '产品代码',
                          rules: [
                            {
                              required: true,
                              message: '产品代码不能为空！',
                            },
                          ],
                        })(<Input placeholder="产品代码" />)}
                      </FormItem>
                    </Col>
                  </Row>
                  <Row>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="产品名称">
                        {getFieldDecorator('product_name', {
                          initialValue: product_name || '产品名称',
                          rules: [
                            {
                              required: true,
                              message: '产品名称不能为空！',
                            },
                          ],
                        })(<Input placeholder="产品名称" />)}
                      </FormItem>
                    </Col>
                    <Col span={12}>
                      <FormItem {...formItemLayout} label="告知要求">
                        {getFieldDecorator('require_claim', {
                          initialValue: require_claim,
                        })(
                          <Select placeholder="请选择">
                            <Option value="1" key="1">
                              肝功能异常
                            </Option>
                            <Option value="2" key="1">
                              重大疾病
                            </Option>
                          </Select>
                        )}
                      </FormItem>
                    </Col>
                  </Row>
                </div>
              )}
            </div>
            <div className={styles.uiTitle}>险种配置</div>
            {insuranceRenderList.map((insItem, insIndex) => {
              return (
                <div
                  className={styles.uiBody}
                  key={insItem.activeInsuranceItem.insurance_type_code}
                >
                  <Row style={{ width: '90%', margin: '0 auto' }}>
                    <Col span={12}>
                      {isAdd ? (
                        <FormItem {...formItemLayout} label="险种名称">
                          {getFieldDecorator(`insuranceName${insIndex}`, {
                            rules: [
                              {
                                required: true,
                                message: '险种名称不能为空',
                              },
                            ],
                          })(
                            <AutoComplete
                              style={{ width: '100%' }}
                              dataSource={insuranceAllNames}
                              placeholder="输入险种名称进行查询"
                              onSelect={e => {
                                this.queryActiveInsuranceItem(e, insIndex);
                              }}
                              filterOption={(inputValue, option) =>
                                option.props.children.indexOf(inputValue) !== -1
                              }
                            />
                          )}
                        </FormItem>
                      ) : (
                        <FormItem {...formItemLayout} label="险种名称">
                          {getFieldDecorator(`insuranceName${insIndex}`, {
                            initialValue: `${insItem.activeInsuranceItem.insurance_type_name}`,
                            rules: [
                              {
                                required: true,
                                message: '险种名称不能为空',
                              },
                            ],
                          })(
                            <AutoComplete
                              style={{ width: '100%' }}
                              dataSource={insuranceAllNames}
                              placeholder="输入险种名称进行查询"
                              onSelect={e => {
                                this.queryActiveInsuranceItem(e, insIndex);
                              }}
                              filterOption={(inputValue, option) =>
                                option.props.children.indexOf(inputValue) !== -1
                              }
                            />
                          )}
                        </FormItem>
                      )}
                    </Col>
                    <Col span={6} className={styles.alignVertical}>
                      {insItem.activeInsuranceItem &&
                        insItem.showDutyList.length > 0 && (
                          <p>
                            险种类型: {insuranceModel[insItem.activeInsuranceItem.insurance_model]}
                          </p>
                        )}
                    </Col>
                    <Col span={6} className={styles.alignRight}>
                      {insItem.activeInsuranceItem &&
                        insItem.showDutyList.length > 0 &&
                        this.state[`extendButton${insIndex}`] && (
                          <div
                            className={styles.textExtend}
                            onClick={() => {
                              this.setState({ [`extendButton${insIndex}`]: false });
                            }}
                          >
                            展开责任
                            <Icon type="down" />
                          </div>
                        )}
                      {insItem.activeInsuranceItem &&
                        insItem.showDutyList.length > 0 &&
                        !this.state[`extendButton${insIndex}`] && (
                          <div
                            className={styles.textExtend}
                            onClick={() => {
                              this.setState({ [`extendButton${insIndex}`]: true });
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
                      {insItem.showDutyList &&
                        insItem.showDutyList.length > 0 &&
                        insItem.showDutyList.map((sdlItem, sdlIndex) => {
                          return (
                            <Row style={{ marginBottom: '20px' }} key={`dutyList${sdlIndex}`}>
                              <Col span={1} className={styles.alignCenter}>
                                <Checkbox
                                  style={{ marginTop: '120px' }}
                                  checked={this.state[`checked${insIndex}${sdlIndex}`]}
                                  onChange={e => {
                                    this.dutyItemForSelect(e, insIndex, sdlIndex);
                                  }}
                                />
                              </Col>
                              <Col span={23}>
                                <Card
                                  title={this.setDutyTitle(sdlItem, sdlIndex)}
                                  style={
                                    this.state[`insDutyChecked${insIndex}${sdlIndex}`]
                                      ? {
                                          border: '1px solid #b8f2ea',
                                          borderRadius: '2px',
                                          boxShadow: '2px 2px 2px #eee',
                                        }
                                      : {}
                                  }
                                  headStyle={
                                    this.state[`insDutyChecked${insIndex}${sdlIndex}`]
                                      ? {
                                          backgroundColor: '#b8f2ea',
                                          padding: '0 10px',
                                          borderBottom: '1px solid #b8f2ea',
                                        }
                                      : { backgroundColor: '#f0f2f5', padding: '0 10px' }
                                  }
                                  bodyStyle={{ padding: '30px 10px 10px 10px' }}
                                  extra={
                                    this.state[`insDutyChecked${insIndex}${sdlIndex}`] ? (
                                      !this.state[`dutyEdit${insIndex}${sdlIndex}`] ? (
                                        <img
                                          src={edit}
                                          style={{ cursor: 'pointer' }}
                                          alt="save edit"
                                          onClick={() => {
                                            if (!this.state.isSaved) {
                                              message.warn('请先保存相关责任信息');
                                            } else {
                                              this.editDutyItem(insIndex, sdlIndex);
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
                                    this.refactoringFn(sdlItem.list).map(item => {
                                      return (
                                        <Row>
                                          {item.cols.map(key => {
                                            return (
                                              <Col span={12} key={key.labelName}>
                                                <Row style={{ marginBottom: '15px' }}>
                                                  <Col
                                                    span={8}
                                                    style={{
                                                      textAlign: 'right',
                                                      paddingRight: '10px',
                                                    }}
                                                  >
                                                    {key.labelName} :
                                                  </Col>
                                                  <Col span={16}>{key.labelNameValue}</Col>
                                                </Row>
                                              </Col>
                                            );
                                          })}
                                        </Row>
                                      );
                                    })}
                                  {this.state[`dutyEdit${insIndex}${sdlIndex}`] &&
                                    this.refactoringFn(
                                      this.state.insuranceRenderList[insIndex].activeInsuranceItem
                                        .duty_list[sdlIndex]
                                    ).map(item => {
                                      return (
                                        <Row>
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
                                                  fieldItem = (
                                                    <Input placeholder={key.item_label} />
                                                  );
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
                                                  <CheckboxGroup
                                                    onChange={this.formIsTouched}
                                                    options={checkboxOptions}
                                                  />
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
                                                fieldItem = (
                                                  <RadioGroup
                                                    onChange={this.formIsTouched}
                                                    options={radioOptions}
                                                  />
                                                );
                                                break;
                                              case 'select':
                                                const selectOptions = [];
                                                key.select_value_items.forEach(forItem => {
                                                  selectOptions.push(
                                                    <Option
                                                      value={forItem.select_code}
                                                      key={forItem.select_code}
                                                    >
                                                      {forItem.select_text}
                                                    </Option>
                                                  );
                                                });
                                                initialValue = key.item_value[0];
                                                fieldItem = (
                                                  <Select onChange={this.formIsTouched}>
                                                    {selectOptions.map(opts => opts)}
                                                  </Select>
                                                );
                                                break;
                                              case 'selectMultiple':
                                                const selectMulOptions = [];
                                                key.select_value_items.forEach(forItem => {
                                                  selectMulOptions.push(
                                                    <Option
                                                      value={forItem.select_code}
                                                      key={forItem.select_code}
                                                    >
                                                      {forItem.select_text}
                                                    </Option>
                                                  );
                                                });
                                                initialValue = key.item_value;
                                                fieldItem = (
                                                  <Select
                                                    mode="multiple"
                                                    onChange={this.formIsTouched}
                                                  >
                                                    {selectMulOptions.map(opts => opts)}
                                                  </Select>
                                                );
                                                break;
                                              case 'range':
                                                initialValue = {
                                                  start_value: `${
                                                    key.range_value_item.start_value
                                                  }`,
                                                  end_value: `${key.range_value_item.end_value}`,
                                                };
                                                fieldItem = (
                                                  <RangeInput
                                                    onChange={this.formIsTouched}
                                                    item_unit={`${key.item_unit}`}
                                                    connect_text={`${
                                                      key.range_value_item.connect_text
                                                    }`}
                                                    start_value={`${
                                                      key.range_value_item.start_value
                                                    }`}
                                                    end_value={`${key.range_value_item.end_value}`}
                                                  />
                                                );
                                                break;
                                              default:
                                                fieldItem = (
                                                  <Input
                                                    placeholder={key.item_label}
                                                    onChange={this.formIsTouched}
                                                  />
                                                );
                                            }
                                            return (
                                              <Col span={12} key={key.item_key}>
                                                <FormItem
                                                  {...formItemLayout}
                                                  label={key.item_label}
                                                >
                                                  {getFieldDecorator(`${key.item_key}_duty`, {
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
                                      );
                                    })}
                                  {this.state[`insDutyChecked${insIndex}${sdlIndex}`] && (
                                    <Row>
                                      <Col span={24} className={styles.alignRight}>
                                        <div style={{ color: '#529ad8', cursor: 'pointer' }}>
                                          <Tooltip
                                            // title={toolTipsTitle}
                                            placement="topRight"
                                          >
                                            <div
                                              onClick={() =>
                                                this.openDutyDetailSetting(insIndex, sdlIndex)
                                              }
                                            >
                                              详细配置 <img src={checkCircle} alt="详细配置" />
                                            </div>
                                          </Tooltip>
                                        </div>
                                      </Col>
                                    </Row>
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
                        disabled={isCanDelete}
                        onClick={() => this.deleteInsuranceItem(insIndex)}
                      >
                        删除险种
                      </Button>
                    </Col>
                  </Row>
                </div>
              );
            })}

            <div className={styles.uiFooter}>
              <Row>
                <Col span={24} className={styles.alignRight}>
                  <Button icon="plus" type="primary" onClick={this.addInsuranceItem}>
                    增加险种
                  </Button>
                </Col>
              </Row>
            </div>
          </Form>
        </div>

        {/* 详细配置 */}
        <DutyDetailSetting
          isShowDetailSetting={isShowDetailSetting}
          dutyDetailSetting={dutyDetailSetting}
          handleCancel={this.handleCancel}
          handleSave={this.handleSave}
          history={this.props.history}
          wrappedComponentRef={this.saveFormRef}
        />
      </div>
    );
  }
}

export default EditInsurance;
