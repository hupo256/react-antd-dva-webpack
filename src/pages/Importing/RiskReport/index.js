import React, { Component } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import moment from 'moment';
import {
  Form,
  Tabs,
  Table,
  Breadcrumb,
  Card,
  Select,
  Input,
  Icon,
  message,
  Popover
} from 'antd';
import { TagCloud } from '@/components/Charts';
import Echarts from 'echarts-for-react';
import styles from './style.less';
import feepie from './charts/feepie';
import typepie from './charts/typepie';
import regionpie from './charts/regionpie';
import bar from './charts/bar';
import genderbar from './charts/genderbar';
import riskgauge from './charts/riskgauge';
import lady from '../../../assets/Riskcontrol/女士.svg';
import gentleman from '../../../assets/Riskcontrol/男士.svg';

const { TabPane } = Tabs;
const { Option } = Select;

const riskcolor = {'高':'#FF450D','中':'#FF9600','低':'#FFDF3C'};

@Form.create(state => ({
  riskControl: state.riskControl,
}))
@connect()
class RiskControl extends Component {
  constructor(props) {
    super(props);
    const payload = parse(window.location.href.split('?')[1]);
    this.state = {
      // eventstatus: [],
      ondetail: false,
      tab1: true,
      tab2: true,
      tab3: true,
      tab4: true,
      tab5: true,
      barhover: false,
      hintx:0,
      hinty:0,
      batchId: payload.batchId,
      riskList:[],
      claimId:undefined,
      riskName:undefined,
      cityName:undefined,
      hospitalName:undefined,
      riskLevel:undefined
    };
  }

  componentDidMount() {
    const {barhover} = this.state;
    this.getData();
    if(this.mychart){
      this.mychart.getEchartsInstance().off('mouseover');
      this.mychart.getEchartsInstance().on('mouseover', (params) => {
        if(params.componentType==='yAxis'&&barhover===false){
          console.log(params.value);
          // console.log(params.event.event.offsetX);
          this.setState({barhover: true, hintx:params.event.event.offsetX-60, hinty:params.event.event.offsetY+10});
        }
      });
      this.mychart.getEchartsInstance().on('mouseout', () => {
        console.log('leaving');
        this.setState({barhover: false});
      });
    }
    this.getRiskList();
  }

