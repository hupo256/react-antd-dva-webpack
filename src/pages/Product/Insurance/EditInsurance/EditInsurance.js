/* eslint-disable react/no-did-mount-set-state,no-else-return, consistent-return,no-param-reassign,prefer-destructuring,react/destructuring-assignment,no-return-assign,arrow-body-style,react/no-array-index-key,no-case-declarations,camelcase,no-plusplus,one-var,react/no-unused-state,prefer-const */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import _ from 'lodash';
import {Button,Row,Col,Form,Breadcrumb, message,Modal,Icon, Input} from 'antd';
import styles from '../../product.less';
import CreateMultiples from '../../Single/Preview/CreateMultiples';
import {CreactDutyList, refactoringFn, filterValues, selectToNumber, onLinkClick} from '../../Components/DutyItemSetting/CreactDutyList';

const FormItem = Form.Item;
const insuranceModel = {
  expense: '费用型',
  allowance: '津贴型',
  quota: '定额型',
};

const insuranceScope = {
  personal: '个单',
  group: '团单',
};
const PREFIX = '_DUTY';

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class EditInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdd: true,
      currentCompany: [],
      dutyRenderList: [],
      insuranceConfigFields: [],
      originalDutyFieldList: [],
      isActiveSaveBtn: true,
      isShowTipsModal: false,
      isAddTips: true,
      isShowRepeatDutyCode: false,
      formItemIsError: false,
      showMultiples: false,
      theCodeRep: false,
    };
  }

  componentDidMount() {
    const {
      dispatch,
      match: { path },
      location,
      product: {
        companyList: { data: companyList },
      },
    } = this.props;
    const { dutyRenderList } = this.state;
    const { company_code, insurance_model, template_id } = location.state;

    if(companyList){
      this.setState({
        currentCompany: companyList.filter(item => item.company_code === location.state.company_code),
      });
    }

    const lcsKey = template_id || 'leapIns';
    const lcsObj = localStorage.getItem(lcsKey) ? JSON.parse(localStorage.getItem(lcsKey)) : null;
    if(lcsObj){
      console.log(lcsObj);
      this.setState({
        ...lcsObj
      });
      
      return;
    }

    // 新增 or 更新
    if (!path.split('/').includes('add')) {
      this.setState({
        isAdd: false,
        isActiveSaveBtn: false,
      });

      // 编辑险种模板
      dispatch({
        type: 'product/editInsuranceInfo',
        payload: {
          insItem: { templateid: template_id },
          insFields: {
            company_code,
            item_subcategory: insurance_model,
            item_category: 'insurancetype',
          },
          dutyFields: {
            company_code,
            item_subcategory: insurance_model,
            item_category: 'duty',
          },
        },
        callback: res => {
          const drList = [];
          res.newDutyList.forEach(item => {
            selectToNumber(item)
            drList.push({ dutyFieldsList: item, dutyId: `dutyId${Math.floor(Math.random()*10000)}` });
          });

          selectToNumber(res.dutyFieldsData);
          this.setState({
            insuranceConfigFields: res.newInsFields,
            originalDutyFieldList: res.dutyFieldsData,
            dutyRenderList: drList,
            company_code: res.company_code,
            insurance_model: res.insurance_model,
            insurance_scope: res.insurance_scope,
            template_id: res.template_id,
          });
        },
      });
    } else {
      this.setState({
        isAdd: true,
        isActiveSaveBtn: true,
      });

      // 查询险种展示字段
      dispatch({
        type: 'product/queryInsuranceConfigFields',
        payload: {
          company_code,
          item_subcategory: insurance_model,
          item_category: 'insurancetype',
        },
        callback: res => {
          if (res.status === 1) {
            this.setState({
              insuranceConfigFields: res.data,
            });
          } else {
            message.error(res.message);
          }
        },
      });

      // 查询责任配置字段
      dispatch({
        type: 'product/queryDutyConfigFields',
        payload: {
          company_code,
          item_subcategory: insurance_model,
          item_category: 'duty',
        },
        callback: res => {
          if (res.status === 1) {
            dutyRenderList.push({ dutyFieldsList: res.data, dutyId: `dutyId${Math.floor(Math.random()*10000)}` });
            this.setState({
              originalDutyFieldList: res.data,
              dutyRenderList,
            });
          } else {
            message.error(res.message);
          }
        },
      });
    }
  }

  restructuringObj = (originalObj, rulesArray) => {
    const tempOriginalObj = _.cloneDeep(originalObj);

    const keysList = [],
      keysObj = {},
      rulesList = [],
      tempList = [],
      restObj = {};

    rulesArray.forEach((item, index) => {
      Object.keys(tempOriginalObj).forEach(key => {
        const temp = `${PREFIX}${index}`;
        if (key.includes(temp)) {
          keysList.push(key);
        }
      });
    });

    keysList.forEach(item => {
      Object.assign(keysObj, { [item]: tempOriginalObj[item] });
    });

    Object.keys(tempOriginalObj).forEach(item => {
      if (!Object.keys(keysObj).includes(item)) {
        Object.assign(restObj, { [item]: tempOriginalObj[item] });
      }
    });

    for (let i = 0; i < rulesArray.length; i++) {
      Object.keys(tempOriginalObj).forEach(key => {
        let tempIndex = `${PREFIX}${i}`;
        let vValue = tempOriginalObj[key];
        let vKey = key.split(tempIndex)[0];

        if (key.includes(tempIndex)) {
          tempList.push({ [vKey]: vValue});
        }
      });
      // console.log(tempList);
      rulesList.push(Object.assign({}, ...tempList));
    }
    return Object.assign({}, restObj, { duty_list: rulesList });
  };

  setLsItem = (id) => {
    const { dutyRenderList } = this.state;
    const tempValue = this.props.form.getFieldsValue();
    this.dealWithValue(tempValue, dutyRenderList)
    localStorage.setItem(id, JSON.stringify(this.state));
    localStorage.setItem('leapInsId', id);
    localStorage.setItem('productEditing', 0);
    message.success('暂存成功');
    this.props.history.push('/product/insurance');
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
  saveEditInsurance = (e, isHold) => {
    e.preventDefault();
    const { dutyRenderList } = this.state;
    const lcsKey = this.state.template_id ? this.state.template_id : 'leapIns';
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
      const { insurance_type_code } = values;
      values.insurance_type_code = insurance_type_code.toString();

      if (!err) {
        this.setState({formItemIsError: false});
       
        const parameterData = this.dealWithValue(values, dutyRenderList);
        console.log(parameterData);
        this.props.dispatch({
          type: 'product/saveInsuranceItem',
          payload: {
            ...parameterData[0],
          },
          callback: res => {
            if (res.status === 1) {
              message.success('保存成功', 2).then(() => {
                localStorage.setItem(lcsKey, '');
                localStorage.setItem('productEditing', 0);
                if(lastId && lastId === lcsKey) localStorage.setItem('leapInsId', '');
                return this.props.history.push('/product/insurance');
              });
            } else {
              message.error(res.message);
            }
          },
        });
      } else {
        this.setState({
          formItemIsError: true,
        });
      }
    });
  };

  // 暂存前处理好数据，以便存放在state里
  dealWithValue = (values, list) => {
    const {location,match: { path }} = this.props;

     // 记录头部信息
    this.valueToHeaher(values);
    let company_code, insurance_model, insurance_scope, template_id;
    if (!path.split('/').includes('add')) {
      company_code = this.state.company_code;
      insurance_model = this.state.insurance_model;
      insurance_scope = this.state.insurance_scope;
      template_id = this.state.template_id;
    } else {
      company_code = location.state.company_code;
      insurance_model = location.state.insurance_model;
      insurance_scope = location.state.insurance_scope;
    }
    const formData = this.restructuringObj(values, list);
    if (formData.age_at_issue) {
      const tempArray = {};
      tempArray.start_value = +formData.age_at_issue.start_value;
      tempArray.start_include = true;
      tempArray.end_value = +formData.age_at_issue.end_value;
      tempArray.end_include = true;
      delete formData.age_at_issue;
      formData.age_at_issue = tempArray;
    }
    const parameterData = {
      ...formData,
      company_code,
      insurance_model,
      insurance_scope,
      template_id,
    };

    const { duty_list: dutyList } = formData;
    if (dutyList.length > 1) {
      const dutyName = [];
      const dutyCode = [];
      const errorIndex = [];
      dutyList.forEach((dutyItem, index) => {
        dutyName.push(dutyItem.duty_name);
        dutyCode.push(dutyItem.duty_code);
        errorIndex.push(index);
      });
      const dutyNameSet = new Set(dutyName);
      const dutyCodeSet = new Set(dutyCode);
      const newDutyName = Array.from(dutyNameSet);
      const newDutyCode = Array.from(dutyCodeSet);

      const tempDutyRenderList = list.map((renderItem, renderIndex) => {
        if (errorIndex.includes(renderIndex)) {
          renderItem.dutyFieldsList.forEach(fieldsItem => {
            if (newDutyName.length === 1) {
              if (fieldsItem.item_key === 'duty_name') {
                fieldsItem.is_error = true;
              }
            }
            if (newDutyCode.length === 1) {
              if (fieldsItem.item_key === 'duty_code') {
                fieldsItem.is_error = true;
              }
            }
          });
        } else {
          renderItem.dutyFieldsList.forEach(fieldsItem => {
            fieldsItem.is_error = false;
          });
        }
        return renderItem;
      });

      this.setState({
        dutyRenderList: tempDutyRenderList,
      });

      if (newDutyName.length === 1 && newDutyCode.length === 1) {
        this.setState({
          dutyCode: newDutyCode[0],
          dutyName: newDutyName[0],
          isShowRepeatDutyCode: true,
        });
        // return;
      } else if (newDutyName.length === 1) {
        this.setState({
          dutyCode: '',
          dutyName: newDutyName[0],
          isShowRepeatDutyCode: true,
        });
        // return;
      } else if (newDutyCode.length === 1) {
        this.setState({
          dutyCode: newDutyCode[0],
          dutyName: '',
          isShowRepeatDutyCode: true,
        });
        // return;
      }
    }
    return filterValues([parameterData]);
  }

  // 处理头部信息
  valueToHeaher = (values) => {
    const { insuranceConfigFields } = this.state;
    insuranceConfigFields.forEach(field => {
      const key = field.item_key;
      if(key === 'age_at_issue'){
        Object.assign(field.range_value_item, values[key]);
      }else{
        field.item_value = values[key];
      }

      field.item_value = values[key];
    })
  }

  // 增加责任
  addDutyItem = () => {
    const { dutyRenderList, originalDutyFieldList } = this.state;
    dutyRenderList.push({ dutyFieldsList: originalDutyFieldList, dutyId: `dutyId${Math.floor(Math.random()*10000)}` });
    this.setState({
      dutyRenderList,
      isActiveSaveBtn: true,
    });
  };

  // 删除责任
  deleteDutyItem = index => {
    const { form: {getFieldsValue, setFieldsValue} } = this.props;
    const values = getFieldsValue();

    Object.keys(values).forEach(keyName => {  // 在values中循环出需要的值
      if(!keyName.includes(PREFIX)) return false;
      const [key, ind] = keyName.split(PREFIX);
      if(ind === index){
        delete values[keyName];
      } else if(ind > index){
        const kName = key + PREFIX + (ind -1);
        values[kName] = values[keyName];
      }
    });
    setFieldsValue(values);

    const { dutyRenderList } = this.state;
    const temp = dutyRenderList.concat([]);
    temp.splice(index, 1);

    this.setState({
      dutyRenderList: temp,
      isActiveSaveBtn: true,
    });
  };

  formIsTouched = (e, indexArr) => {
    // console.log(e, indexArr);
    if(!e && e !== 0 && !indexArr) return false;
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

  inpBlur = () => {
    const { dispatch, form: { getFieldsValue }, location: {state: {company_code}} } = this.props;
    const values = getFieldsValue();
    console.log(values);
    const {insurance_type_code} = values;
    console.log(insurance_type_code);
    dispatch({
      type: 'product/checkTemplateCode',
      payload: {company_code, insurance_type_code},
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

  inpValidator = (rule, value, callback, name) => {
    if (!value) callback();
    const chName = name === 'duty_name' ? '责任名称' : '责任代码';
    const { form:{ getFieldsValue } } = this.props;
    const values = getFieldsValue();
    const valArr = []
    Object.keys(values).forEach(key => {
      if(key.includes(name)) valArr.push(values[key]);
    });

    if (this.isRepeatInArr(valArr)) {
      callback(`此险种下该${chName}已存在，请勿重复`);
    }
    callback();
  }

  // 判断数组里的值是否重复
  isRepeatInArr = (arr) => {
    let hash = {};
    for(let i=0, len=arr.length; i<len; i++) {
      if(hash[arr[i]]) return true;
      hash[arr[i]] = true;
    }
    return false;
  }

  toggleMultiples = () => {
    const showMultiples = this.state.showMultiples;
    this.setState({
      showMultiples: !showMultiples,
    })
  }

  updateMulValue = (indexArr, itemKey, value) => {
    const { dutyRenderList } = this.state;
    const insTy = _.cloneDeep(dutyRenderList);
    const dtList = insTy[indexArr[0]].dutyFieldsList;

    dtList.forEach(dt => {
      if(dt.item_key === itemKey){
        dt.item_value = value;
        return false;
      }
    });

    this.setState({
      dutyRenderList: insTy,
    })
  }

  // 取消创建险种
  cancelEditInsurance = () => {
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
    this.props.history.push('/product/insurance');
  };

  handleRepeatButton = () => {
    this.setState({
      isShowRepeatDutyCode: false,
    });
  };

  handleRepeatCancelButton = () => {
    this.setState({
      isShowRepeatDutyCode: false,
    });
  };

  showErrorTips = () => {
    const { dutyCode, dutyName } = this.state;

    if (dutyCode && dutyName) {
      return (
        <span>
          此险种中有重复的责任名称（
          {dutyName}
          ）及责任代码（
          {dutyCode}
          ），请修改。
        </span>
      );
    } else {
      if (dutyCode) {
        return (
          <span>
            此险种中有重复的责任代码（
            {dutyCode}
            ），请修改。
          </span>
        );
      }
      if (dutyName) {
        return (
          <span>
            此险种中有重复的责任名称（
            {dutyName}
            ），请修改。
          </span>
        );
      }
    }
  };

  render() {
    const {
      isAdd,
      currentCompany,
      dutyRenderList,
      insuranceConfigFields,
      isActiveSaveBtn,
      isShowTipsModal,
      isAddTips,
      isShowRepeatDutyCode,
      formItemIsError,
    } = this.state;

    const { insId: insuranceCode } = this.props.match.params;
    const { getFieldDecorator } = this.props.form;
    const {
      location,
      match: { path },
    } = this.props;
    let insurance_model, insurance_scope;
    if (!path.split('/').includes('add')) {
      insurance_model = this.state.insurance_model;
      insurance_scope = this.state.insurance_scope;
    } else {
      insurance_model = location.state.insurance_model;
      insurance_scope = location.state.insurance_scope;
    }

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

    const isCanDelete = dutyRenderList.length === 1;
    const insuranceFieldList = refactoringFn(insuranceConfigFields);
    return (
      <div>
        <div className={styles.uiHeader}>
          <Row>
            <Col span={18}>
              <Breadcrumb separator="/">
                <Breadcrumb.Item className={styles.breadCrumb}>
                  <Link to="/product/insurance" onClick={(e) => onLinkClick(e, '/product/insurance', this.props)}>险种列表</Link>
                </Breadcrumb.Item>
                <Breadcrumb.Item className={styles.breadCrumb}>
                  {!isAdd ? `险种${insuranceCode}` : '创建险种及责任'}
                </Breadcrumb.Item>
              </Breadcrumb>
            </Col>
            <Col span={6} className={styles.alignRight}>
              <Button
                style={{ marginRight: '10px' }}
                type="primary"
                disabled={!isActiveSaveBtn || this.state.theCodeRep}
                onClick={this.saveEditInsurance}
              >
                保存
              </Button>

              <Button
                style={{ marginRight: '10px' }}
                type="primary"
                disabled={!isActiveSaveBtn}
                onClick={(e) => this.saveEditInsurance(e,true)}
              >
                暂存
              </Button>

              <Button type="primary" ghost onClick={this.cancelEditInsurance}>
                取消
              </Button>
            </Col>
          </Row>
        </div>
        <div className={styles.fixCard}>
          <Form>
            <div className={styles.uiTitle}>
              {insuranceModel[insurance_model]} {insuranceScope[insurance_scope]}
            </div>
            <div className={styles.uiBody}>
              <Row>
                <Col span={12} style={{ marginBottom: '20px' }}>
                  <div style={{width: '28%',float: 'left',textAlign: 'right',fontSize: '14px',color: 'rgba(0, 0, 0, 0.85)'}}>
                    <span style={{ color: '#f5222d', marginRight: '4px', fontFamily: 'SimSun' }}>*</span>
                    所属保险公司:
                  </div>
                  <div style={{ width: '68%', float: 'left', paddingLeft: '5px', fontSize: '14px' }}>
                    {currentCompany.map(item => item.company_name)}
                  </div>
                </Col>
              </Row>
              {insuranceFieldList.map(item => {
                return (
                  <Row key={item.colsId}>
                    {item.cols.map(list => {
                      let domItem = null;
                      if(list.item_key === 'insurance_type_code') {
                        domItem = (
                          <Col span={12} key={list.item_key}>
                            <FormItem 
                              {...formItemLayout} 
                              label="险种代码" 
                              validateStatus={this.state.theCodeRep ? 'error' : ''}
                              help={this.state.theCodeRep && '此险种代码已配置过，请勿重复配置'}
                            >
                              {getFieldDecorator('insurance_type_code', {
                                initialValue: list.item_value || '',
                                rules: [{
                                  required: true,
                                  message: '请填写险种代码',
                                }],
                              })(<Input placeholder="险种代码" onChange={this.formIsTouched} disabled={!isAdd} onBlur={this.inpBlur} />)}
                            </FormItem>
                          </Col>
                        );
                      } else {
                        const config = {
                          list, getFieldDecorator, 
                          onchange: this.formIsTouched,
                         };
                         domItem =  CreactDutyList(config);
                      }

                      return domItem;
                    })}
                  </Row>
                );
              })}
            </div>
            <div className={styles.uiTitle}>责任</div>
            {dutyRenderList.map((showItem, showIndex) => {
              const dutyFieldsList = _.cloneDeep(refactoringFn(showItem.dutyFieldsList));
              return (
                <div className={styles.uiBody} key={showItem.dutyId}>
                  {dutyFieldsList.map(item => {
                    return (
                      <Row key={item.colsId}>
                        {item.cols.map(list => {
                          const config = {
                            list, getFieldDecorator, 
                            postfix: PREFIX + showIndex,
                            indexArr: [showIndex],
                            onchange: this.formIsTouched,
                            inpValidator: this.inpValidator,
                          }
                          return CreactDutyList(config);
                        })}
                      </Row>
                    );
                  })}
                  <Row>
                    <Col span={24} className={styles.alignRight}>
                      <Button
                        icon="minus"
                        type="danger"
                        disabled={isCanDelete}
                        onClick={() => this.deleteDutyItem(showIndex)}
                      >
                        删除责任
                      </Button>
                    </Col>
                  </Row>
                </div>
              );
            })}
            <div className={styles.uiFooter}>
              <Row>
                <Col span={24} className={styles.alignRight}>
                  <Button icon="plus" type="primary" onClick={this.addDutyItem}>
                    增加责任
                  </Button>
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

        {/*  责任 重复 */}
        <Modal
          visible={isShowRepeatDutyCode}
          title={
            <div style={{ fontSize: 16 }}>
              <Icon type="warning" style={{ color: 'rgb(241, 194, 22)', fontSize: 24, margin: 6 }} />
              提示
            </div>
          }
          onOk={this.handleRepeatButton}
          onCancel={this.handleRepeatCancelButton}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleRepeatButton}>
              知道了
            </Button>,
          ]}
        >
          <p style={{ textAlign: 'center' }}>{this.showErrorTips()}</p>
        </Modal>

        {/* 疾病责免 */}
        {this.state.showMultiples && 
          <CreateMultiples 
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

export default EditInsurance;
