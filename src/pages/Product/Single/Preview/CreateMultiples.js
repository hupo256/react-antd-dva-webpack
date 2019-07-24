import React, { Component } from 'react';
import {Form, Checkbox, Input, Button} from 'antd';
import styles from './multiples.less';
import selectValues from './selectValues';

const FormItem = Form.Item;
const CheckboxGroup = Checkbox.Group;
const {Search} = Input;

export default class Multiples extends Component {
  state = {
    checkArr: [],
    itemKey: 'ill_disclaim',
    valueList: [],
  };

  componentDidMount(){
    const {data} = this.props;
    const {indexArr} = data;
    let dataList = [];
    if(data.insuranceTypes){
      dataList = data.insuranceTypes[indexArr[0]].duty_list[indexArr[1]];
    }else if(data.groupLevels){
      dataList = data.groupLevels[indexArr[0]].insurance_types[indexArr[1]].duty_list[indexArr[2]];
    }else if(data.dutyRenderList){
      dataList = data.dutyRenderList[indexArr[0]].dutyFieldsList;
    }
    console.log(dataList);
    this.getCheckList(dataList);
  }

  getCheckList = (list) => {
    const {itemKey} = this.state;
    list.forEach(element => {
      if(element.item_key === itemKey){
        const checkArr =  element.select_value_items;
        this.setState({
          valueList: element.item_value,
          checkArr
        });
        return false;
      }
    });
  }

  onSearch = (e) => {
    const val = e.target ? e.target.value : e;
    const checkArr = selectValues.filter(check => check.select_text.indexOf(val) > -1);
    this.setState({checkArr})
  }

  checkChange = (e) => {
    console.log(e);
  }

  toSave = () =>{
    const {data, form, isShow, updateMulValue} = this.props;
    const {indexArr} = data;
    const {getFieldValue} = form;
    const {itemKey} = this.state;
    const selectVale = getFieldValue(itemKey);

    isShow();
    updateMulValue(indexArr, itemKey, selectVale);
  }

  isSelectAll = (e) => {
    const {form: { setFieldsValue }} = this.props;
    const { checkArr, itemKey } = this.state;
    let { valueList } = this.state;
    if(e.target.checked){
      valueList = [];
      checkArr.forEach(check =>{
        valueList.push(check.select_code);
      })
    }else{
      valueList = [];
    }

    setFieldsValue({[itemKey]: valueList});
  }

  creatChecksDom = (chcekList, valueList) => {
    const { form } = this.props;
    const {getFieldDecorator} = form;
    const {itemKey} = this.state;
    const checkboxOptions = [];
    
    chcekList.map((check) => (
      checkboxOptions.push({
        label: check.select_text,
        value: check.select_code,
      })
    ));

    const fieldItem =  <CheckboxGroup onChange={this.checkChange} options={checkboxOptions} />
    return (
      <FormItem>
        {getFieldDecorator(itemKey, 
          {initialValue: valueList}
        )(fieldItem)}
      </FormItem>
    )
  }

  render() {
    const {checkArr, valueList} = this.state;
    const {isShow} = this.props;
    return (
      <div className={styles.selectBox}>
        <div className={styles.selectcon}>
          <h3>选择疾病责免 <span onClick={() => isShow()}>X</span></h3>

          <div className={styles.searchbox}>
            <Search placeholder="搜索疾病" onChange={this.onSearch} style={{width:'70%'}} />
            <Checkbox   
              onChange={this.isSelectAll} 
              // checked={checkArr.length === valueList.length}
            >
              全选
            </Checkbox>
          </div>

          <div className={styles.checks}>
            {checkArr.length>0 && this.creatChecksDom(checkArr, valueList)}
          </div>

          <div className={styles.bottombox}>
            <Button type="primary" size='small' onClick={this.toSave}>保存</Button>
          </div>
        </div>
      </div>
    );
  }
}