  getData(){
    const { batchId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type:'riskControl/getDruidData',
      payload:{
        "aggregations":[
          {
            "type": "thetaSketch",
            "name": "claim_id",
            "fieldName": "claim_id",
            "isInputHyperUnique": false,
            "round": true
          },
          {
            "type": "filtered",
            "filter": {
              "type": "thetaSketch",
              "name": "claim_id",
              "fieldName": "claim_id",
              "isInputHyperUnique": false,
              "round": true
            },
            "aggregator": {
              "fieldName":"risk_amount_sum",
              "name":"risk_amount_sum",
              "type":"doubleSum"
            }
          },
          {
            "type": "filtered",
            "filter": {
              "type": "not",
              "field": { "type": "selector", "dimension": "risk_name", "value": null }
            },
            "aggregator": {
                "fieldName": "claim_id",
                "name": "risk_claim_count",
                "type": "count"
            }
          },
          {
            "fieldName":"bill_amt_sum",
            "name":"bill_amt_sum",
            "type":"doubleSum"
          },
          {
            "type": "filtered",
            "filter": {
              "type": "not",
              "field": { "type": "selector", "dimension": "risk_name", "value": null }
            },
            "aggregator": {
                "fieldName": "insured_id",
                "name": "risk_person_count",
                "type": "count"
            }
          },
          {
            "type": "filtered",
            "filter": {
              "type": "not",
              "field": { "type": "selector", "dimension": "risk_name", "value": null }
            },
            "aggregator": {
                "fieldName": "hospital_name",
                "name": "hospital_name_count",
                "type": "count"
            }
          },
        ],
        "dimensions":[],
        "dataSource":"claim_report",
        "granularity":{
          "type":"all"
        },
        "limitSpec":{
          "type": "default",
          "columns": [
              {
                  "dimension": "risk_amount_sum",
                  "direction":"descending"
              }
          ],
          "limit": 10
      },
        "queryType":"groupBy",
        "intervals":["2000-01-01T01:00:00/2100-06-17T04:00:00"],
        "filter": {
          "type": "and",
          "fields": [
            {
              "type": "not",
              "field": { "type": "selector", "dimension": "risk_name", "value": null }
            },
            {
              "type": 'regex',
              "dimension": 'batch_id',
              "pattern": '190613115947549'
            },
          ]
        },
        // "pagingSpec":{"pagingIdentifiers": {}, "threshold":1000}
      },
      callback:(res)=>{
        console.log(res);
      }
    })
  }

  getRiskList(){
    const { dispatch } = this.props;
    const { batchId, claimId, riskLevel, riskName, hospitalName, cityName } = this.state;
    dispatch({
      type:'riskControl/fetchRiskList',
      payload:{
        batchId, claimId, riskLevel, riskName, hospitalName, cityName
      },
      callback:(res)=>{
        if(res.code==='000000'){
          const list = [];
          const nos = [];
          res.data.forEach((item)=>{
            if(nos.indexOf(item.claimId)<0){
              list.push(item);
              nos.push(item.claimId);
            }else{
              const index = list.findIndex((line)=>line.claimId===item.claimId);
              list[index].riskName = `${list[index].riskName};${item.riskName}`;
            }
          });
          this.setState({riskList: list});
        }
      }
    })
  }

  toggleEvent = (index) => {
    const { eventTrigger } = this.state;
    eventTrigger[index] = !eventTrigger[index];
    this.setState({eventTrigger});
  }

  fetchDetail = (record) => {
    const { dispatch } = this.props;
    const { batchId } = this.state;
    dispatch({
      type:'riskControl/fetchRiskDetail',
      payload:{
        batchId,
        claimId: record.claimId
      },
      callback:(res)=>{
        console.log(res.data);
        if(res.code==='000000'){
          this.setState({
            ondetail: true,
            detail: res.data,
            currentrecord:record,
            eventTrigger:res.data.eventList.map(()=>false)
          });
        }else{
          message.error('信息获取失败！');
        }
      }
    })
  }

  submitFeedback=(payload) => {
    const { dispatch } = this.props;
    const { currentrecord } = this.state;
    dispatch({
      type:'riskControl/submitFeedback',
      payload,
      callback:(res)=>{
        if(res.code==='000000'){
          message.success('反馈成功！');
          this.fetchDetail(currentrecord);
        }else{
          message.error(res.message);
        }
      }
    })
  }

  highlightTag = (tagName, event) => {
    let result = null;
    const { claimId } = this.state;
    const getRisk = (item)=>{
      const payload = {
        riskClaimEventTreeId: item.riskClaimEventTreeId,
        riskReportId: item.riskReportId,
        claimId
      };
      const resultType = item.feedList&&item.feedList[item.feedList.length-1].resultType;
      return(
        <div style={{maxWidth:200}}>
          <div className={styles.poptitle}>{item.riskName}</div>
          <div>{item.riskDescription}</div>
          <div className={styles.riskbtns}>
            <div
              style={{backgroundColor:resultType===0?'#4291EB':''}}
              onClick={(e)=>{e.stopPropagation();this.submitFeedback({resultType:0,...payload})}}
            >准确
            </div>
            <div
              style={{backgroundColor:resultType===1?'#EB3850':''}}
              onClick={(e)=>{e.stopPropagation();this.submitFeedback({resultType:1,...payload})}}
            >不准确
            </div>
          </div>
        </div>)};
    const getContent = (name)=>{
      if(name==='billDate')
        return `发票日期：${moment(event[name]).format('YYYY-MM-DD')}`;
      if(name==='billAmt'||name==='price'||name==='amount')
        return `${name==='billAmt'?'发票金额：':''}${event[name]?event[name].toFixed(2):'0.00'}${name==='billAmt'?'元':''}`;
      if(name==='illCode')
        return `主要诊断：${event[name]}${event.illName}`;
      return event[name];
    };
    if(event.isHit&&event.typeModel)
      event.typeModel.forEach((item)=>{
        if(item.tag&&item.tag.length&&item.tag.indexOf(tagName)>-1){
          result =  (
            <span>
              <div className={styles.hightlight}>{getContent(tagName)}</div>
              <Popover content={getRisk(item)}>
                <Icon
                  type='info-circle'
                  style={{color:'#4291EB',marginLeft:6}}
                />
              </Popover>
            </span>);
        }
      });
    return result||getContent(tagName);
  }

  getIndex = (index) => {
    const str = index.toString();
    const mat = ['〇', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    let result = '';
    for (let i = 0; i < str.length; i += 1) {
      result += mat[str[i]];
    }
    return `事件${result}`;
  };

  render() {
    const {
      ondetail,
      tab1,
      tab2,
      tab3,
      tab4,
      tab5,
      barhover,
      hintx,
      hinty,
      riskList,
      claimId,
      riskName,
      riskLevel,
      hospitalName,
      cityName,
      detail,
      currentrecord,
      eventTrigger,
      batchId
    } = this.state;
    const { history } = this.props;
    const events = detail&&detail.eventList;
    const eventNos = events&&events.map((event)=>event.eventNo);
    const tableColumn = [
      {
        title:'医疗机构名称',
        dataIndex:'hospital'
      },
      {
        title:'风险金额/批次金额',
        dataIndex:'amount'
      },
      {
        title:'百分比',
        dataIndex:'percent'
      }
    ];
    const getEventNum = (a) => a.map((name)=>eventNos?this.getIndex(eventNos.indexOf(name)+1):'').join(',');
    const caseColumn = [
      {
        title:'赔案号',
        dataIndex:'claimId'
      },
      {
        title:'风险场景名称',
        dataIndex:'riskName',
        render:(text)=>{
          const arr = text.split(';');
          const len = arr.length;
          const others = (<div>{arr.splice(1).join('\n')}</div>);
          if(len>1)
            return(<div>{arr[0]}<Popover content={others}><div className={styles.others}>其余{arr.length}个</div></Popover></div>);
          return text;
        }
      },
      {
        title:'分支机构',
        dataIndex:'cityName'
      },{
        title:'风险金额',
        dataIndex:'claimPay',
        render:(text)=>text?text.toFixed(2):'0.00'
      },
      {
        title:'医疗机构',
        dataIndex:'hospitalName'
      },
      {
        title:'风险等级',
        dataIndex:'riskLevel',
        render:(text)=><div style={{color:riskcolor[text]}}>{text}</div>
      }
    ];
    const content =(text)=> (
      <div>
        {getEventNum(text)}
      </div>);
    const sceneColumn = [
      {
        title:'场景名称',
        dataIndex:'riskName'
      },
      {
        title:'场景描述',
        dataIndex:'riskDescription'
      },
      {
        title:'风险金额（元）',
        dataIndex:'claimPay',
        render:(text)=>text?text.toFixed(2):'0.00'
      },{
        title:'涉及事件数量',
        dataIndex:'eventNoList',
        render:(text)=>
          <div>{text.length}{text.length>0?
            <Popover content={content(text)}>
              <Icon
                type='info-circle'
                style={{color:'#4291EB',marginLeft:6}}
              />
            </Popover>
          :''}
          </div>
      },
      {
        title:'反馈',
        dataIndex:'amount1'
      }
    ];
    const itemColumn = [
      {
        title:'账单名称',
        dataIndex:'itemSubName',
        render:(text, record)=>this.highlightTag('itemSubName',record)
      },
      {
        title:'费用名称',
        dataIndex:'name',
        render:(text, record)=>this.highlightTag('name',record)
      },
      {
        title:'单价（元）',
        dataIndex:'price',
        render:(text, record)=>this.highlightTag('price',record)
      },{
        title:'数量',
        render:(text, record)=>this.highlightTag('number',record)
      },
      {
        title:'金额（元）',
        dataIndex:'amount',
        render:(text, record)=>this.highlightTag('amount',record)
      }
    ];
    const names = ['就诊日期异常','延期报案','涉及免费','门诊频繁就诊','既往症','过度检查','延长住院','跨性别用药','虚假用药','信息异常'];
    const values = [150,260,320,480,540,600,770,880,960,1000];
    const getEventDetail = (invoices)=>invoices.map((invoice)=>(
      <div>
        <div className={styles.detailLine}>
          <div className={styles.detailTag}>{this.highlightTag('billDate',invoice)}</div>
          <div className={styles.detailTag}>发票号：{this.highlightTag('billSno',invoice)}</div>
          <div className={styles.detailTag}>发票类型：{this.highlightTag('billTypeName',invoice)}</div>
          <div className={styles.detailTag}>{this.highlightTag('billAmt',invoice)}</div>
        </div>
        <Table className={styles.eventtable} dataSource={invoice.items} columns={itemColumn} />
      </div>
    ));
    const getEvents = events&&events.map((event, index)=>(
      <div className={styles.singleEvent}>
        <div className={styles.eventTitle} onClick={()=>this.toggleEvent(index)}>
          {event.isHit?<Icon className={styles.warningicon} type="warning" />:''}
          <div className={styles.eventno}>{this.getIndex(index+1)}</div>
          <div className={styles.eventid}>{this.highlightTag('eventNo',event)}</div>
          <div className={styles.eventdiagnosis}>{this.highlightTag('illCode',event)}</div>
          <Icon type={eventTrigger[index]?"up":"down"} className={styles.downicon} />
        </div>
        {/* <div className={styles.comment}>3条明细异常</div> */}
        {eventTrigger[index]&&getEventDetail(event.invoices)}
      </div>));
    // const units = value => (value / 10000 >= 1 ? [`${(value / 100).toFixed(2) / 100}`,'w'] : [`${value}`,`件`]);
    return (
      <div className={styles.fullboard}>
        <div className={styles.breadLine}>
          <Breadcrumb>
            <Breadcrumb.Item
              onClick={() => {
                history.push('/riskcontrol');
              }}
            >
              批次列表
            </Breadcrumb.Item>
            <Breadcrumb.Item>批次{batchId}风控详情</Breadcrumb.Item>
          </Breadcrumb>
        </div>
        <Tabs defaultActiveKey="1">
          <TabPane tab="批次风险总览" key="1">
            <div className={styles.blocks}>
              <div style={{height:'410px'}}>
                <div className={styles.titleLine}>
                  <div className={styles.subTitle}>数据总览</div>
                </div>
                <div className={styles.datablocks}>
                  <div className={styles.datablock}>
                    <div className={styles.datatitle}>风险金额/批次总金额</div>
                    <div className={styles.datacontent}>
                      <div className={styles.bignum}>20.4</div>
                      <div className={styles.numunit}>件</div>
                      <div className={styles.numdeno}>/ 51 件</div>
                    </div>
                  </div>
                  <div className={styles.datablock}>
                    <div className={styles.datatitle}>风险案件/批次总案件</div>
                    <div className={styles.datacontent}>
                      <div className={styles.bignum}>36</div>
                      <div className={styles.numunit}>件</div>
                      <div className={styles.numdeno}>/ 205 件</div>
                    </div>
                  </div>
                  <div className={styles.datablock}>
                    <div className={styles.datatitle}>风险参保人</div>
                    <div className={styles.datacontent}>
                      <div className={styles.bignum}>13</div>
                      <div className={styles.numunit}>人</div>
                    </div>
                  </div>
                  <div className={styles.datablock}>
                    <div className={styles.datatitle}>风险医疗机构</div>
                    <div className={styles.datacontent}>
                      <div className={styles.bignum}>56</div>
                      <div className={styles.numunit}>家</div>
                    </div>
                  </div>
                </div>
                <div className={styles.feepie}>
                  <div className={styles.datatitle}>各金额占比</div>
                  <Echarts option={feepie(1,1,1,1)} style={{height:150}} />
                </div>
              </div>
              <div style={{height:'410px',position:'relative'}}>
                <div className={styles.titleLine}>
                  <div className={styles.subTitle}>各风险场景金额排名</div>
                  <div className={styles.tagselection}>
                    <span className={tab1?styles.activespan:''} onClick={()=>this.setState({tab1: true})}>按金额</span>  |  <span className={tab1?'':styles.activespan} onClick={()=>this.setState({tab1: false})}>按案件数量</span>
                  </div>
                  {barhover&&<div className={styles.hoverhint} style={{zIndex:200,position:'absolute', left:hintx,top: hinty}}>这里是说明文字</div>}
                  <Echarts option={bar(names, values)} style={{height:380,marginTop:20}} ref={(e) => { this.mychart = e; }} />
                </div>

              </div>
              <div style={{height:'410px'}}>
                <div className={styles.titleLine}>
                  <div className={styles.subTitle}>风险人群画像</div>
                  <div className={styles.tagselection}>
                    <span className={tab2?styles.activespan:''} onClick={()=>this.setState({tab2: true})}>按金额</span>  |  <span className={tab2?'':styles.activespan} onClick={()=>this.setState({tab2: false})}>按案件数量</span>
                  </div>
                </div>
                <div className={styles.gender}>
                  <div className={styles.genderpic} style={{textAlign:'right'}}>
                    <img src={gentleman} alt='man' />
                    <div className={styles.genderlabel}>男性</div>
                  </div>
                  <div className={styles.genderbar}>
                    <div className={styles.percent}>40%         60%</div>
                    <div className={styles.percentbar}>
                      <div style={{width:`${40}%`, height:'100%', float:'left', background:'#6DB2F7'}} />
                      <div style={{width:`${60}%`, height:'100%', float:'left', background:'#FF8F96'}} />
                    </div>
                  </div>
                  <div className={styles.genderpic}>
                    <img src={lady} alt='woman' />
                    <div className={styles.genderlabel}>女性</div>
                  </div>
                </div>
                <div className={styles.genderbarchart}>
                  <Echarts option={genderbar(10,15)} style={{height:140}} />
                </div>

                <Echarts option={typepie(1,1,1)} style={{height:150}} />
              </div>
              <div style={{height:'360px'}}>
                <div className={styles.titleLine}>
                  <div className={styles.subTitle}>省辖区各市级分支机构风险金额占比</div>
                  <div className={styles.tagselection}>
                    <span className={tab3?styles.activespan:''} onClick={()=>this.setState({tab3: true})}>按金额</span>  |  <span className={tab3?'':styles.activespan} onClick={()=>this.setState({tab3: false})}>按案件数量</span>
                  </div>
                </div>
                <Echarts option={regionpie(1,1,1)} style={{height:250}} />
              </div>
              <div style={{height:'360px'}}>
                <div className={styles.titleLine}>
                  <div className={styles.subTitle}>风险金额前10名医疗机构</div>
                  <div className={styles.tagselection}>
                    <span className={tab4?styles.activespan:''} onClick={()=>this.setState({tab4: true})}>按金额</span>  |  <span className={tab4?'':styles.activespan} onClick={()=>this.setState({tab4: false})}>按案件数量</span>
                  </div>
                </div>
                <Table className={styles.datatable} dataSource={[{},{},{},{},{},{},{},{},{},{}]} columns={tableColumn} pagination={false} />
              </div>
              <div style={{height:'360px'}}>
                <div className={styles.titleLine}>
                  <div className={styles.subTitle}>风险金额前10名药品或疾病</div>
                  <div className={styles.tagselection}>
                    <span className={tab5?styles.activespan:''} onClick={()=>this.setState({tab5: true})}>疾病</span>  |  <span className={tab5?'':styles.activespan} onClick={()=>this.setState({tab5: false})}>药品</span>
                  </div>
                </div>
                <TagCloud data={[{'name':'非洛地平片','value':11},{'name':'氨苯蝶啶','value':11}]} height={161} />
              </div>
            </div>
          </TabPane>
          <TabPane tab="批次案件风险详情" key="2">
            <Card className={styles.detailCard}>
              <div className={styles.selects}>
                <div className={styles.singleselect}>
                  <div className={styles.label}>赔案号：</div>
                  <Input placeholder='请输入' onChange={(e)=>this.setState({claimId:e.target.value})} value={claimId} onBlur={()=>this.getRiskList()} />
                </div>
                <div className={styles.singleselect}>
                  <div className={styles.label}>场景名称：</div>
                  <Input placeholder='请输入' onChange={(e)=>this.setState({riskName:e.target.value})} value={riskName} onBlur={()=>this.getRiskList()} />
                </div>
                <div className={styles.singleselect}>
                  <div className={styles.label}>分支机构：</div>
                  <Input placeholder='请输入' onChange={(e)=>this.setState({cityName:e.target.value})} value={cityName} onBlur={()=>this.getRiskList()} />
                </div>
                <div className={styles.singleselect}>
                  <div className={styles.label}>医疗机构：</div>
                  <Input placeholder='请输入' onChange={(e)=>this.setState({hospitalName:e.target.value})} value={hospitalName} onBlur={()=>this.getRiskList()} />
                </div>
                <div className={styles.singleselect}>
                  <div className={styles.label}>风险等级：</div>
                  <Select className={styles.selectline} placeholder='请选择' value={riskLevel} onChange={(e)=>this.setState({riskLevel:e},()=>this.getRiskList())}>
                    <Option value='低'>低</Option>
                    <Option value='中'>中</Option>
                    <Option value='高'>高</Option>
                    <Option value={undefined}>不限</Option>
                  </Select>
                </div>
              </div>
              <div className={styles.caseamount}>风险案件（{riskList.length}）</div>
              <Table
                className={styles.casetable}
                dataSource={riskList}
                columns={caseColumn}
                onRowClick={(record)=>this.fetchDetail(record)}
              />
            </Card>
          </TabPane>
        </Tabs>
        {ondetail&&
        <Card className={styles.popcard}>
          <Icon className={styles.closeicon} type="close" onClick={()=>this.setState({ondetail: false})} />
          <div className={styles.riskinfo}>
            <div className={styles.risktag}>
              <div className={styles.risklabel}>风险等级：</div>
              <div className={styles.riskscore}>
                <Echarts option={riskgauge(currentrecord.riskScore)} style={{height:80, width:80, marginTop:'-20px'}} />
              </div>
            </div>
            <div className={styles.risktag}>
              <div className={styles.risklabel}>风险评分：</div>
              <div className={styles.riskscore}>{currentrecord.riskScore}</div>
            </div>
            <div className={styles.risktag}>
              <div className={styles.risklabel}>风险金额：</div>
              <div className={styles.riskamount} style={{color: riskcolor[currentrecord.riskLevel]}}>
                {(currentrecord.claimPay||0).toFixed(2)}
              </div>
              <div className={styles.riskunit}>元</div>
            </div>
          </div>
          <div className={styles.casesubtitle}>风险场景（{detail.models.length}）</div>
          <Table className={styles.casetable} dataSource={detail.models} columns={sceneColumn} pagination={false} />
          <div className={styles.casesubtitle} style={{marginTop:40}}>赔案基本信息</div>
          <div className={styles.basicblock}>
            <div>被保人姓名：{detail.baseClaim.insuredName}</div>
            <div>职业：{detail.baseClaim.insuredJob}</div>
            <div>投保渠道：{detail.baseClaim.channel}</div>
            <div>保单有效期：{detail.baseClaim.expiryDate}</div>
          </div>
          <div className={styles.casesubtitle}>事件信息（{detail.eventList.length}）</div>
          {getEvents}
        </Card>}
      </div>
    );
  }
}

export default RiskControl;
