import React, { Component } from 'react';
import {Form, Input, Button, Row, Col, Modal, Table, Tabs} from 'antd';
import _ from 'lodash';
import styles from './multiples.less';

const FormItem = Form.Item;
const {TabPane} = Tabs;

const hospitalData = [{
  label: '医院代码',
  type: 'Input',
  options: '',
  key: 'hospital_code',
}, {
  label: '医院名称',
  type: 'Input',
  options: '',
  key: 'hospital_name',
}, {
  label: '医院所属地区',
  type: 'Input',
  options: '',
  key: 'hospital_area',
}];
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

export default class HsptMultiples extends Component {
  state = {
    selectArr: [],
    selectList: [],
    selectedArr: [],
    selectedList: [],
    secShowLen: 0,
    secShowArr: [],
    tabIndex: "0",
  };

  componentDidMount(){
    console.log(this.props);
  }

  touchHsptList = () => {
    const { data: {indexArr, insuranceTypes, hsptKey, hsptIndex} } = this.props;
    const vList = insuranceTypes[indexArr[0]].duty_list[indexArr[1]];
    const {selectArr} = this.state;
    const secShowArr = [];
    let selectList = [];
    for(let i = 0, k = vList.length; i < k; i += 1){
      const item = vList[i];
      if(item.item_key === hsptKey){
        selectList = item.item_value;
        break;
      }
    }

    selectList.forEach((cod) => {
      selectArr.forEach((item) => {
        if(item.hospital_code === cod) secShowArr.push(item)
      })
    });
    this.setState({
      secShowArr,
      tabIndex: hsptIndex,
      secShowLen: secShowArr.length
    });
  }

  onSearch = () => {
    const selectArr = [];
    for (let i=0, k=100; i<k; i += 1) {
      selectArr.push({
        hospital_code: `hospital_code${i}`,
        hospital_name: `hospital_name${i}`,
        hospital_area: `hospital_area${i}`,
      });
    }
    this.setState({selectArr}, () =>{
      // if (callback) callback();
      this.touchHsptList();
    });
  }

  toSave = () =>{
    const {data, isShow, updateMulValue} = this.props;
    const {indexArr, hsptKey} = data;
    const {selectList} = this.state;

    isShow(true);
    updateMulValue(indexArr, hsptKey, selectList);
  }

  creatColumns = () => {
    const Columns = [];
    hospitalData.forEach((inv) => {
      Columns.push({
        title: inv.label,
        dataIndex: inv.key,
        key: inv.key,
      })
    });
    return Columns;
  }

  // 复选框
  onSelectChange = (codArr, objArr) => {
    const { tabIndex } = this.state;
    if (tabIndex === "0") {
      this.setState({
        selectedArr: objArr, 
        selectList: codArr,
      });
    } else {
      this.setState({
        selectedList: codArr,
      });
    }
  };

  tabChange = (tabkey) => {
    this.setState({ tabIndex: tabkey });
  }

  toAddHospt = () => {
    const { selectedArr, secShowArr } = this.state;
    selectedArr.forEach((item) => {
      const ifHas = secShowArr.some(sec => sec.hospital_code === item.hospital_code);
      if(!ifHas) secShowArr.push(item);
    });
    this.setState({ 
      secShowLen: secShowArr.length,
      secShowArr,
    });
  }
  
  toDelHospt = () => {
    const { secShowArr, selectedList } = this.state;
    const selList = [];
    selectedList.forEach((cod) => {
      for (let i=0, k=secShowArr.length; i<k; i += 1) {
        if (cod === secShowArr[i].hospital_code){
          secShowArr.splice(i, 1);
          break;
        }
      }
    });

    secShowArr.forEach((item) => {
      selList.push(item.hospital_code);
    });
    this.setState({
      secShowArr,
      secShowLen: secShowArr.length,
      selectList: selList,
    });
  }

  render() {
    const {selectArr, selectList, secShowArr, selectedList, tabIndex, secShowLen} = this.state;
    const {isShow, form} = this.props;
    const showData = tabIndex === "0" ? selectArr : secShowArr;
    const Secled = tabIndex === "0" ? selectList : selectedList;
    const rowSelection = {
      selectedRowKeys: Secled,
      onChange: this.onSelectChange,
    };

    return (
      <Modal
        visible
        title="选择除外医院"
        width={1000}
        onCancel={() => isShow(true)}
        onOk={this.toSave}
        okText="保存"
      >
        <Row>
          { hospitalData.map((hspt) => (
            <Col span={7} key={hspt.key}>
              <FormItem {...formItemLayout} label={hspt.label}>
                {form.getFieldDecorator(hspt.key)(
                  <Input placeholder="请输入" onChange={this.formIsTouched} />
                )}
              </FormItem>
            </Col>
          ))
          }
          
          <Col span={3}>
            <div className={styles.hsptBtnbox}>
              <Button type="primary" onClick={this.onSearch}>搜索</Button>
            </div>
          </Col>
        </Row>

        <Tabs activeKey={tabIndex} onChange={this.tabChange} className={styles.tabsbox}>
          <TabPane tab={`筛选结果(${selectArr.length})`} key="0" />
          <TabPane tab={`已加入除外医院(${secShowLen})`} key="1" />
        </Tabs>

        {tabIndex === "0" ? 
          <Button type="primary" ghost className={styles.tabsbtn} onClick={this.toAddHospt}>加入除外医院</Button> :
          <Button type="primary" ghost className={styles.tabsbtn} onClick={this.toDelHospt}>移除</Button> 
        }

        <Table
          rowSelection={rowSelection}
          columns={this.creatColumns()}
          dataSource={showData}
          size="middle"
          locale={{ emptyText: '请搜索您想选择的医院' }}
          rowKey={rec => rec.hospital_code}
        />
      </Modal>
    );
  }
}


