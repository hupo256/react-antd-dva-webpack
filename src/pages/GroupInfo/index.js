import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Table } from 'antd';

import Echarts from 'echarts-for-react';
import echartsori from 'echarts';
import _ from 'lodash';
import GroupHeader from './GroupHeader';
import styles from './style.less';
import { TagCloud } from '../../components/Charts';

import zbf from '../../assets/Group/总保费.svg';
import cbrs from '../../assets/Group/承保人数.svg';
import bdrs from '../../assets/Group/保单人数.svg';
import cxaj from '../../assets/Group/出险案件.svg';
import cxrs from '../../assets/Group/出险人数.svg';

import female from '../../assets/Group/女性.svg';
import male from '../../assets/Group/男性.svg';

const claimPayConfig = {
  color: ['#4291EB', '#39CCC7', '#FF450D'],
  backgroundColor: 'rgba(240, 242, 244, 0.38)',
  title: {
    x: 'center',
    top: '12',
    text: '2017年6月-2018年5月 出险金额分布',
    textStyle: {
      color: '#103678',
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985',
      },
    },
  },
  legend: {
    right: 20,
    orient: 'vertical',
    top: 'center',
    formatter: name => {
      const d = {
        出险金额: '  ',
        // 赔付金额: '  1,834,000元',
        // 风险金额: '  502,000元',
      };

      return name + d[name];
    },
    data: [
      { name: '出险金额', icon: 'line', textStyle: { color: '#4291EB' } },
      // { name: '赔付金额', icon: 'line', textStyle: { color: '#39CCC7' } },
      // { name: '风险金额', icon: 'line', textStyle: { color: '#FF450D' } },
    ],
  },
  grid: {
    left: '3%',
    right: 200,
    bottom: '3%',
    containLabel: true,
    backgroundColor: 'rgba(240, 242, 244, 0.38)',
  },
  xAxis: [
    {
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: '#E5E8ED',
        },
      },
      axisLabel: {
        color: '#103678',
      },
      type: 'category',
      boundaryGap: false,
      data: [ '6月', '7月', '8月', '9月', '10月', '11月', '12月', '1月', '2月', '3月', '4月', '5月',],
    },
  ],
  yAxis: [
    {
      name: '金额',
      nameTextStyle: {
        color: '#103678',
      },
      type: 'value',
      splitLine: {
        lineStyle: {
          type: 'dashed',
        },
      },
      axisLine: {
        lineStyle: {
          color: '#E5E8ED',
        },
      },
      axisLabel: {
        color: '#103678',
        formatter: value => (value / 10000 >= 1 ? `${(value / 100).toFixed(2) / 100}W` : value),
      },
    },
  ],
  series: [
    {
      name: '出险金额',
      type: 'line',
      areaStyle: {
        color: '#EBF7FF',
      },
      data: [
        6045294.25,
        6113093.00,
        6029503.01,
        5830266.34,
        6153833.30,
        6138693.28,
        7195782.10,
        6828288.23,
        4604618.92,
        7126623.85,
        6413790.64,
        7051534.63,
      ],
    },
    // {
    //   name: '赔付金额',
    //   type: 'line',
    //   areaStyle: {
    //     color: '#B8F2EA',
    //   },
    //   data: [
    //     230000,
    //     120000,
    //     132000,
    //     101000,
    //     134000,
    //     132000,
    //     101000,
    //     134000,
    //     90000,
    //     230000,
    //     210000,
    //     220000,
    //   ],
    // },
    // {
    //   name: '风险金额',
    //   type: 'line',
    //   areaStyle: {
    //     color: '#FFBCA8',
    //   },
    //   data: [80000, 50000, 32000, 20000, 55000, 32000, 20000, 55000, 50000, 30000, 40000, 38000],
    // },
  ],
};

const geoConfig = {
  backgroundColor: 'rgba(240, 242, 244, 0.38)',
  visualMap: {
    min: 0,
    max: 1000,
    right: '20',
    top: 'bottom',
    text: ['高', '低'],
    calculable: false,
    orient: 'horizontal',
    inRange: {
      color: ['#C2E4FF', '#2D6FC4'],
    },
  },
  title: {
    text: '出险金额排名前5地区',
    x: 'center',
    top: '12',
    textStyle: {
      color: '#103678',
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      name: '出险金额排名前5地区',
      type: 'map',
      mapType: 'china',
      itemStyle: {
        normal: {
          borderColor: 'rgba(255,255,255)',
          label: {
            show: false,
          },
        },
        emphasis: {
          label: {
            show: true,
          },
        },
      },
      data: [
        {
          name: '北京',
          value: Math.round(Math.random() * 1000),
          tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
        },
        {
          name: '上海',
          value: Math.round(Math.random() * 1000),
          tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
        },
        {
          name: '山东',
          value: Math.round(Math.random() * 1000),
          tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
        },

        {
          name: '江苏',
          value: Math.round(Math.random() * 1000),
          tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
        },
        {
          name: '浙江',
          value: Math.round(Math.random() * 1000),
          tipData: [Math.round(Math.random() * 1000), Math.round(Math.random() * 1000)],
        },
      ],
    },
  ],
};

const top5hospOri = {
  color: ['#6DB2F7'],
  backgroundColor: 'rgba(240, 242, 244, 0.38)',
  title: {
    x: 'center',
    top: '12',
    text: '出险金额排名前5医疗机构',
    textStyle: {
      color: '#103678',
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  grid: {
    left: '0%',
    right: '10%',
    bottom: '5%',
    top: '20%',
    containLabel: true,
    backgroundColor: 'rgba(240, 242, 244, 0.38)',
  },
  yAxis: [
    {
      type: 'category',
      data: ['a医院', '不会医院', '啦啦啦', 'dddd', 'eeee'],
      axisTick: {
        show: false,
        alignWithLabel: true,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#103678',
          fontSize: 14,
        },
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#D6DBE2',
        },
      },
    },
  ],
  xAxis: [
    {
      nameTextStyle: {
        color: '#103678',
      },

      type: 'value',
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#103678',
          fontSize: 14,
        },
        formatter: value => (value / 1000000 >= 1 ? `${(value / 10000).toFixed(2) / 10000}M` : value),
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: 'dashed',
          color: '#D6DBE2',
        },
      },
    },
  ],
  series: [
    {
      name: '',
      type: 'bar',
      barWidth: '7px',
      data: [10, 52, 200, 334, 390],
    },
  ],
};

const pf1ori = {
  backgroundColor: 'rgba(240,242,244,0.38)',
  title: {
    text: '门诊',
    backgroundColor: 'rgba(16,54,120,0.44)',
    textStyle: {
      color: 'white',
      fontSize: 14,
      fontWeight: 'normal',
    },
    top: '12',
    width: '180px',
    left: 'center',
  },

  color: ['#6DB2F7', '#FF8F96'],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      // 坐标轴指示器，坐标轴触发有效
      type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
    },
  },
  legend: {
    data: [
      { name: '男', icon: 'square', textStyle: { color: '#4291EB' } },
      { name: '女', icon: 'square', textStyle: { color: '#4291EB' } },
    ],
    itemGap: 100,
    bottom: 0,
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '10%',
    containLabel: true,
    backgroundColor: 'rgba(240, 242, 244, 0.38)',
  },
  yAxis: {
    type: 'value',
    name: '总金额',
    nameTextStyle: {
      color: '#103678',
    },
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    axisLine: {
      lineStyle: {
        color: '#E5E8ED',
      },
    },
    axisLabel: {
      color: '#103678',
      formatter: value => {
        return value / 10000 >= 1 ? (value / 100).toFixed(2) / 100 + '万' : value;
      },
    },
  },
  xAxis: {
    type: 'category',
    axisTick: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        color: '#E5E8ED',
      },
    },
    axisLabel: {
      color: '#103678',
      rotate: '30',
    },

    data: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
  },
  series: [
    {
      name: '男',
      type: 'bar',
      stack: '总量',
      barWidth: '100%',
      data: [320, 302, 301, 334, 390, 330, 320],
    },
    {
      name: '女',
      type: 'bar',
      stack: '总量',
      barWidth: '100%',
      data: [120, 132, 101, 134, 90, 230, 210],
    },
  ],
};

const sexROri = {
  // backgroundColor: 'rgba(240, 242, 244, 0.38)',
  color: ['#FF8F96', '#6DB2F7'],
  xAxis: [
    {
      type: 'value',
      show: false,
    },
  ],
  yAxis: [
    {
      type: 'category',
      show: false,
      data: ['性别比例'],
    },
  ],
  series: [
    {
      type: 'bar',
      stack: '性别比例',
      barWidth: 10,
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: () => '55%',
          distance: 25,
        },
      },
      data: [
        {
          name: '女',
          value: '55',
        },
      ],
    },
    {
      type: 'bar',
      stack: '性别比例',
      barWidth: 10,
      label: {
        normal: {
          show: true,
          position: 'top',
          formatter: () => '55%',
          distance: 25,
        },
      },
      data: [
        {
          name: '男',
          value: '45',
        },
      ],
    },
  ],
};

const insDistOri = {
  // backgroundColor: 'rgba(240, 242, 244, 0.38)',
  color: ['#6DB2F7', '#FFDF3C', '#D6DBE2'],
  legend: {
    orient: 'vertical',
    right: '5%',
    top: '30%',
    data: [
      { name: '疾病型出险', icon: 'circle' },
      { name: '意外型出险', icon: 'circle' },
      { name: '其他出险', icon: 'circle' },
    ],
  },
  series: [
    {
      name: '',
      type: 'pie',
      radius: ['40%', '60%'],
      avoidLabelOverlap: false,
      label: {
        normal: {
          show: false,
          position: 'center',
        },
        emphasis: {
          show: true,
          textStyle: {
            fontSize: 18,
            fontWeight: 'bold',
          },
        },
      },
      labelLine: {
        normal: {
          show: false,
        },
      },
      data: [
        { value: 335, name: '疾病型出险' },
        { value: 310, name: '意外型出险' },
        { value: 234, name: '其他出险' },
      ],
    },
  ],
};

// const tags2Ori = [
//   {
//     name: '体检入院',
//     value: 30,
//     type: 1,
//   },
//   {
//     name: '超限定购药',
//     value: 60,
//     type: 2,
//   },
//   {
//     name: '抗生素超过3种',
//     value: 45,
//     type: 2,
//   },
// ];

const data = {
  '华晨宝马汽车有限公司11': {
    timeRange: '2018.06.01～2019.05.31',
    zbf: '65,163,328.04',
    cbrs: 0,
    bdrs: 0,
    cxaj: 51463,
    cxrs:18997,
    insuranceList: [
      {
        insuranceType: '中意医保补充团体医疗保险',
        fee: '35,229,295.93',
        insuranceAmount: '3,000.00',
        insuredCount: '-',
        insuredClaimed: '10360',
        insuredCases: '29387',
        claimPay: '-',
      },
      {
        insuranceType: '中意综合保障团体医疗保险',
        fee: '28,333,300.63',
        insuranceAmount: '5,000.00',
        insuredCount: '-',
        insuredClaimed: '8446',
        insuredCases: '21315',
        claimPay: '-',
      },
      {
        insuranceType: '中意全球保障团体医疗保险（铂金版）',
        fee: '1,031,060.17',
        insuranceAmount: '1,500,000.00',
        insuredCount: '-',
        insuredClaimed: '149',
        insuredCases: '694',
        claimPay: '-',
      },
      {
        insuranceType: '中意附加意外医药补偿团体医疗保险',
        fee: '428,455.06',
        insuranceAmount: '10,000.00 ',
        insuredCount: '-',
        insuredClaimed: '38',
        insuredCases: '41',
        claimPay: '-',
      },
      {
        insuranceType: '中意附加住院津贴团体医疗保险',
        fee: '141,216.25',
        insuranceAmount: '300,000.00',
        insuredCount: '-',
        insuredClaimed: '26',
        insuredCases: '26',
        claimPay: '-',
      },
    ],
    geo: {
      江苏: 0,
      浙江: 0,
      上海: 0,
      山东: 0,
      北京: 0,
    },
    top5hosp: {
      label: [
        '中国医科大学附属盛京医院',
        '辽宁中医药大学附属医院',
        '中国医科大学附属第一医院',
        '中国人民解放军第202医院0',
        '沈阳医学院附属中心医院(奉天医院)',
      ],
      data: [13766353.58, 4522415.72, 4516999.57, 3352174.29, 2932484.98],
    },
    top5hosp2: {
      label: [
        '门诊就诊',
        '住院',
        '统筹住院',
        '牙科治疗',
        '门诊意外就诊',
      ],
      data: [29094385.87, 16684409.52, 6904031.16, 6085536.40, 703510.25],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [4442496.95, 6437727.98, 4292486.53, 2745451.16, 1762875.74, 1431158.20, 2392738.94],
        [2248703.27, 3300493.36, 2490298.47, 1784417.86, 1073649.49, 841823.98, 3217345.35],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [397886.99, 1441347.03, 2121661.90, 2322951.88, 1452013.83, 1165196.46, 7725589.31],
        [206641.04, 728601.39, 1199332.39, 1310842.81, 1005074.47, 830360.87, 4148746.34],
      ],
    },
    sexRatio: [37, 63],
    insDist: [97.58, 2.42, 0],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[18083, 12207, 1983, 265, 34], [10056, 6360, 942, 206, 5]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[971, 613, 112, 22, 1], [634, 330, 29, 5, 0]],
    },

    t1: {
      急性上呼吸道感染: 10,
      '龋(齿)': 9,
      急性支气管炎: 8,
      发热: 7,
      咳嗽: 6,
      '特发性（原发性）高血压': 5,
      '腰痛，伴有坐骨神经痛': 4,
      疱疹性湿疹: 3,
      变应性鼻炎: 1,
      胃炎: 2,
    },
    t2: {
      肺炎: 10,
      支气管肺炎: 9,
      急性支气管炎: 8,
      单胎顺产: 7,
      椎间盘疾患: 6,
      经剖宫产术分娩: 5,
      颈椎间盘疾患: 4,
      痔: 3,
      腰椎脱位: 2,
      '腰痛, 伴有坐骨神经痛': 1,
    },
    top1: {
      刘季: 87,
      朱哲昊: 59,
      王嵩: 56,
      白申宇: 54,
      张帆: 52,
      陈珊:	48,
      张殿贺:	48,
      何志朋:	47,
      张征征:	46,
      安娜:	45,
    },
    top2: {
      魏凡曾: 376920.00,
      尹健: 102596.87,
      耿立勇: 98189.02,
      李硕: 65707.79,
      刘季: 60102.68,
      李强:	58589.86,
      孟庆如:	49255.58,
      朱哲昊:	46702.71,
      祝清:	44339.01,
      汪东:	42814.12,
    },
  },
  '华晨宝马汽车有限公司5': {
    timeRange: '2017.06.01～2018.05.31',
    zbf: '75,541,788.09',
    cbrs: 0,
    bdrs: 0,
    cxaj: 55823,
    cxrs:18756,
    insuranceList: [
      {
        insuranceType: '中意医保补充团体医疗保险',
        fee: '40,472,885.65',
        insuranceAmount: '3,000.00',
        insuredCount: '-',
        insuredClaimed: '10292',
        insuredCases: '31475',
        claimPay: '-',
      },
      {
        insuranceType: '中意综合保障团体医疗保险',
        fee: '33,233,200.18',
        insuranceAmount: '5,000.00',
        insuredCount: '-',
        insuredClaimed: '8296',
        insuredCases: '23494',
        claimPay: '-',
      },
      {
        insuranceType: '中意全球保障团体医疗保险（铂金版）',
        fee: '1,415,990.37',
        insuranceAmount: '1,500,000.00',
        insuredCount: '-',
        insuredClaimed: '131',
        insuredCases: '790',
        claimPay: '-',
      },
      {
        insuranceType: '中意附加意外医药补偿团体医疗保险',
        fee: '253,700.64',
        insuranceAmount: '10,000.00 ',
        insuredCount: '-',
        insuredClaimed: '37',
        insuredCases: '39',
        claimPay: '-',
      },
      {
        insuranceType: '中意附加住院津贴团体医疗保险',
        fee: '166,011.25',
        insuranceAmount: '300,000.00',
        insuredCount: '-',
        insuredClaimed: '25',
        insuredCases: '25',
        claimPay: '-',
      },
    ],
    geo: {
      江苏: 0,
      浙江: 0,
      上海: 0,
      山东: 0,
      北京: 0,
    },
    top5hosp: {
      label: [
        '中国医科大学附属盛京医院',
        '辽宁中医药大学附属医院',
        '中国医科大学附属第一医院',
        '中国人民解放军第202医院0',
        '沈阳医学院附属中心医院(奉天医院)',
      ],
      data: [15915506.39, 5813361.69, 5504887.40, 4303405.12, 3029933.59],
    },
    top5hosp2: {
      label: [
        '住院',
        '门诊就诊',
        '牙科治疗',
        '普通生育门诊',
        '门诊意外就诊',
      ],
      data: [31880136.88, 30700650.08, 6452884.11, 3681148.12, 710257.47],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [4670726.58, 6819437.41, 4387629.09, 2851865.31, 1692994.06, 1390171.54, 3138994.12],
        [2493331.10, 3701519.93, 2715837.02, 1874627.01, 1282023.25, 915002.56, 5270831.37],
      ],
    },
    pf2: {
      label: ['0-3000', '3000-5000', '5000-7000', '7000-9000', '9000-11000', '11000-13000', '13000+'],
      data: [
        [449555.10, 1772430.81, 2576132.87, 3045400.44, 1994229.05, 1395878.60, 7825322.89],
        [323096.26, 1056740.56, 2102856.54, 2008443.94, 1688631.13, 1435146.89, 4662932.66],
      ],
    },
    sexRatio: [37, 63],
    insDist: [97.76, 2.24, 0],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[17941, 13586, 2405, 297, 16], [10397, 8038, 1263, 197, 11]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[1126, 798, 146, 28, 2], [866, 567, 63, 11, 3]],
    },

    t1: {
      '龋(齿)': 10,
      急性上呼吸道感染: 9,
      发热: 8,
      急性支气管炎: 7,
      腰痛: 6,
      咳嗽: 5,
      皮炎: 4,
      疱疹性湿疹: 3,
      胃炎: 2,
      变应性鼻炎: 1,
    },
    t2: {
      肺炎: 10,
      '单胎顺产, 未特指': 9,
      支气管肺炎: 8,
      经剖宫产术分娩: 7,
      '腰痛, 伴有坐骨神经痛': 6,
      椎间盘疾患: 5,
      急性支气管炎: 4,
      颈椎间盘疾患: 3,
      腰椎脱位: 2,
      痔: 1,
    },
    top1: {
      张勇: 67,
      王婧伊: 66,
      张殿贺: 64,
      郑元宁: 59,
      朱哲昊: 58,
      顾宏彬:		56,
      李姝:		55,
      牛爽:		54,
      贾金霏:		53,
      孟子乔:		51,
    },
    top2: {
      魏凡曾: 391948.36,
      张瑞: 102589.41,
      刘苗: 100561.65,
      李硕: 65417.30,
      徐钢: 65339.09,
      解敏:	55852.51,
      会长友:	52736.04,
      运娜:	50485.06,
      王笑南:	47419.60,
      赵建民:	47246.96,
    },
  },
  '华晨宝马汽车有限公司': {
    timeRange: '2016.06.01～2017.05.31',
    zbf: '69,053,014.39',
    cbrs: 0,
    bdrs: 0,
    cxaj: 49769,
    cxrs:16956,
    insuranceList: [
      {
        insuranceType: '中意医保补充团体医疗保险',
        fee: '39,881,038.68',
        insuranceAmount: '3,000.00',
        insuredCount: '-',
        insuredClaimed: '9785',
        insuredCases: '29222',
        claimPay: '-',
      },
      {
        insuranceType: '中意综合保障团体医疗保险',
        fee: '27,313,558.22',
        insuranceAmount: '5,000.00',
        insuredCount: '-',
        insuredClaimed: '7020',
        insuredCases: '19860',
        claimPay: '-',
      },
      {
        insuranceType: '中意全球保障团体医疗保险（铂金版）',
        fee: '1,325,579.40',
        insuranceAmount: '1,500,000.00',
        insuredCount: '-',
        insuredClaimed: '104',
        insuredCases: '634',
        claimPay: '-',
      },
      {
        insuranceType: '中意附加意外医药补偿团体医疗保险',
        fee: '518,173.86',
        insuranceAmount: '10,000.00 ',
        insuredCount: '-',
        insuredClaimed: '47',
        insuredCases: '51',
        claimPay: '-',
      },
      {
        insuranceType: '中意附加住院津贴团体医疗保险',
        fee: '14,664.23',
        insuranceAmount: '300,000.00',
        insuredCount: '-',
        insuredClaimed: '2',
        insuredCases: '2',
        claimPay: '-',
      },
    ],
    geo: {
      江苏: 0,
      浙江: 0,
      上海: 0,
      山东: 0,
      北京: 0,
    },
    top5hosp: {
      label: [
        '中国医科大学附属第一医院',
        '中国医科大学附属盛京医院',
        '辽宁中医药大学附属医院',
        '中国人民解放军第202医院0',
        '沈阳医学院附属中心医院(奉天医院)',
      ],
      data: [516924873.00, 14344707.19, 5241402.45, 4190938.11, 3066399.74],
    },
    top5hosp2: {
      label: [
        '门诊就诊',
        '住院',
        '牙科治疗',
        '普通生育门诊',
        '门诊意外就诊',
      ],
      data: [27351639.29, 26252324.78, 4649320.20, 3357215.84, 637963.94],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [4274903.73, 5858365.36, 3964362.95, 2599691.90, 1574418.58, 1093082.30, 2075762.08],
        [2173214.27, 3148011.51, 2509125.52, 1713658.62, 1166278.31, 826013.90, 4606984.23],
      ],
    },
    pf2: {
      label: ['0-3000', '3000-5000', '5000-7000', '7000-9000', '9000-11000', '11000-13000', '13000+'],
      data: [
        [473371.16, 1681235.37, 2591856.28, 2805187.01, 2256565.24, 1261432.99, 8361684.98],
        [249254.76, 759273.88, 1908177.70, 2080756.29, 1567257.93, 962423.27, 4086016.27],
      ],
    },
    sexRatio: [35, 65],
    insDist: [97.59, 2.41, 0],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[86, 123, 67, 18, 7], [105, 205, 95, 56, 8]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[5, 3, 3, 6, 3], [9, 5, 2, 6, 3]],
    },

    t1: {
      '龋(齿)': 10,
      急性上呼吸道感染: 9,
      发热: 8,
      咳嗽: 7,
      皮炎: 6,
      腰痛: 5,
      急性支气管炎: 4,
      疱疹性湿疹: 3,
      其他和未特指的腹痛: 2,
      肺炎: 1,
    },
    t2: {
      肺炎: 10,
      '单胎顺产, 未特指': 9,
      经剖宫产术分娩: 8,
      支气管肺炎: 7,
      '腰痛, 伴有坐骨神经痛': 6,
      单胎顺产: 5,
      颈椎间盘疾患: 4,
      急性支气管炎: 3,
      甲状腺疾患: 2,
      经剖宫产术的单胎分娩: 1,
    },
    top1: {
      孙大鑫: 74,
      刘晶: 63,
      王思睿: 62,
      王思睿2: 61,
      宫筱宇: 58,
      黄罡:		54,
      徐昊:		53,
      石洪胜:		53,
      周晗:		50,
      李丹:		50,
    },
    top2: {
      刘苗: 94768.28,
      黄罡: 86004.19,
      孙大鑫: 61906.16,
      孟庆如: 60162.80,
      周晗: 57891.53,
      邢常鸣:	57765.56,
      王杨:	53902.73,
      汪东:	49679.34,
      郭健美:	46238.49,
      李丹:	46085.30,
    },
  },
  '盐城烟草-公共基金': {
    timeRange: '2016.3.01～2019.2.28',
    zbf: '17,192,591.42 ',
    cbrs: 1263,
    bdrs: 1263,
    cxaj: 106,
    cxrs: 28,
    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[1, 0, 3, 25, 48], [7, 0, 0, 31, 188]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[2, 25, 51, 54, 129], [6, 8, 7, 6, 39]],
    },

    top1: {
      王国章: 15,
      张君梅: 13,
      戴祝生: 7,
      侯启琨: 5,
      侯苏馨:	5,
      张友来:	5,
      仲国喜:	5,
      朱汉玉:	5,
      杜文友:	5,
    },
    top2: {
      韩长江: 284986.72,
      侯苏馨: 168018.92,
      侯启琨: 127765.71,
      王川: 127394.40,
      张友来: 114709.17,
      杨加成:	83035.06,
      袁炜:	48227.61,
      王国章:	24161.44,
      张修柏:	19294.82,
      朱汉玉:	16705.65,
    },
    // no use
    top5hosp: {
      label: [
        '上海市肺科医院',
        '盐城市第一人民医院',
        '江苏省东台市人民医院',
        '复旦大学附属肿瘤医院',
        '东方肝胆外科医院',
      ],
      data: [309400.00, 304748.53, 159502.29, 107635.78, 104000.00],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [73227.56, 101383.97, 41060.34, 25632.68, 16062.80, 5376.74, 26790.12],
        [25591.74, 42108.06, 23850.04, 20520.17, 9253.32, 5463.39, 21458.78],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [1242.83, 10738.59, 172443.70, 176924.04, 85392.39, 35384.44, 226493.91],
        [363.55, 3256.64 , 47062.46 , 32287.13, 31812.36 ,0.00, 67451.65 ],
      ],
    },
    sexRatio: [24.54,75.45],
    insDist: [71.87,0.9 , 27.23],
    t1: {
      流行型感冒: 10,
      高血压病: 9,
      未特指糖尿病: 8,
      糖尿病: 7,
      不适和疲劳: 6,
      头晕和眩晕: 5,
      头痛: 4,
      牙科检查: 3,
      脑梗死: 2,
      慢性胃炎: 1,
    },
    t2: {
      高血压病: 10,
      未特指糖尿病: 9,
      由衣原体引起的其他疾病: 8,
      脑梗死: 7,
      糖尿病: 6,
      流行性感冒: 5,
      急性支气管炎: 4,
      头晕和眩晕: 3,
      不适和疲劳: 2,
      心绞痛: 1,
    },
  },
  '盐城烟草-保险': {
    timeRange: '2016.3.01～2019.2.28',
    zbf: '4,390,200.00',
    cbrs: 1263,
    bdrs: 1263,
    cxaj: 1063,
    cxrs: 220,
    insuranceList: [
      {
        insuranceType: '团体补充门诊医疗保险（退休）',
        fee: '/',
        insuranceAmount: '5,000.00',
        insuredCount: '192',
        insuredClaimed: '82',
        insuredCases: '655',
        claimPay: '437,799.71',
      },
      {
        insuranceType: '团体补充住院医疗保险',
        fee: '/',
        insuranceAmount: '30,000.00',
        insuredCount: '1255',
        insuredClaimed: '183',
        insuredCases: '327',
        claimPay: '890,853.69',
      },
      {
        insuranceType: '团体意外伤害保险',
        fee: '/',
        insuranceAmount: '500,000.00',
        insuredCount: '1263',
        insuredClaimed: '0',
        insuredCases: '0',
        claimPay: '0.00',
      },
      {
        insuranceType: '附加意外伤害团体医疗保险',
        fee: '/',
        insuranceAmount: '10,000.00',
        insuredCount: '1263',
        insuredClaimed: '11',
        insuredCases: '12',
        claimPay: '34,948.96',
      },
      {
        insuranceType: '团体住院津贴',
        fee: '/',
        insuranceAmount: '200元/天',
        insuredCount: '1263',
        insuredClaimed: '44',
        insuredCases: '62',
        claimPay: '166,400.00',
      },
      {
        insuranceType: '团体重大疾病保险',
        fee: '/',
        insuranceAmount: '100,000.00',
        insuredCount: '1263',
        insuredClaimed: '6',
        insuredCases: '6',
        claimPay: '600,000.00',
      },
      {
        insuranceType: '团体定期寿险（在岗）',
        fee: '/',
        insuranceAmount: '100,000.00',
        insuredCount: '1087',
        insuredClaimed: '1',
        insuredCases: '1',
        claimPay: '100,000.00',
      },
    ],
    geo: {
      江苏: 1370082.26,
      上海: 563185.01,
      广东: 43305.79,
      北京: 11178.54,
      河南: 4342.28,
    },
    top5hosp: {
      label: [
        '上海市肺科医院',
        '盐城市第一人民医院',
        '江苏省东台市人民医院',
        '复旦大学附属肿瘤医院',
        '东方肝胆外科医院',
      ],
      data: [309400.00, 304748.53, 159502.29, 107635.78, 104000.00],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [73227.56, 101383.97, 41060.34, 25632.68, 16062.80, 5376.74, 26790.12],
        [25591.74, 42108.06, 23850.04, 20520.17, 9253.32, 5463.39, 21458.78],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [1242.83, 10738.59, 172443.70, 176924.04, 85392.39, 35384.44, 226493.91],
        [363.55, 3256.64 , 47062.46 , 32287.13, 31812.36 ,0.00, 67451.65 ],
      ],
    },
    sexRatio: [24.54,75.45],
    insDist: [71.87,0.9 , 27.23],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[0, 0, 0, 0, 458], [0, 0, 0, 5, 192]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[3, 18, 52, 59, 130], [5, 9, 7, 6, 39]],
    },

    t1: {
      流行型感冒: 10,
      高血压病: 9,
      未特指糖尿病: 8,
      糖尿病: 7,
      不适和疲劳: 6,
      头晕和眩晕: 5,
      头痛: 4,
      牙科检查: 3,
      脑梗死: 2,
      慢性胃炎: 1,
    },
    t2: {
      高血压病: 10,
      未特指糖尿病: 9,
      由衣原体引起的其他疾病: 8,
      脑梗死: 7,
      糖尿病: 6,
      流行性感冒: 5,
      急性支气管炎: 4,
      头晕和眩晕: 3,
      不适和疲劳: 2,
      心绞痛: 1,
    },
    top1: {
      徐东林: 37,
      余树荣: 27,
      许高宏: 23,
      陈学仁: 22,
      仇学春:	22,
      成小强:	21,
      程万荣:	21,
      王加连:	21,
      李容华:	20,
      沙国载: 20
    },
    top2: {
      韩小飞: 232885.80,
      张友来: 120978.28,
      王燕:	102766.67,
      邵海成:	101625.98,
      万华:	100392.70,
      仲国喜:	100000.00,
      潘硕: 52883.03,
      朱汉玉: 42642.13,
      郑玉琴: 35301.45,
      侯启琨: 34600.00,
    },
  },
  '沙索（中国）化学有限公司': {
    timeRange: '2017.12.01～2018.11.30',
    zbf: '4,934,207.00',
    cbrs: 1002,
    bdrs: 1023,
    cxaj: 830,
    cxrs: 359,
    insuranceList: [
      {
        insuranceType: '团体补充医疗险-门诊',
        fee: '129,340.00',
        insuranceAmount: '3,000.00',
        insuredCount: '1002',
        insuredClaimed: '300',
        insuredCases: '770',
        claimPay: '520,283.97',
      },
      {
        insuranceType: '团体补充住院医疗保险',
        fee: '200,240.00',
        insuranceAmount: '5,000.00',
        insuredCount: '1002',
        insuredClaimed: '45',
        insuredCases: '45',
        claimPay: '135,853.94',
      },
      {
        insuranceType: '团体意外伤害保险',
        fee: '1,167,627.00',
        insuranceAmount: '1,500,000.00',
        insuredCount: '1023',
        insuredClaimed: '0',
        insuredCases: '0',
        claimPay: '0.00',
      },
      {
        insuranceType: '附加意外伤害团体医疗保险',
        fee: '144,000.00 ',
        insuranceAmount: '10,000.00 ',
        insuredCount: '1023',
        insuredClaimed: '12',
        insuredCases: '12',
        claimPay: '33,497.12',
      },
      {
        insuranceType: '团体重大疾病保险',
        fee: '3,293,000.00',
        insuranceAmount: '300,000.00',
        insuredCount: '1002',
        insuredClaimed: '2',
        insuredCases: '2',
        claimPay: '600,000.00',
      },
    ],
    geo: {
      江苏: 96067.85,
      浙江: 63211.22,
      上海: 25446.73,
      山东: 5948.94,
      北京: 2607.05,
    },
    top5hosp: {
      label: [
        '南京同仁医院',
        '南京市儿童医院',
        '南京市江宁医院',
        '江苏省中医院',
        '南京市江宁人民医院',
      ],
      data: [59660.83, 41231.64, 22404.26, 11930.07, 4612.38],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [59660.83, 41231.64, 22404.26, 11930.07, 14612.38, 9384.16, 3000.0],
        [76067.85, 63211.22, 55446.73, 115948.94, 24607.05, 13778.84, 9000.0],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [0.0, 1976.23, 3596.02, 14304.99, 10283.32, 18039.23, 5000.0],
        [0.0, 1874.02, 9049.04, 5643.33, 23049.09, 38038.67, 5000.0],
      ],
    },
    sexRatio: [41, 59],
    insDist: [50.88, 2.6, 46.52],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[86, 123, 67, 18, 7], [105, 205, 95, 56, 8]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[5, 3, 3, 6, 3], [9, 5, 2, 6, 3]],
    },

    t1: {
      急性上呼吸道感染: 10,
      支气管炎: 9,
      颈椎病: 8,
      高血压: 7,
      糖尿病: 6,
      阴道炎: 5,
      尿道炎: 4,
      扁桃体炎: 3,
      慢性胃炎: 2,
      腰椎间盘突出: 1,
    },
    t2: {
      脑出血: 10,
      糖尿病: 9,
      支气管哮喘: 8,
      肺恶性肿瘤: 7,
      高血压: 6,
      冠心病: 5,
      子宫平滑肌瘤: 4,
      盆腔炎: 3,
      胃溃疡: 2,
      腰椎间盘突出: 1,
    },
    top1: {
      孟爱民: 23,
      张少军: 18,
      刘爱群: 16,
      刘尚琨: 13,
      张世玉: 10,
      // 廉红艳:		8,
      // 张硕:		8,
      // 司苗云:		7,
      // 徐国安:		7,
      // 何金女:		5,
    },
    top2: {
      李学玲: 308000.0,
      谢志永: 30800.0,
      赵桂清: 8000.0,
      赖琼琼: 8000.0,
      田莹: 6473.42,
      // 袁志娟:	'5,752.51' ,
      // 姜韶远:	'5,095.18' ,
      // 陈鹏:	'4,885.49' ,
      // 姚雪娣:	'4,575.80' ,
      // 张丰珍:	'3,466.11' ,
    },
  },

  东南大学设计研究院有限公司: {
    timeRange: '2017.10.01～2018.09.30',
    zbf: '4,857,692.09',
    cbrs: 967,
    bdrs: 985,
    cxaj: 664,
    cxrs: 295,
    insuranceList: [
      {
        insuranceType: '团体补充医疗险-门诊',
        fee: '129,340.00',
        insuranceAmount: '4,000.00',
        insuredCount: '985',
        insuredClaimed: '246',
        insuredCases: '645',
        claimPay: '506,894.45',
      },
      {
        insuranceType: '团体补充住院医疗保险',
        fee: '200,240.00',
        insuranceAmount: '6,000.00',
        insuredCount: '985',
        insuredClaimed: '37',
        insuredCases: '37',
        claimPay: '120,853.94',
      },
      {
        insuranceType: '团体意外伤害保险',
        fee: '2,091,112.09',
        insuranceAmount: '2,000,000.00',
        insuredCount: '985',
        insuredClaimed: '0',
        insuredCases: '0',
        claimPay: '0.00',
      },
      {
        insuranceType: '附加意外伤害团体医疗保险',
        fee: '144,000.00',
        insuranceAmount: '10,000.00',
        insuredCount: '985',
        insuredClaimed: '8',
        insuredCases: '8',
        claimPay: '53,497.12',
      },
      {
        insuranceType: '团体重大疾病保险',
        fee: '2,293,000.00',
        insuranceAmount: '200,000.00',
        insuredCount: '967',
        insuredClaimed: '4',
        insuredCases: '4',
        claimPay: '800,000.00',
      },
    ],
    geo: {
      江苏: 96067.85,
      浙江: 63211.22,
      上海: 25446.73,
      山东: 5948.94,
      北京: 2607.05,
    },
    top5hosp: {
      label: [
        '南京市儿童医院',
        '南京市江宁人民医院',
        '南京市江宁医院',
        '南京市第一医院',
        '南京市江宁人民医院',
      ],
      data: [59660.83, 41231.64, 22404.26, 11930.07, 4612.38],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [69660.83, 41231.64, 27404.26, 11930.07, 14612.38, 9384.16, 3528.14],
        [76067.85, 63211.22, 55446.73, 85948.94, 24607.05, 13778.84, 10082.34],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [0.0, 976.23, 3596.02, 14304.99, 10283.32, 18039.23, 6000.0],
        [0.0, 1874.02, 9049.04, 5643.33, 13049.09, 32038.67, 6000.0],
      ],
    },
    sexRatio: [50.93, 49.07],
    insDist: [42.38, 3.61, 54.01],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[86, 123, 47, 9, 2], [105, 146, 78, 41, 8]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[3, 3, 6, 3, 2], [8, 4, 2, 4, 2]],
    },

    t1: {
      急性上呼吸道感染: 10,
      支气管炎: 9,
      颈椎病: 8,
      高血压: 7,
      糖尿病: 6,
      阴道炎: 5,
      尿道炎: 4,
      扁桃体炎: 3,
      慢性胃炎: 2,
      腰椎间盘突出: 1,
    },
    t2: {
      脑出血: 10,
      糖尿病: 9,
      支气管哮喘: 8,
      肺恶性肿瘤: 7,
      高血压: 6,
      冠心病: 5,
      子宫平滑肌瘤: 4,
      盆腔炎: 3,
      胃溃疡: 2,
      腰椎间盘突出: 1,
    },
    top1: {
      贾成亮: 23,
      袁加才: 18,
      程俊: 16,
      张康: 16,
      黄永亮: 10,
    },
    top2: {
      贾成亮: 210000.0,
      袁加才: 210000.0,
      程俊: 210000.0,
      张康: 210000.0,
      陈超: 10000.0,
    },
  },

  南京新众成科技开发中心: {
    timeRange: '2017.08.01～2018.07.31',
    zbf: '2,572,725.32 ',
    cbrs: 340,
    bdrs: 324,
    cxaj: 370,
    cxrs: 120,
    insuranceList: [
      {
        insuranceType: '团体补充医疗险-门诊',
        fee: '53,887.82 ',
        insuranceAmount: '5,000.00',
        insuredCount: '340',
        insuredClaimed: '103',
        insuredCases: '347',
        claimPay: '271,894.45 ',
      },
      {
        insuranceType: '团体补充住院医疗保险',
        fee: '89,118.37',
        insuranceAmount: '10,000.00',
        insuredCount: '340',
        insuredClaimed: '16',
        insuredCases: '16',
        claimPay: '77,428.14',
      },
      {
        insuranceType: '团体意外伤害保险',
        fee: '1,091,112.09',
        insuranceAmount: '1,000,000.00',
        insuredCount: '324',
        insuredClaimed: '0',
        insuredCases: '0',
        claimPay: '0.00',
      },
      {
        insuranceType: '附加意外伤害团体医疗保险',
        fee: '45,607.04',
        insuranceAmount: '10,000.00',
        insuredCount: '324',
        insuredClaimed: '5',
        insuredCases: '5',
        claimPay: '23,497.12',
      },
      {
        insuranceType: '团体重大疾病保险',
        fee: '1,293,000.00',
        insuranceAmount: '400,000.00',
        insuredCount: '324',
        insuredClaimed: '2',
        insuredCases: '2',
        claimPay: '800,000.00',
      },
    ],
    geo: {
      江苏: 96067.85,
      浙江: 63211.22,
      上海: 25446.73,
      山东: 5948.94,
      北京: 2607.05,
    },
    top5hosp: {
      label: [
        '江苏省人民医院',
        '南京市江宁人民医院',
        '南京市江宁医院',
        '南京市第一医院',
        '南京市江宁人民医院',
      ],
      data: [59660.83, 41231.64, 22404.26, 11930.07, 4612.38],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [24660.83, 31231.64, 27404.26, 16930.07, 2612.38, 8384.16, 3528.14],
        [46067.85, 28211.22, 25446.73, 15948.94, 14607.05, 13778.84, 13082.34],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [0.0, 1450.43, 2596.02, 7304.99, 8783.32, 18039.23, 10000.0],
        [0.0, 1874.02, 2049.04, 5643.33, 4049.09, 5638.67, 10000.0],
      ],
    },
    sexRatio: [49.14, 50.86],
    insDist: [29.78, 2.0, 68.21],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[45, 73, 23, 13, 2], [36, 84, 34, 29, 8]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[2, 1, 2, 2, 2], [2, 1, 2, 1, 1]],
    },

    t1: {
      急性上呼吸道感染: 10,
      支气管炎: 9,
      颈椎病: 8,
      高血压: 7,
      糖尿病: 6,
      阴道炎: 5,
      尿道炎: 4,
      扁桃体炎: 3,
      慢性胃炎: 2,
      腰椎间盘突出: 1,
    },
    t2: {
      脑出血: 10,
      糖尿病: 9,
      支气管哮喘: 8,
      肺恶性肿瘤: 7,
      高血压: 6,
      冠心病: 5,
      子宫平滑肌瘤: 4,
      盆腔炎: 3,
      胃溃疡: 2,
      腰椎间盘突出: 1,
    },
    top1: {
      吴六杨: 23,
      张刚: 18,
      张晔: 16,
      张文柏: 16,
      严文平: 10,
    },
    top2: {
      吴六杨: 411231.21,
      张刚: 409263.1,
      程俊: 94930.1,
      张康: 83904.2,
      宣广玉: 78903.21,
    },
  },

  江苏省粮油储运有限公司: {
    timeRange: '2017.10.01～2018.09.30',
    zbf: '4,877,692.23',
    cbrs: 795,
    bdrs: 804,
    cxaj: 602,
    cxrs: 198,
    insuranceList: [
      {
        insuranceType: '团体补充医疗险-门诊',
        fee: '149,340.00',
        insuranceAmount: '4,000.00',
        insuredCount: '795',
        insuredClaimed: '180',
        insuredCases: '568',
        claimPay: '506,894.45',
      },
      {
        insuranceType: '团体补充住院医疗保险',
        fee: '200,240.00',
        insuranceAmount: '6,000.00 ',
        insuredCount: '795',
        insuredClaimed: '22',
        insuredCases: '22',
        claimPay: '120,853.94 ',
      },
      {
        insuranceType: '团体意外伤害保险',
        fee: '2,091,112.23 ',
        insuranceAmount: '2,000,000.00 ',
        insuredCount: '804',
        insuredClaimed: '0',
        insuredCases: '0',
        claimPay: '0.00',
      },
      {
        insuranceType: '附加意外伤害团体医疗保险',
        fee: '144,000.00 ',
        insuranceAmount: '10,000.00 ',
        insuredCount: '804',
        insuredClaimed: '8',
        insuredCases: '8',
        claimPay: '53,497.12 ',
      },
      {
        insuranceType: '团体重大疾病保险',
        fee: '2,293,000.00 ',
        insuranceAmount: '200,000.00 ',
        insuredCount: '804',
        insuredClaimed: '4',
        insuredCases: '4',
        claimPay: '800,000.00 ',
      },
    ],
    geo: {
      江苏: 96067.85,
      浙江: 63211.22,
      上海: 25446.73,
      山东: 5948.94,
      北京: 2607.05,
    },
    top5hosp: {
      label: [
        '南京市儿童医院',
        '南京市江宁人民医院',
        '南京市江宁医院',
        '南京市第一医院',
        '南京市江宁人民医院',
      ],
      data: [59660.83, 41231.64, 22404.26, 11930.07, 4612.38],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [69660.83, 41231.64, 27404.26, 11930.07, 14612.38, 9384.16, 3528.14],
        [76067.85, 63211.22, 55446.73, 85948.94, 24607.05, 13778.84, 10082.34],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [0.0, 976.23, 3596.02, 14304.99, 10283.32, 18039.23, 6000.0],
        [0.0, 1874.02, 9049.04, 5643.33, 13049.09, 32038.67, 6000.0],
      ],
    },
    sexRatio: [44.18, 55.82],
    insDist: [42.38, 3.61, 54.01],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[86, 123, 47, 9, 2], [105, 146, 78, 41, 8]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[3, 3, 6, 3, 2], [8, 4, 2, 4, 2]],
    },

    t1: {
      急性上呼吸道感染: 10,
      支气管炎: 9,
      颈椎病: 8,
      高血压: 7,
      糖尿病: 6,
      阴道炎: 5,
      尿道炎: 4,
      扁桃体炎: 3,
      慢性胃炎: 2,
      腰椎间盘突出: 1,
    },
    t2: {
      脑出血: 10,
      糖尿病: 9,
      支气管哮喘: 8,
      肺恶性肿瘤: 7,
      高血压: 6,
      冠心病: 5,
      子宫平滑肌瘤: 4,
      盆腔炎: 3,
      胃溃疡: 2,
      腰椎间盘突出: 1,
    },
    top1: {
      夏德财: 23,
      李凤姣: 18,
      常冬冬: 16,
      吕国金: 16,
      云雪: 10,
    },
    top2: {
      夏德财: 210000.0,
      李凤姣: 210000.0,
      高珍珍: 210000.0,
      严超: 210000.0,
      马相军: 10000.0,
    },
  },
  中国移动江苏公司: {
    timeRange: '2017.12.01～2018.11.30',
    zbf: '4,187,692.09 ',
    cbrs: 1408,
    bdrs: 1504,
    cxaj: 916,
    cxrs: 550,
    insuranceList: [
      {
        insuranceType: '团体补充医疗险-门诊',
        fee: '179,340.00 ',
        insuranceAmount: '4,000.00 ',
        insuredCount: '1408',
        insuredClaimed: '476',
        insuredCases: '842',
        claimPay: '596,894.45 ',
      },
      {
        insuranceType: '团体补充住院医疗保险',
        fee: '280,240.00 ',
        insuranceAmount: '6,000.00 ',
        insuredCount: '1408',
        insuredClaimed: '56',
        insuredCases: '56',
        claimPay: '171,853.94 ',
      },
      {
        insuranceType: '团体意外伤害保险',
        fee: '1,291,112.09 ',
        insuranceAmount: '1,000,000.00  ',
        insuredCount: '1504',
        insuredClaimed: '0',
        insuredCases: '0',
        claimPay: '0.00',
      },
      {
        insuranceType: '附加意外伤害团体医疗保险',
        fee: '144,000.00 ',
        insuranceAmount: '10,000.00 ',
        insuredCount: '1504',
        insuredClaimed: '15',
        insuredCases: '15',
        claimPay: '53,497.12 ',
      },
      {
        insuranceType: '团体重大疾病保险',
        fee: '2,293,000.00 ',
        insuranceAmount: '200,000.00 ',
        insuredCount: '1504',
        insuredClaimed: '3',
        insuredCases: '3',
        claimPay: '600,000.00 ',
      },
    ],
    geo: {
      江苏: 96067.85,
      浙江: 63211.22,
      上海: 25446.73,
      山东: 5948.94,
      北京: 2607.05,
    },
    top5hosp: {
      label: [
        '南京市儿童医院',
        '南京市江宁人民医院',
        '南京市江宁医院',
        '南京市第一医院',
        '南京市江宁人民医院',
      ],
      data: [59660.83, 41231.64, 22404.26, 11930.07, 4612.38],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [69660.83, 101231.64, 27404.26, 11930.07, 14612.38, 9384.16, 3528.14],
        [76067.85, 93211.22, 55446.73, 85948.94, 24607.05, 13778.84, 10082.34],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [0.0, 976.23, 4596.02, 14304.99, 18283.32, 40039.23, 6000.0],
        [0.0, 1874.02, 12049.04, 12643.33, 23049.09, 32038.67, 6000.0],
      ],
    },
    sexRatio: [52.41, 47.59],
    insDist: [54.05, 3.76, 42.19],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[86, 220, 47, 9, 2], [105, 246, 78, 41, 8]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[3, 3, 6, 6, 9], [3, 7, 5, 7, 7]],
    },

    t1: {
      急性上呼吸道感染: 10,
      支气管炎: 9,
      颈椎病: 8,
      高血压: 7,
      糖尿病: 6,
      阴道炎: 5,
      尿道炎: 4,
      扁桃体炎: 3,
      慢性胃炎: 2,
      腰椎间盘突出: 1,
    },
    t2: {
      脑出血: 10,
      糖尿病: 9,
      支气管哮喘: 8,
      肺恶性肿瘤: 7,
      高血压: 6,
      冠心病: 5,
      子宫平滑肌瘤: 4,
      盆腔炎: 3,
      胃溃疡: 2,
      腰椎间盘突出: 1,
    },
    top1: {
      李彩霞: 23,
      李维维: 18,
      凌兵: 16,
      刘佳蓉: 16,
      刘振伟: 10,
    },
    top2: {
      李彩霞: 210000.0,
      李维维: 210000.0,
      凌兵: 210000.0,
      刘佳蓉: 10000.0,
      陈超: 10000.0,
    },
  },
  金天业会计师事务所: {
    timeRange: '2017.01.01～2017.12.31',
    zbf: '2,572,725.32',
    cbrs: 653,
    bdrs: 661,
    cxaj: 370,
    cxrs: 126,
    insuranceList: [
      {
        insuranceType: '团体补充医疗险-门诊',
        fee: '53,887.82 ',
        insuranceAmount: '5,000.00 ',
        insuredCount: '653',
        insuredClaimed: '103',
        insuredCases: '347',
        claimPay: '271,894.45 ',
      },
      {
        insuranceType: '团体补充住院医疗保险',
        fee: '89,118.37 ',
        insuranceAmount: '10,000.00 ',
        insuredCount: '653',
        insuredClaimed: '16',
        insuredCases: '16',
        claimPay: '77,428.14 ',
      },
      {
        insuranceType: '团体意外伤害保险',
        fee: '1,091,112.09 ',
        insuranceAmount: '1,000,000.00  ',
        insuredCount: '661',
        insuredClaimed: '0',
        insuredCases: '0',
        claimPay: '0.00',
      },
      {
        insuranceType: '附加意外伤害团体医疗保险',
        fee: '45,607.04 ',
        insuranceAmount: '10,000.00 ',
        insuredCount: '661',
        insuredClaimed: '5',
        insuredCases: '5',
        claimPay: '43,497.12 ',
      },
      {
        insuranceType: '团体重大疾病保险',
        fee: '1,293,000.00 ',
        insuranceAmount: '400,000.00 ',
        insuredCount: '661',
        insuredClaimed: '2',
        insuredCases: '2',
        claimPay: '800,000.00 ',
      },
    ],
    geo: {
      江苏: 96067.85,
      浙江: 63211.22,
      上海: 25446.73,
      山东: 5948.94,
      北京: 2607.05,
    },
    top5hosp: {
      label: [
        '江苏省人民医院',
        '南京市江宁人民医院',
        '南京市江宁医院',
        '南京市第一医院',
        '南京市江宁人民医院',
      ],
      data: [59660.83, 41231.64, 22404.26, 11930.07, 4612.38],
    },
    pf1: {
      label: ['0-500', '500-1000', '1000-1500', '1500-2000', '2000-2500', '2500-3000', '3000+'],
      data: [
        [24660.83, 31231.64, 27404.26, 16930.07, 2612.38, 8384.16, 3528.14],
        [746067.85, 28211.22, 25446.73, 15948.94, 14607.05, 13778.84, 13082.34],
      ],
    },
    pf2: {
      label: ['0-500', '500-1000', '1000-2000', '2000-3000', '3000-4000', '4000-5000', '5000+'],
      data: [
        [0.0, 1450.43, 2596.02, 7304.99, 8783.32, 18039.23, 10000.0],
        [0.0, 1874.02, 2049.04, 5643.33, 4049.09, 5638.67, 10000.0],
      ],
    },
    sexRatio: [48.32, 51.68],
    insDist: [29.29, 3.65, 67.07],

    pfc1: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[45, 73, 23, 13, 2], [36, 84, 34, 29, 88]],
    },
    pfc2: {
      label: ['0-30', '30-40', '40-50', '50-60', '60+'],
      data: [[2, 1, 2, 2, 2], [2, 1, 2, 1, 1]],
    },

    t1: {
      急性上呼吸道感染: 10,
      支气管炎: 9,
      颈椎病: 8,
      高血压: 7,
      糖尿病: 6,
      阴道炎: 5,
      尿道炎: 4,
      扁桃体炎: 3,
      慢性胃炎: 2,
      腰椎间盘突出: 1,
    },
    t2: {
      脑出血: 10,
      糖尿病: 9,
      支气管哮喘: 8,
      肺恶性肿瘤: 7,
      高血压: 6,
      冠心病: 5,
      子宫平滑肌瘤: 4,
      盆腔炎: 3,
      胃溃疡: 2,
      腰椎间盘突出: 1,
    },
    top1: {
      吴六杨: 23,
      张刚: 18,
      张晔: 16,
      张文柏: 16,
      严文平: 10,
    },
    top2: {
      吴六杨: 411231.21,
      张刚: 409263.1,
      程俊: 94930.1,
      张康: 83904.2,
      宣广玉: 78903.21,
    },
  },
};

// const data = [
//   {
//     name: '沙索(中国)化学有限公司',
//     timeRange: '2017.12-2018.11',
//     zbf: 5294669.43,
//     cbrs: 850,
//     bdrs: 868,
//     cxaj: 745,
//     cxrs: 230,
//     insuranceList: [
//       {
//         insuranceType: '团体补充医疗险-门诊',
//         fee: '349,680.00',
//         insuranceAmount: '3,000.00',
//         insuredCount: '850',
//         insuredClaimed: '205',
//         claimPay: '243,792.96',
//       },
//     ],
//   },
// ];

@Form.create(state => ({
  riskmodel: state.riskmodel,
}))
@connect()
class GroupIndex extends Component {
  componentWillMount() {
    echartsori.registerMap('china', {
      type: 'FeatureCollection',
      features: [
        {
          id: '710000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@°Ü¯Û'],
              [
                '@@ƛĴÕƊÉɼģºðʀ\\ƎsÆNŌÔĚänÜƤɊĂǀĆĴĤǊŨxĚĮǂƺòƌâÔ®ĮXŦţƸZûÐƕƑGđ¨ĭMó·ęcëƝɉlÝƯֹÅŃ^Ó·śŃǋƏďíåɛGɉ¿@ăƑ¥ĘWǬÏĶŁâ',
              ],
              ['@@\\p|WoYG¿¥Ij@¢'],
              ['@@¡@V^RqBbAnTXeRz¤L«³I'],
              ['@@ÆEEkWqë @'],
              ['@@fced'],
            ],
            encodeOffsets: [
              [[122886, 24033]],
              [[123335, 22980]],
              [[122375, 24193]],
              [[122518, 24117]],
              [[124427, 22618]],
              [[124862, 26043]],
            ],
          },
          properties: {
            cp: [121.509062, 25.044332],
            name: '台湾',
            childNum: 6,
          },
        },
        {
          id: '130000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@o~Z]ªrºc_ħ²G¼s`jÎŸnüsÂłNX_M`Ç½ÓnUKĜēs¤­©yrý§uģcJe'],
              ['@@U`Ts¿mÂ'],
              [
                '@@oºƋÄdeVDJj£J|ÅdzÂFt~KŨ¸IÆv|¢r}èonb}`RÎÄn°ÒdÞ²^®lnÐèĄlðÓ×]ªÆ}LiĂ±Ö`^°Ç¶p®đDcŋ`ZÔ¶êqvFÆN®ĆTH®¦O¾IbÐã´BĐɢŴÆíȦpĐÞXR·nndO¤OÀĈƒ­QgµFo|gȒęSWb©osx|hYhgŃfmÖĩnºTÌSp¢dYĤ¶UĈjlǐpäìë|³kÛfw²Xjz~ÂqbTÑěŨ@|oMzv¢ZrÃVw¬ŧĖ¸f°ÐTªqs{S¯r æÝlNd®²Ğ ǆiGĘJ¼lr}~K¨ŸƐÌWöÆzR¤lêmĞLÎ@¡|q]SvKÑcwpÏÏĿćènĪWlĄkT}J¤~ÈTdpddʾĬBVtEÀ¢ôPĎƗè@~kü\\rÊĔÖæW_§¼F´©òDòjYÈrbĞāøŀG{ƀ|¦ðrb|ÀH`pʞkvGpuARhÞÆǶgĘTǼƹS£¨¡ù³ŘÍ]¿ÂyôEP xX¶¹ÜO¡gÚ¡IwÃé¦ÅBÏ|Ç°N«úmH¯âDùyŜŲIÄuĐ¨D¸dɂFOhđ©OiÃ`ww^ÌkÑH«ƇǤŗĺtFu{Z}Ö@U´ʚLg®¯Oı°Ãw ^VbÉsmAê]]w§RRl£ȭµu¯b{ÍDěïÿȧuT£ġěŗƃĝQ¨fVƋƅn­a@³@ďyÃ½IĹÊKŭfċŰóxV@tƯJ]eR¾fe|rHA|h~Ėƍl§ÏlTíb ØoÅbbx³^zÃĶ¶Sj®AyÂhðk`«PËµEFÛ¬Y¨Ļrõqi¼Wi°§Ð±´°^[À|ĠO@ÆxO\\ta\\tĕtû{ġȧXýĪÓjùÎRb^ÎfK[ÝděYfíÙTyuUSyŌŏů@Oi½éŅ­aVcř§ax¹XŻácWU£ôãºQ¨÷Ñws¥qEHÙ|šYQoŕÇyáĂ£MÃ°oťÊP¡mWO¡v{ôvîēÜISpÌhp¨ jdeŔQÖjX³àĈ[n`Yp@UcM`RKhEbpŞlNut®EtqnsÁgAiúoHqCXhfgu~ÏWP½¢G^}¯ÅīGCÑ^ãziMáļMTÃƘrMc|O_¯Ŏ´|morDkO\\mĆJfl@cĢ¬¢aĦtRıÒ¾ùƀ^juųœK­UFyƝīÛ÷ąV×qƥV¿aȉd³BqPBmaËđŻģmÅ®V¹d^KKonYg¯XhqaLdu¥Ípǅ¡KąÅkĝęěhq}HyÃ]¹ǧ£Í÷¿qáµ§g¤o^á¾ZE¤i`ĳ{nOl»WÝĔįhgF[¿¡ßkOüš_ūiǱàUtėGyl}ÓM}jpEC~¡FtoQiHkk{Ãmï',
              ],
            ],
            encodeOffsets: [[[119712, 40641]], [[121616, 39981]], [[116462, 37237]]],
          },
          properties: {
            cp: [114.502461, 38.045474],
            name: '河北',
            childNum: 3,
          },
        },
        {
          id: '140000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@ÞĩÒSra}ÁyWix±Üe´lèßÓǏokćiµVZģ¡coTSË¹ĪmnÕńehZg{gtwªpXaĚThȑp{¶Eh®RćƑP¿£Pmc¸mQÝWďȥoÅîɡųAďä³aÏJ½¥PG­ąSM­EÅruµéYÓŌ_dĒCo­Èµ]¯_²ÕjāK~©ÅØ^ÔkïçămÏk]­±cÝ¯ÑÃmQÍ~_apm~ç¡qu{JÅŧ·Ls}EyÁÆcI{¤IiCfUcƌÃp§]ě«vD@¡SÀµMÅwuYY¡DbÑc¡h×]nkoQdaMç~eDÛtT©±@¥ù@É¡ZcW|WqOJmĩl«ħşvOÓ«IqăV¥D[mI~Ó¢cehiÍ]Ɠ~ĥqX·eƷn±}v[ěďŕ]_œ`¹§ÕōIo©b­s^}Ét±ū«³p£ÿ·Wµ|¡¥ăFÏs×¥ŅxÊdÒ{ºvĴÎêÌɊ²¶ü¨|ÞƸµȲLLúÉƎ¤ϊęĔV`_bªS^|dzY|dz¥pZbÆ£¶ÒK}tĦÔņƠPYznÍvX¶Ěn ĠÔzý¦ª÷ÑĸÙUȌ¸dòÜJð´ìúNM¬XZ´¤ŊǸ_tldI{¦ƀðĠȤ¥NehXnYGR° ƬDj¬¸|CĞKqºfƐiĺ©ª~ĆOQª ¤@ìǦɌ²æBÊTŸʂōĖĴŞȀÆÿȄlŤĒötÎ½î¼ĨXh|ªM¤Ðz',
            ],
            encodeOffsets: [[116874, 41716]],
          },
          properties: {
            cp: [112.549248, 37.857014],
            name: '山西',
            childNum: 1,
          },
        },
        {
          id: '150000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                '@@Č^â£ĂhĖMÈÄw\\fŦ°W ¢¾luŸDw\\̀ʉÌÛMĀ[bÓEn}¶Vcês¯PqFB|S³C|kñHdiÄ¥sŉÅPóÑÑE^ÅPpy_YtShQ·aHwsOnŉÃs©iqjUSiº]ïW«gW¡ARëśĳĘů`çõh]y»ǃǛҤxÒm~zf}pf|ÜroÈzrKÈĵSƧż؜Ġu¦ö',
              ],
              [
                '@@sKCGS|úþXgp{ÁX¿ć{ƱȏñZáĔyoÁhA}ŅĆfdŉ_¹Y°ėǩÑ¡H¯¶oMQqð¡Ë|Ñ`ƭŁX½·óÛxğįÅcQs«tȋǅFù^it«Č¯[hAi©á¥ÇĚ×l|¹y¯YȵƓñǙµïċĻ|Düȭ¶¡oŽäÕG\\ÄT¿Òõr¯LguÏYęRƩɷŌO\\İÐ¢æ^Ŋ ĲȶȆbÜGĝ¬¿ĚVĎgª^íu½jÿĕęjık@Ľ]ėl¥ËĭûÁėéV©±ćn©­ȇÍq¯½YÃÔŉÉNÑÅÝy¹NqáʅDǡËñ­ƁYÅy̱os§ȋµʽǘǏƬɱàưN¢ƔÊuľýľώȪƺɂļxZĈ}ÌŉŪĺœĭFЛĽ̅ȣͽÒŵìƩÇϋÿȮǡŏçƑůĕ~Ç¼ȳÐUfdIxÿ\\G zâɏÙOº·pqy£@qþ@Ǟ˽IBäƣzsÂZÁàĻdñ°ŕzéØűzșCìDȐĴĺf®Àľưø@ɜÖÞKĊŇƄ§͑těï͡VAġÑÑ»d³öǍÝXĉĕÖ{þĉu¸ËʅğU̎éhɹƆ̗̮ȘǊ֥ड़ࡰţાíϲäʮW¬®ҌeרūȠkɬɻ̼ãüfƠSצɩςåȈHϚÎKǳͲOðÏȆƘ¼CϚǚ࢚˼ФÔ¤ƌĞ̪Qʤ´¼mȠJˀƲÀɠmǐnǔĎȆÞǠN~ʢĜ¶ƌĆĘźʆȬ˪ĚĒ¸ĞGȖƴƀj`ĢçĶāàŃºēĢĖćYÀŎüôQÐÂŎŞǆŞêƖoˆDĤÕºÑǘÛˤ³̀gńƘĔÀ^ªƂ`ªt¾äƚêĦĀ¼ÐĔǎ¨Ȕ»͠^ˮÊȦƤøxRrŜH¤¸ÂxDÄ|ø˂˜ƮÐ¬ɚwɲFjĔ²Äw°ǆdÀÉ_ĸdîàŎjÊêTĞªŌŜWÈ|tqĢUB~´°ÎFCU¼pĀēƄN¦¾O¶łKĊOjĚj´ĜYp{¦SĚÍ\\T×ªV÷Ší¨ÅDK°ßtŇĔK¨ǵÂcḷ̌ĚǣȄĽFlġUĵŇȣFʉɁMğįʏƶɷØŭOǽ«ƽū¹Ʊő̝Ȩ§ȞʘĖiɜɶʦ}¨֪ࠜ̀ƇǬ¹ǨE˦ĥªÔêFxúQEr´Wrh¤Ɛ \\talĈDJÜ|[Pll̚¸ƎGú´P¬W¦^¦H]prRn|or¾wLVnÇIujkmon£cX^Bh`¥V¦U¤¸}xRj[^xN[~ªxQ[`ªHÆÂExx^wN¶Ê|¨ìMrdYpoRzNyÀDs~bcfÌ`L¾n|¾T°c¨È¢ar¤`[|òDŞĔöxElÖdHÀI`Ď\\Àì~ÆR¼tf¦^¢ķ¶eÐÚMptgjɡČÅyġLûŇV®ÄÈƀĎ°P|ªVVªj¬ĚÒêp¬E|ŬÂc|ÀtƐK f{ĘFĒƌXƲąo½Ę\\¥o}Ûu£ç­kX{uĩ«āíÓUŅßŢqŤ¥lyň[oi{¦LńðFȪȖĒL¿Ìf£K£ʺoqNwğc`uetOj×°KJ±qÆġmĚŗos¬qehqsuH{¸kH¡ÊRǪÇƌbȆ¢´äÜ¢NìÉʖ¦â©Ż؛Ç@Vu»Aylßí¹ĵêÝlISò³C¹Ìâ²i¶Ìoú^H²CǜңǄ z¼g^èöŰ_Ĳĕê}gÁnUI«m]jvV¼euhwqAaW_µj»çjioQR¹ēÃßt@r³[ÛlćË^ÍÉáGOUÛOB±XkÅ¹£k|e]olkVÍ¼ÕqtaÏõjgÁ£§U^RLËnX°ÇBz^~wfvypV ¯ƫĉ˭ȫƗŷɿÿĿƑ˃ĝÿÃǃßËőó©ǐȍŒĖM×ÍEyxþp]ÉvïèvƀnÂĴÖ@V~Ĉ³MEĸÅĖtējyÄDXÄxGQuv_i¦aBçw˛wD©{tāmQ{EJ§KPśƘƿ¥@sCTÉ}ɃwƇy±gÑ}T[÷kÐç¦«SÒ¥¸ëBX½HáÅµÀğtSÝÂa[ƣ°¯¦Pï¡]£ġÒk®G²èQ°óMq}EóƐÇ\\@áügQÍu¥FTÕ¿Jû]|mvāÎYua^WoÀa·­ząÒot×¶CLƗi¯¤mƎHǊ¤îìɾŊìTdåwsRÖgĒųúÍġäÕ}Q¶¿A[¡{d×uQAMxVvMOmăl«ct[wº_ÇÊjbÂ£ĦS_éQZ_lwgOiýe`YYLq§IÁǳ£ÙË[ÕªuƏ³ÍTs·bÁĽäė[b[ŗfãcn¥îC¿÷µ[ŏÀQ­ōĉm¿Á^£mJVmL[{Ï_£F¥Ö{ŹA}×Wu©ÅaųĳƳhB{·TQqÙIķËZđ©Yc|M¡LeVUóK_QWk_ĥ¿ãZ»X\\ĴuUèlG®ěłTĠğDŃOrÍdÆÍz]±ŭ©Å]ÅÐ}UË¥©TċïxgckfWgi\\ÏĒ¥HkµEë{»ÏetcG±ahUiñiWsɁ·cCÕk]wȑ|ća}wVaĚá G°ùnM¬¯{ÈÐÆA¥ÄêJxÙ¢hP¢ÛºµwWOóFÁz^ÀŗÎú´§¢T¤ǻƺSėǵhÝÅQgvBHouʝl_o¿Ga{ïq{¥|ſĿHĂ÷aĝÇqZñiñC³ª»E`¨åXēÕqÉû[l}ç@čƘóO¿¡FUsAʽīccocÇS}£IS~ălkĩXçmĈŀÐoÐdxÒuL^T{r@¢ÍĝKén£kQyÅõËXŷƏL§~}kq»IHėǅjĝ»ÑÞoå°qTt|r©ÏS¯·eŨĕx«È[eM¿yupN~¹ÏyN£{©għWí»Í¾səšǅ_ÃĀɗ±ąĳĉʍŌŷSÉA±åǥɋ@ë£R©ąP©}ĹªƏj¹erLDĝ·{i«ƫC£µ',
              ],
            ],
            encodeOffsets: [[[127444, 52594]], [[113793, 40312]]],
          },
          properties: {
            cp: [111.670801, 40.818311],
            name: '内蒙古',
            childNum: 2,
          },
        },
        {
          id: '210000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@L@@sa'],
              ['@@MnNm'],
              ['@@dc'],
              ['@@eÀC@b'],
              ['@@fXwkbrÄ`qg'],
              ['@@^jtWQ'],
              ['@@~ Y]c'],
              ['@@G`ĔN^_¿ZÃM'],
              ['@@iX¶BY'],
              ['@@YZ'],
              ['@@L_{Epf'],
              ['@@^WqCT\\'],
              ['@@\\[§t|¤_'],
              ['@@m`n_'],
              ['@@Ïxǌ{q_×^Giip'],
              [
                '@@@é^BntaÊU]x ¯ÄPĲ­°hʙK³VÕ@Y~|EvĹsÇ¦­L^pÃ²ŸÒG Ël]xxÄ_fT¤Ď¤cPC¨¸TVjbgH²sdÎdHt`B²¬GJję¶[ÐhjeXdlwhðSČ¦ªVÊÏÆZÆŶ®²^ÎyÅÎcPqńĚDMħĜŁH­kçvV[ĳ¼WYÀäĦ`XlR`ôLUVfK¢{NZdĒªYĸÌÚJRr¸SA|ƴgŴĴÆbvªØX~źB|¦ÕE¤Ð`\\|KUnnI]¤ÀÂĊnŎR®Ő¿¶\\ÀøíDm¦ÎbŨabaĘ\\ľãÂ¸atÎSƐ´©v\\ÖÚÌǴ¤Â¨JKrZ_ZfjþhPkx`YRIjJcVf~sCN¤ EhæmsHy¨SðÑÌ\\\\ĐRZk°IS§fqŒßýáĞÙÉÖ[^¯ǤŲê´\\¦¬ĆPM¯£»uïpùzExanµyoluqe¦W^£ÊL}ñrkqWňûPUP¡ôJoo·U}£[·¨@XĸDXm­ÛÝºGUCÁª½{íĂ^cjk¶Ã[q¤LÉö³cux«zZf²BWÇ®Yß½ve±ÃCý£W{Ú^q^sÑ·¨ÍOt¹·C¥GDrí@wÕKţÃ«V·i}xËÍ÷i©ĝɝǡ]{c±OW³Ya±_ç©HĕoƫŇqr³Lys[ñ³¯OSďOMisZ±ÅFC¥Pq{Ã[Pg}\\¿ghćOk^ģÁFıĉĥM­oEqqZûěŉ³F¦oĵhÕP{¯~TÍlªNßYÐ{Ps{ÃVUeĎwk±ŉVÓ½ŽJãÇÇ»Jm°dhcÀffdF~ĀeĖd`sx² ®EżĀdQÂd^~ăÔH¦\\LKpĄVez¤NP ǹÓRÆąJSh­a[¦´ÂghwmBÐ¨źhI|VV|p] Â¼èNä¶ÜBÖ¼L`¼bØæKVpoúNZÞÒKxpw|ÊEMnzEQIZZNBčÚFÜçmĩWĪñtÞĵÇñZ«uD±|Əlĳ¥ãn·±PmÍada CLǑkùó¡³Ï«QaċÏOÃ¥ÕđQȥċƭy³ÃA',
              ],
            ],
            encodeOffsets: [
              [[123686, 41445]],
              [[126019, 40435]],
              [[124393, 40128]],
              [[126117, 39963]],
              [[125322, 40140]],
              [[126686, 40700]],
              [[126041, 40374]],
              [[125584, 40168]],
              [[125453, 40165]],
              [[125362, 40214]],
              [[125280, 40291]],
              [[125774, 39997]],
              [[125976, 40496]],
              [[125822, 39993]],
              [[125509, 40217]],
              [[122731, 40949]],
            ],
          },
          properties: {
            cp: [123.429096, 41.796767],
            name: '辽宁',
            childNum: 16,
          },
        },
        {
          id: '220000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@pä³PClFbbÍzwBGĭZÅi»lY­ċ²SgkÇ£^Sqd¯R©é£¯S\\cZ¹iűƏCuƍÓXoR}M^o£R}oªU­FuuXHlEÅÏ©¤ÛmTþ¤D²ÄufàÀ­XXÈ±AeyYw¬dvõ´KÊ£\\rµÄlidā]|î©¾DÂVH¹Þ®ÜWnCķ W§@\\¸~¤Vp¸póIO¢VOŇürXql~òÉK]¤¥Xrfkvzpm¶bwyFoúvð¼¤ N°ąO¥«³[éǡű_°Õ\\ÚÊĝþâőàerR¨­JYlďQ[ ÏYëÐ§TGztnß¡gFkMāGÁ¤ia ÉÈ¹`\\xs¬dĆkNnuNUuP@vRY¾\\¢GªóĄ~RãÖÎĢùđŴÕhQxtcæëSɽŉíëǉ£ƍG£nj°KƘµDsØÑpyĆ¸®¿bXp]vbÍZuĂ{n^IüÀSÖ¦EvRÎûh@â[ƏÈô~FNr¯ôçR±­HÑlĢ^¤¢OðævxsŒ]ÞÁTĠs¶¿âÆGW¾ìA¦·TÑ¬è¥ÏÐJ¨¼ÒÖ¼ƦɄxÊ~StD@Ă¼Ŵ¡jlºWvÐzƦZÐ²CH AxiukdGgetqmcÛ£Ozy¥cE}|¾cZk¿uŐã[oxGikfeäT@SUwpiÚFM©£è^Ú`@v¶eňf heP¶täOlÃUgÞzŸU`l}ÔÆUvØ_Ō¬Öi^ĉi§²ÃB~¡ĈÚEgc|DC_Ȧm²rBx¼MÔ¦ŮdĨÃâYxƘDVÇĺĿg¿cwÅ\\¹¥Yĭl¤OvLjM_a W`zļMž·\\swqÝSAqŚĳ¯°kRē°wx^ĐkǂÒ\\]nrĂ}²ĊŲÒøãh·M{yMzysěnĒġV·°G³¼XÀ¤¹i´o¤ŃÈ`ÌǲÄUĞd\\iÖmÈBĤÜɲDEh LG¾ƀÄ¾{WaYÍÈĢĘÔRîĐj}ÇccjoUb½{h§Ǿ{KƖµÎ÷GĀÖŠåưÎs­lyiē«`å§H¥Ae^§GK}iã\\c]v©ģZmÃ|[M}ģTɟĵÂÂ`ÀçmFK¥ÚíÁbX³ÌQÒHof{]ept·GŋĜYünĎųVY^ydõkÅZW«WUa~U·SbwGçǑiW^qFuNĝ·EwUtW·Ýďæ©PuqEzwAVXRãQ`­©GMehccďÏd©ÑW_ÏYƅ»é\\ɹ~ǙG³mØ©BšuT§Ĥ½¢Ã_Ã½L¡ýqT^rme\\PpZZbyuybQefµ]UhĿDCmûvaÙNSkCwncćfv~YÇG',
            ],
            encodeOffsets: [[130196, 42528]],
          },
          properties: {
            cp: [125.3245, 43.886841],
            name: '吉林',
            childNum: 1,
          },
        },
        {
          id: '230000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@ƨĶTLÇyqpÇÛqe{~oyen}s`qiXGù]Ëp½©lÉÁp]Þñ´FĂ^fäîºkàz¼BUvÈ@'],
              [
                '@@UµNÿ¥īèçHÍøƕ¶Lǽ|g¨|a¾pVidd~ÈiíďÓQġėÇZÎXb½|ſÃH½KFgɱCģÛÇAnjÕc[VĝǱÃËÇ_ £ń³pj£º¿»WH´¯U¸đĢmtĜyzzNN|g¸÷äűÑ±ĉā~mq^[ǁÑďlw]¯xQĔ¯l°řĴrBÞTxr[tŽ¸ĻN_yX`biNKuP£kZĮ¦[ºxÆÀdhĹŀUÈƗCwáZħÄŭcÓ¥»NAw±qȥnD`{ChdÙFć}¢A±Äj¨]ĊÕjŋ«×`VuÓÅ~_kŷVÝyhVkÄãPsOµfgeŇµf@u_Ù ÙcªNªÙEojVxT@ãSefjlwH\\pŏäÀvlY½d{F~¦dyz¤PÜndsrhfHcvlwjF£G±DÏƥYyÏu¹XikĿ¦ÏqƗǀOŜ¨LI|FRĂn sª|C˜zxAè¥bfudTrFWÁ¹Am|ĔĕsķÆF´N}ćUÕ@Áĳſmuçuð^ÊýowFzØÎĕNőǏȎôªÌŒǄàĀÄ˄ĞŀƒʀĀƘŸˮȬƬĊ°Uzouxe]}AyÈW¯ÌmKQ]Īºif¸ÄX|sZt|½ÚUÎ lk^p{f¤lºlÆW A²PVÜPHÊâ]ÎĈÌÜk´\\@qàsĔÄQºpRij¼èi`¶bXrBgxfv»uUi^v~J¬mVp´£´VWrnP½ì¢BX¬hðX¹^TjVriªjtŊÄmtPGx¸bgRsT`ZozÆO]ÒFôÒOÆŊvÅpcGêsx´DR{AEOr°x|íb³Wm~DVjºéNNËÜ˛ɶ­GxŷCSt}]ûōSmtuÇÃĕNāg»íT«u}ç½BĵÞʣ¥ëÊ¡MÛ³ãȅ¡ƋaǩÈÉQG¢·lG|tvgrrf«ptęŘnÅĢrI²¯LiØsPf_vĠdxM prʹL¤¤eËÀđKïÙVY§]Ióáĥ]ķK¥j|pŇ\\kzţ¦šnņäÔVĂîĪ¬|vW®l¤èØrxm¶ă~lÄƯĄ̈́öȄEÔ¤ØQĄĄ»ƢjȦOǺ¨ìSŖÆƬyQv`cwZSÌ®ü±Ǆ]ŀç¬B¬©ńzƺŷɄeeOĨSfm ĊƀP̎ēz©ĊÄÕÊmgÇsJ¥ƔŊśæÎÑqv¿íUOµªÂnĦÁ_½ä@êí£P}Ġ[@gġ}gɊ×ûÏWXá¢užƻÌsNÍ½ƎÁ§čŐAēeL³àydl¦ĘVçŁpśǆĽĺſÊQíÜçÛġÔsĕ¬Ǹ¯YßċġHµ ¡eå`ļrĉŘóƢFìĎWøxÊkƈdƬv|I|·©NqńRŀ¤éeŊŀàŀU²ŕƀBQ£Ď}L¹Îk@©ĈuǰųǨÚ§ƈnTËÇéƟÊcfčŤ^XmHĊĕË«W·ċëx³ǔķÐċJāwİ_ĸȀ^ôWr­°oú¬ĦŨK~ȰCĐ´Ƕ£fNÎèâw¢XnŮeÂÆĶ¾¾xäLĴĘlļO¤ÒĨA¢Êɚ¨®ØCÔ ŬGƠƦYĜĘÜƬDJg_ͥœ@čŅĻA¶¯@wÎqC½Ĉ»NăëKďÍQÙƫ[«ÃígßÔÇOÝáWñuZ¯ĥŕā¡ÑķJu¤E å¯°WKÉ±_d_}}vyõu¬ï¹ÓU±½@gÏ¿rÃ½DgCdµ°MFYxw¿CG£Rƛ½Õ{]L§{qqą¿BÇƻğëܭǊË|c²}Fµ}ÙRsÓpg±QNqǫŋRwŕnéÑÉK«SeYRŋ@{¤SJ}D Ûǖ֍]gr¡µŷjqWÛham³~S«Þ]',
              ],
            ],
            encodeOffsets: [[[127123, 51780]], [[134456, 44547]]],
          },
          properties: {
            cp: [126.642464, 45.756967],
            name: '黑龙江',
            childNum: 2,
          },
        },
        {
          id: '320000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@cþÅPi`ZRu¥É\\]~°Y`µÓ^phÁbnÀşúòaĬºTÖŒbe¦¦{¸ZâćNp©Hr|^mjhSEb\\afv`sz^lkljÄtg¤D­¾X¿À|ĐiZȀåB·î}GL¢õcßjayBFµÏC^ĭcÙt¿sğH]j{s©HM¢QnDÀ©DaÜÞ·jgàiDbPufjDk`dPOîhw¡ĥ¥GP²ĐobºrYî¶aHŢ´ ]´rılw³r_{£DB_Ûdåuk|Ũ¯F Cºyr{XFye³Þċ¿ÂkĭB¿MvÛpm`rÚã@Ę¹hågËÖƿxnlč¶Åì½Ot¾dJlVJĂǀŞqvnO^JZż·Q}êÍÅmµÒ]ƍ¦Dq}¬R^èĂ´ŀĻĊIÔtĲyQŐĠMNtR®òLhĚs©»}OÓGZz¶A\\jĨFäOĤHYJvÞHNiÜaĎÉnFQlNM¤B´ĄNöɂtpŬdfåqm¿QûùŞÚb¤uŃJŴu»¹ĄlȖħŴw̌ŵ²ǹǠ͛hĭłƕrçü±Yxcitğ®jű¢KOķCoy`å®VTa­_Ā]ŐÝɞï²ʯÊ^]afYǸÃĆēĪȣJđ͍ôƋÄÄÍīçÛɈǥ£­ÛmY`ó£Z«§°Ó³QafusNıǅ_k}¢m[ÝóDµ¡RLčiXyÅNïă¡¸iĔÏNÌŕoēdōîåŤûHcs}~Ûwbù¹£¦ÓCtOPrE^ÒogĉIµÛÅʹK¤½phMü`oæŀ',
            ],
            encodeOffsets: [[121740, 32276]],
          },
          properties: {
            cp: [118.767413, 32.041544],
            name: '江苏',
            childNum: 1,
          },
        },
        {
          id: '330000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@E^dQ]K'],
              ['@@jX^j'],
              ['@@sfbU'],
              ['@@qP\\xz[ck'],
              ['@@R¢FX}°[s_'],
              ['@@Cb\\}'],
              ['@@e|v\\la{u'],
              ['@@v~u}'],
              ['@@QxÂF¯}'],
              ['@@¹nvÞs¯o'],
              ['@@rSkUEj'],
              ['@@bi­ZP'],
              ['@@p[}INf'],
              ['@@À¿'],
              ['@@¹dnb'],
              ['@@rSBnR'],
              ['@@g~h}'],
              ['@@FlEk'],
              ['@@OdPc'],
              ['@@v[u\\'],
              ['@@FjâL~wyoo~sµL\\'],
              ['@@¬e¹aN'],
              ['@@\\nÔ¡q]L³ë\\ÿ®QÖ'],
              ['@@ÊA­©[¬'],
              ['@@Kxv­'],
              ['@@@hlIk]'],
              ['@@pW{o||j'],
              ['@@Md|_mC'],
              ['@@¢X£ÏylD¼XtH'],
              ['@@hlÜ[LykAvyfw^E¤'],
              ['@@fp¤MusR'],
              ['@@®_ma~LÁ¬Z'],
              ['@@iMxZ'],
              ['@@ZcYd'],
              ['@@Z~dOSo|A¿qZv'],
              ['@@@`EN¡v'],
              ['@@|TY{'],
              ['@@@n@m'],
              ['@@XWkCT\\'],
              ['@@ºwZRkĕWO¢'],
              ['@@X®±GrÆª\\ÔáXq{'],
              ['@@ůTG°ĄLHm°UC'],
              [
                '@@¤aÜx~}dtüGæţŎíĔcŖpMËÐjē¢·ðĄÆMzjWKĎ¢Q¶À_ê_Bıi«pZgf¤Nrq]§ĂN®«H±yƳí¾×ŸīàLłčŴǝĂíÀBŖÕªÁŖHŗŉåqûõi¨hÜ·ñt»¹ýv_[«¸mYL¯QªmĉÅdMgÇjcº«ę¬­K­´B«Âącoċ\\xKd¡gěŧ«®á[~ıxu·ÅKsËÉc¢Ù\\ĭƛëbf¹­ģSĜkáƉÔ­ĈZB{aMµfzŉfåÂŧįƋǝÊĕġć£g³ne­ą»@­¦S®\\ßðChiqªĭiAuA­µ_W¥ƣO\\lċĢttC¨£t`PZäuXßBsĻyekOđġĵHuXBµ]×­­\\°®¬F¢¾pµ¼kŘó¬Wät¸|@L¨¸µrºù³Ù~§WIZW®±Ð¨ÒÉx`²pĜrOògtÁZ}þÙ]¡FKwsPlU[}¦Rvn`hq¬\\nQ´ĘRWb_ rtČFIÖkĦPJ¶ÖÀÖJĈĄTĚòC ²@PúØz©Pî¢£CÈÚĒ±hŖl¬â~nm¨f©iļ«mntuÖZÜÄjL®EÌFª²iÊxØ¨IÈhhst',
              ],
              ['@@o\\VzRZ}y'],
              ['@@@°¡mÛGĕ¨§Ianá[ýƤjfæØLäGr'],
            ],
            encodeOffsets: [
              [[125592, 31553]],
              [[125785, 31436]],
              [[125729, 31431]],
              [[125513, 31380]],
              [[125223, 30438]],
              [[125115, 30114]],
              [[124815, 29155]],
              [[124419, 28746]],
              [[124095, 28635]],
              [[124005, 28609]],
              [[125000, 30713]],
              [[125111, 30698]],
              [[125078, 30682]],
              [[125150, 30684]],
              [[124014, 28103]],
              [[125008, 31331]],
              [[125411, 31468]],
              [[125329, 31479]],
              [[125626, 30916]],
              [[125417, 30956]],
              [[125254, 30976]],
              [[125199, 30997]],
              [[125095, 31058]],
              [[125083, 30915]],
              [[124885, 31015]],
              [[125218, 30798]],
              [[124867, 30838]],
              [[124755, 30788]],
              [[124802, 30809]],
              [[125267, 30657]],
              [[125218, 30578]],
              [[125200, 30562]],
              [[124968, 30474]],
              [[125167, 30396]],
              [[124955, 29879]],
              [[124714, 29781]],
              [[124762, 29462]],
              [[124325, 28754]],
              [[123990, 28459]],
              [[125366, 31477]],
              [[125115, 30363]],
              [[125369, 31139]],
              [[122495, 31878]],
              [[125329, 30690]],
              [[125192, 30787]],
            ],
          },
          properties: {
            cp: [120.153576, 30.287459],
            name: '浙江',
            childNum: 45,
          },
        },
        {
          id: '340000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@^iuLX^'],
              ['@@e©Ehl'],
              [
                '@@°ZÆëĎµmkǀwÌÕæhºgBĝâqÙĊzÖgņtÀÁĂÆáhEz|WzqD¹°Eŧl{ævÜcA`¤C`|´qxĲkq^³³GšµbíZ¹qpa±ď OH¦Ħx¢gPícOl_iCveaOjChß¸iÝbÛªCC¿mRV§¢A|t^iĠGÀtÚsd]ĮÐDE¶zAb àiödK¡~H¸íæAǿYj{ď¿À½W®£ChÃsikkly]_teu[bFaTign{]GqªoĈMYá|·¥f¥őaSÕėNµñĞ«Im_m¿Âa]uĜp Z_§{Cäg¤°r[_YjÆOdý[I[á·¥Q_nùgL¾mvˊBÜÆ¶ĊJhpc¹O]iŠ]¥ jtsggJÇ§w×jÉ©±EFË­KiÛÃÕYvsm¬njĻª§emná}k«ŕgđ²ÙDÇ¤í¡ªOy×Où±@DñSęćăÕIÕ¿IµĥOjNÕËT¡¿tNæŇàåyķrĕq§ÄĩsWÆßF¶X®¿mwRIÞfßoG³¾©uyHį{Ɓħ¯AFnuPÍÔzVdàôº^Ðæd´oG¤{S¬ćxã}ŧ×Kǥĩ«ÕOEÐ·ÖdÖsƘÑ¨[Û^Xr¢¼§xvÄÆµ`K§ tÒ´Cvlo¸fzŨð¾NY´ı~ÉĔēßúLÃÃ_ÈÏ|]ÂÏFlg`ben¾¢pUh~ƴĖ¶_r sĄ~cƈ]|r c~`¼{À{ȒiJjz`îÀT¥Û³]u}fïQl{skloNdjäËzDvčoQďHI¦rbtHĔ~BmlRV_ħTLnñH±DL¼Lªl§Ťa¸ĚlK²\\RòvDcÎJbt[¤D@®hh~kt°ǾzÖ@¾ªdbYhüóZ ň¶vHrľ\\ÊJuxAT|dmÀO[ÃÔG·ĚąĐlŪÚpSJ¨ĸLvÞcPæķŨ®mÐálwKhïgA¢ųÆ©Þ¤OÈm°K´',
              ],
            ],
            encodeOffsets: [[[121722, 32278]], [[119475, 30423]], [[119168, 35472]]],
          },
          properties: {
            cp: [117.283042, 31.86119],
            name: '安徽',
            childNum: 3,
          },
        },
        {
          id: '350000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@zht´]'],
              ['@@aj^~ĆG©O'],
              ['@@ed¨C}}i'],
              ['@@@vPGsQ'],
              ['@@sBzddW]Q'],
              ['@@S¨Q{'],
              ['@@NVucW'],
              ['@@qptBAq'],
              ['@@¸[mu'],
              ['@@Q\\pD]_'],
              ['@@jSwUadpF'],
              ['@@eXª~'],
              ['@@AjvFso'],
              ['@@fT_Çí\\v|ba¦jZÆy°'],
              ['@@IjJi'],
              ['@@wJIx«¼AoNe{M­'],
              ['@@K±¡ÓČäeZ'],
              [
                '@@k¡¹Eh~c®wBkUplÀ¡I~Māe£bN¨gZý¡a±Öcp©PhI¢QqÇGj|¥U g[Ky¬ŏv@OptÉEF\\@ åA¬V{XģĐBycpě¼³Ăp·¤¥ohqqÚ¡ŅLs^Ã¡§qlÀhH¨MCe»åÇGD¥zPO£čÙkJA¼ßėuĕeûÒiÁŧSW¥Qûŗ½ùěcÝ§SùĩąSWó«íęACµeRåǃRCÒÇZÍ¢ź±^dlstjD¸ZpuÔâÃH¾oLUêÃÔjjēò´ĄWƛ^Ñ¥Ħ@ÇòmOw¡õyJyD}¢ďÑÈġfZda©º²z£NjD°Ötj¶¬ZSÎ~¾c°¶ÐmxO¸¢Pl´SL|¥AȪĖMņĲg®áIJČĒü` QF¬h|ĂJ@zµ |ê³È ¸UÖŬŬÀEttĸr]ðM¤ĶĲHtÏ AĬkvsq^aÎbvdfÊòSD´Z^xPsĂrvƞŀjJd×ŘÉ ®AÎ¦ĤdxĆqAZRÀMźnĊ»İÐZ YXæJyĊ²·¶q§·K@·{sXãô«lŗ¶»o½E¡­«¢±¨Y®Ø¶^AvWĶGĒĢPlzfļtàAvWYãO_¤sD§ssČġ[kƤPX¦`¶®BBvĪjv©jx[L¥àï[F¼ÍË»ğV`«Ip}ccÅĥZEãoP´B@D¸m±z«Ƴ¿å³BRØ¶Wlâþäą`]Z£Tc ĹGµ¶Hm@_©k¾xĨôȉðX«½đCIbćqK³ÁÄš¬OAwã»aLŉËĥW[ÂGIÂNxĳ¤D¢îĎÎB§°_JGs¥E@¤ućPåcuMuw¢BI¿]zG¹guĮck\\_',
              ],
            ],
            encodeOffsets: [
              [[123250, 27563]],
              [[122541, 27268]],
              [[123020, 27189]],
              [[122916, 27125]],
              [[122887, 26845]],
              [[122808, 26762]],
              [[122568, 25912]],
              [[122778, 26197]],
              [[122515, 26757]],
              [[122816, 26587]],
              [[123388, 27005]],
              [[122450, 26243]],
              [[122578, 25962]],
              [[121255, 25103]],
              [[120987, 24903]],
              [[122339, 25802]],
              [[121042, 25093]],
              [[122439, 26024]],
            ],
          },
          properties: {
            cp: [119.306239, 26.075302],
            name: '福建',
            childNum: 18,
          },
        },
        {
          id: '360000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@ĢĨƐgļ¼ÂMD~ņªe^\\^§ý©j×cZØ¨zdÒa¶lÒJìõ`oz÷@¤uŞ¸´ôęöY¼HČƶajlÞƩ¥éZ[|h}^U  ¥pĄžƦO lt¸Æ Q\\aÆ|CnÂOjt­ĚĤdÈF`¶@Ðë ¦ōÒ¨SêvHĢûXD®QgÄWiØPÞìºr¤ǆNĠ¢lĄtZoCƞÔºCxrpĠV®Ê{f_Y`_eq®Aot`@oDXfkp¨|s¬\\DÄSfè©Hn¬^DhÆyøJhØxĢĀLÊƠPżċĄwȠĚ¦G®ǒĤäTŠÆ~Ħw«|TF¡nc³Ïå¹]ĉđxe{ÎÓvOEm°BƂĨİ|Gvz½ª´HàpeJÝQxnÀW­EµàXÅĪt¨ÃĖrÄwÀFÎ|ňÓMå¼ibµ¯»åDT±m[r«_gmQu~¥V\\OkxtL E¢Ú^~ýêPóqoě±_Êw§ÑªåƗā¼mĉŹ¿NQYBąrwģcÍ¥B­ŗÊcØiIƝĿuqtāwO]³YCñTeÉcaubÍ]trluīBÐGsĵıN£ï^ķqss¿FūūVÕ·´Ç{éĈýÿOER_đûIċâJh­ŅıNȩĕB¦K{Tk³¡OP·wnµÏd¯}½TÍ«YiµÕsC¯iM¤­¦¯P|ÿUHvhe¥oFTuõ\\OSsMòđƇiaºćXĊĵà·çhƃ÷Ç{ígu^đgm[×zkKN¶Õ»lčÓ{XSÆv©_ÈëJbVkĔVÀ¤P¾ºÈMÖxlò~ªÚàGĂ¢B±ÌKyáV¼Ã~­`gsÙfIƋlę¹e|~udjuTlXµf`¿Jd[\\L²',
            ],
            encodeOffsets: [[116689, 26234]],
          },
          properties: {
            cp: [115.892151, 28.676493],
            name: '江西',
            childNum: 1,
          },
        },
        {
          id: '370000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@Xjd]{K'],
              ['@@itbFHy'],
              ['@@HlGk'],
              ['@@TGy'],
              ['@@K¬U'],
              ['@@WdXc'],
              ['@@PtOs'],
              ['@@LnXhc'],
              ['@@ppVu]Or'],
              ['@@cdzAUa'],
              ['@@udRhnCI'],
              ['@@oIpR'],
              [
                '@@Ľč{fzƤîKÎMĮ]ZF½Y]â£ph¶¨râøÀÎǨ¤^ºÄGz~grĚĜlĞÆLĆǆ¢Îo¦cvKbgr°WhmZp L]LºcUÆ­nżĤÌĒbAnrOA´ȊcÀbƦUØrĆUÜøĬƞEzVL®öØBkŖÝĐĖ¹ŧ̄±ÀbÎÉnb²ĦhņBĖįĦåXćì@L¯´ywƕCéÃµė ƿ¸lµ¾Z|ZWyFY¨Mf~C¿`à_RÇzwƌfQnny´INoƬèôº|sTJULîVjǎ¾ĒØDz²XPn±ŴPè¸ŔLƔÜƺ_TüÃĤBBċÈöA´faM¨{«M`¶d¡ôÖ°mȰBÔjj´PM|c^d¤u¤Û´ä«ƢfPk¶Môl]Lb}su^ke{lCMrDÇ­]NÑFsmoõľHyGă{{çrnÓEƕZGª¹Fj¢ïWuøCǷë¡ąuhÛ¡^KxC`C\\bÅxì²ĝÝ¿_NīCȽĿåB¥¢·IŖÕy\\¹kxÃ£Č×GDyÃ¤ÁçFQ¡KtŵƋ]CgÏAùSedcÚźuYfyMmhUWpSyGwMPqŀÁ¼zK¶G­Y§Ë@´śÇµƕBm@IogZ¯uTMx}CVKï{éƵP_K«pÛÙqċtkkù]gTğwoɁsMõ³ăAN£MRkmEÊčÛbMjÝGuIZGPģãħE[iµBEuDPÔ~ª¼ęt]ûG§¡QMsğNPŏįzs£Ug{đJĿļā³]ç«Qr~¥CƎÑ^n¶ÆéÎR~Ż¸YI] PumŝrƿIā[xeÇ³L¯v¯s¬ÁY~}ťuŁgƋpÝĄ_ņī¶ÏSR´ÁP~¿Cyċßdwk´SsX|t`Ä ÈðAªìÎT°¦Dda^lĎDĶÚY°`ĪŴǒàŠv\\ebZHŖR¬ŢƱùęOÑM­³FÛWp[',
              ],
            ],
            encodeOffsets: [
              [[123806, 39303]],
              [[123821, 39266]],
              [[123742, 39256]],
              [[123702, 39203]],
              [[123649, 39066]],
              [[123847, 38933]],
              [[123580, 38839]],
              [[123894, 37288]],
              [[123043, 36624]],
              [[123344, 38676]],
              [[123522, 38857]],
              [[123628, 38858]],
              [[118260, 36742]],
            ],
          },
          properties: {
            cp: [117.000923, 36.675807],
            name: '山东',
            childNum: 13,
          },
        },
        {
          id: '410000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@ýLùµP³swIÓxcŢĞð´E®ÚPtĴXØxÂ¶@«ŕŕQGYfa[şußǩđš_X³ĳÕčC]kbc¥CS¯ëÍB©÷³­Si_}mYTt³xlàcČzÀD}ÂOQ³ÐTĨ¯ƗòËŖ[hłŦv~}ÂZ«¤lPÇ£ªÝŴÅR§ØnhctâknÏ­ľŹUÓÝdKuķI§oTũÙďkęĆH¸Ó\\Ä¿PcnS{wBIvÉĽ[GqµuŇôYgûZca©@½Õǽys¯}lgg@­C\\£asIdÍuCQñ[L±ęk·ţb¨©kK»KC²òGKmĨS`UQnk}AGēsqaJ¥ĐGRĎpCuÌy ã iMcplk|tRkðev~^´¦ÜSí¿_iyjI|ȑ|¿_»d}q^{Ƈdă}tqµ`Ƴĕg}V¡om½faÇo³TTj¥tĠRyK{ùÓjuµ{t}uËRivGçJFjµÍyqÎàQÂFewixGw½Yŷpµú³XU½ġyłåkÚwZX·l¢Á¢KzOÎÎjc¼htoDHr|­J½}JZ_¯iPq{tę½ĕ¦Zpĵø«kQĹ¤]MÛfaQpě±ǽ¾]u­Fu÷nčÄ¯ADp}AjmcEÇaª³o³ÆÍSƇĈÙDIzËčľ^KLiÞñ[aA²zzÌ÷D|[íÄ³gfÕÞd®|`Ć~oĠƑô³ŊD×°¯CsøÀ«ìUMhTº¨¸ǡîSÔDruÂÇZÖEvPZW~ØÐtĄE¢¦Ðy¸bô´oŬ¬²Ês~]®tªapŎJ¨Öº_Ŕ`Ŗ^Đ\\Ĝu~m²Ƹ¸fWĦrƔ}Î^gjdfÔ¡J}\\n C¦þWxªJRÔŠu¬ĨĨmFdM{\\d\\YÊ¢ú@@¦ª²SÜsC}fNècbpRmlØ^gd¢aÒ¢CZZxvÆ¶N¿¢T@uC¬^ĊðÄn|lGlRjsp¢ED}Fio~ÔN~zkĘHVsǲßjŬŢ`Pûàl¢\\ÀEhİgÞē X¼Pk|m',
            ],
            encodeOffsets: [[118256, 37017]],
          },
          properties: {
            cp: [113.665412, 34.757975],
            name: '河南',
            childNum: 1,
          },
        },
        {
          id: '420000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@AB'],
              ['@@lskt'],
              [
                '@@¾«}{ra®pîÃ\\{øCËyyB±b\\òÝjKL ]ĎĽÌJyÚCƈćÎT´Å´pb©ÈdFin~BCo°BĎÃømv®E^vǾ½Ĝ²RobÜeN^ĺ£R¬lĶ÷YoĖ¥Ě¾|sOr°jY`~I¾®I{GqpCgyl{£ÍÍyPLÂ¡¡¸kWxYlÙæŁĢz¾V´W¶ùŸo¾ZHxjwfxGNÁ³Xéæl¶EièIH ujÌQ~v|sv¶Ôi|ú¢FhQsğ¦SiŠBgÐE^ÁÐ{čnOÂÈUÎóĔÊēĲ}Z³½Mŧïeyp·uk³DsÑ¨L¶_ÅuÃ¨w»¡WqÜ]\\Ò§tƗcÕ¸ÕFÏǝĉăxŻČƟOKÉġÿ×wg÷IÅzCg]m«ªGeçÃTC«[t§{loWeC@ps_Bp­rf_``Z|ei¡oċMqow¹DƝÓDYpûsYkıǃ}s¥ç³[§cY§HK«Qy]¢wwö¸ïx¼ņ¾Xv®ÇÀµRĠÐHM±cÏdƒǍũȅȷ±DSyúĝ£ŤĀàtÖÿï[îb\\}pĭÉI±Ñy¿³x¯No|¹HÏÛmjúË~TuęjCöAwě¬Rđl¯ Ñb­ŇTĿ_[IčĄʿnM¦ğ\\É[T·k¹©oĕ@A¾wya¥Y\\¥Âaz¯ãÁ¡k¥ne£ÛwE©Êō¶˓uoj_U¡cF¹­[WvP©whuÕyBF`RqJUw\\i¡{jEPïÿ½fćQÑÀQ{°fLÔ~wXgītêÝ¾ĺHd³fJd]HJ²EoU¥HhwQsƐ»Xmg±çve]DmÍPoCc¾_hhøYrŊU¶eD°Č_N~øĹĚ·`z]Äþp¼äÌQv\\rCé¾TnkžŐÚÜa¼ÝƆĢ¶ÛodĔňÐ¢JqPb ¾|J¾fXƐîĨ_Z¯À}úƲN_ĒÄ^ĈaŐyp»CÇÄKñL³ġM²wrIÒŭxjb[n«øæà ^²­h¯ÚŐªÞ¸Y²ĒVø}Ā^İ´LÚm¥ÀJÞ{JVųÞŃx×sxxƈē ģMřÚðòIfĊŒ\\Ʈ±ŒdÊ§ĘDvČ_Àæ~Dċ´A®µ¨ØLV¦êHÒ¤',
              ],
            ],
            encodeOffsets: [[[113712, 34000]], [[115612, 30507]], [[113649, 34054]]],
          },
          properties: {
            cp: [114.298572, 30.584355],
            name: '湖北',
            childNum: 3,
          },
        },
        {
          id: '430000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@nFTs'],
              [
                '@@ßÅÆá½ÔXrCOËRïÿĩ­TooQyÓ[ŅBE¬ÎÓXaį§Ã¸G °ITxpúxÚĳ¥ÏĢ¾edÄ©ĸGàGhM¤Â_U}Ċ}¢pczfþg¤ÇòAVM',
              ],
              [
                '@@©KA·³CQ±Á«³BUƑ¹AtćOwD]JiØSm¯b£ylXHËÑ±H«C^õľAÅ§¤É¥ïyuǙuA¢^{ÌC´­¦ŷJ£^[ª¿ĕ~ƇN skóā¹¿ï]ă~÷O§­@Vm¡Qđ¦¢Ĥ{ºjÔª¥nf´~Õo×ÛąMąıuZmZcÒ ĲĪ²SÊǄŶ¨ƚCÖŎªQØ¼rŭ­«}NÏürÊ¬mjr@ĘrTW ­SsdHzƓ^ÇÂyUi¯DÅYlŹu{hT}mĉ¹¥ěDÿë©ıÓ[Oº£¥ótł¹MÕƪ`PDiÛU¾ÅâìUñBÈ£ýhedy¡oċ`pfmjP~kZaZsÐd°wj§@Ĵ®w~^kÀÅKvNmX\\¨aŃqvíó¿F¤¡@ũÑVw}S@j}¾«pĂrªg àÀ²NJ¶¶DôK|^ª°LX¾ŴäPĪ±£EXd^¶ĲÞÜ~u¸ǔMRhsRe`ÄofIÔ\\Ø  ićymnú¨cj ¢»GČìƊÿÐ¨XeĈĀ¾Oð Fi ¢|[jVxrIQ_EzAN¦zLU`cªxOTu RLÄ¢dVi`p˔vŎµªÉF~Ød¢ºgİàw¸Áb[¦Zb¦z½xBĖ@ªpºlS¸Ö\\Ĕ[N¥ˀmĎăJ\\ŀ`ňSÚĖÁĐiOĜ«BxDõĚivSÌ}iùÜnÐºG{p°M´wÀÒzJ²ò¨ oTçüöoÛÿñőĞ¤ùTz²CȆȸǎŪƑÐc°dPÎğË¶[È½u¯½WM¡­ÉB·rínZÒ `¨GA¾\\pēXhÃRC­üWGġuTé§ŎÑ©ò³I±³}_EÃħg®ęisÁPDmÅ{b[RÅs·kPŽƥóRoOV~]{g\\êYƪ¦kÝbiċƵGZ»Ěõó·³vŝ£ø@pyö_ëIkÑµbcÑ§y×dYØªiþ¨[]f]Ņ©C}ÁN»hĻħƏĩ',
              ],
            ],
            encodeOffsets: [[[115640, 30489]], [[112543, 27312]], [[116690, 26230]]],
          },
          properties: {
            cp: [112.982279, 28.19409],
            name: '湖南',
            childNum: 3,
          },
        },
        {
          id: '440000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@QdAua'],
              ['@@lxDLo'],
              ['@@sbhNLo'],
              ['@@Ă ā'],
              ['@@WltO[['],
              ['@@Kr]S'],
              ['@@eI]y'],
              ['@@I|Mym'],
              ['@@Û³LS¼Y'],
              ['@@nvºBëui©`¾'],
              ['@@zdÛJw®'],
              ['@@°¯'],
              ['@@a yAª¸ËJIxØ@ĀHAmÃV¡ofuo'],
              ['@@sŗÃÔėAƁZÄ ~°ČPäh'],
              ['@@¶ÝÌvmĞh­ıQ'],
              ['@@HdSjĒ¢D}waru«ZqadYM'],
              ['@@el\\LqqU'],
              ['@@~rMo\\'],
              ['@@f^C'],
              ['@@øPªoj÷ÍÝħXČx°Q¨ıXNv'],
              ['@@gÇƳo[~tly'],
              ['@@EÆC¿'],
              ['@@OP'],
              [
                '@@wđógĝ[³¡VÙæÅöMÌ³¹pÁaËýý©D©ÜJŹƕģGą¤{ÙūÇO²«BƱéAÒĥ¡«BhlmtÃPµyU¯ucd·w_bŝcīímGO|KPȏŹãŝIŕŭŕ@Óoo¿ē±ß}ŭĲWÈCőâUâǙIğŉ©IĳE×Á³AówXJþ±ÌÜÓĨ£L]ĈÙƺZǾĆĖMĸĤfÎĵlŨnÈĐtFFĤêk¶^k°f¶g}®Faf`vXŲxl¦ÔÁ²¬Ð¦pqÊÌ²iXØRDÎ}Ä@ZĠsx®AR~®ETtĄZƈfŠŠHâÒÐAµ\\S¸^wĖkRzalŜ|E¨ÈNĀňZTpBh£\\ĎƀuXĖtKL¶G|»ĺEļĞ~ÜĢÛĊrOÙîvd]n¬VÊĜ°RÖpMƂªFbwEÀ©\\¤]ŸI®¥D³|Ë]CöAŤ¦æ´¥¸Lv¼¢ĽBaôF~®²GÌÒEYzk¤°ahlVÕI^CxĈPsBƒºV¸@¾ªR²ĨN]´_eavSivc}p}Đ¼ƌkJÚe th_¸ ºx±ò_xNË²@ă¡ßH©Ùñ}wkNÕ¹ÇO½¿£ĕ]ly_WìIÇª`uTÅxYĒÖ¼kÖµMjJÚwn\\hĒv]îh|ÈƄøèg¸Ķß ĉĈWb¹ƀdéĘNTtP[öSvrCZaGubo´ŖÒÇĐ~¡zCIözx¢PnÈñ @ĥÒ¦]ƞV}³ăĔñiiÄÓVépKG½ÄÓávYoC·sitiaÀyŧÎ¡ÈYDÑům}ý|m[węõĉZÅxUO}÷N¹³ĉo_qtăqwµŁYÙǝŕ¹tïÛUÃ¯mRCºĭ|µÕÊK½Rē ó]GªęAx»HO£|ām¡diď×YïYWªŉOeÚtĐ«zđ¹TāúEá²\\ķÍ}jYàÙÆſ¿Çdğ·ùTßÇţʄ¡XgWÀǇğ·¿ÃOj YÇ÷Qěi',
              ],
            ],
            encodeOffsets: [
              [[117381, 22988]],
              [[116552, 22934]],
              [[116790, 22617]],
              [[116973, 22545]],
              [[116444, 22536]],
              [[116931, 22515]],
              [[116496, 22490]],
              [[116453, 22449]],
              [[113301, 21439]],
              [[118726, 21604]],
              [[118709, 21486]],
              [[113210, 20816]],
              [[115482, 22082]],
              [[113171, 21585]],
              [[113199, 21590]],
              [[115232, 22102]],
              [[115739, 22373]],
              [[115134, 22184]],
              [[113056, 21175]],
              [[119573, 21271]],
              [[119957, 24020]],
              [[115859, 22356]],
              [[116561, 22649]],
              [[116285, 22746]],
            ],
          },
          properties: {
            cp: [113.280637, 23.125178],
            name: '广东',
            childNum: 24,
          },
        },
        {
          id: '450000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@H TQ§A'],
              [
                '@@ĨÊªLƊDÎĹĐCǦė¸zÚGn£¾rªŀÜt¬@ÖÚSx~øOŒŶÐÂæȠ\\ÈÜObĖw^oÞLf¬°bI lTØBÌF£Ć¹gñĤaYt¿¤VSñK¸¤nM¼JE±½¸ñoÜCƆæĪ^ĚQÖ¦^f´QüÜÊz¯lzUĺš@ìp¶n]sxtx¶@~ÒĂJb©gk{°~c°`Ô¬rV\\la¼¤ôá`¯¹LCÆbxEræOv[H­[~|aB£ÖsºdAĐzNÂðsÞÆĤªbab`ho¡³F«èVlo¤ÔRzpp®SĪº¨ÖºNĳd`a¦¤F³ºDÎńĀìCĜº¦Ċ~nS|gźvZkCÆj°zVÈÁƔ]LÊFZgčP­kini«qÇczÍY®¬Ů»qR×ō©DÕ§ƙǃŵTÉĩ±ıdÑnYYĲvNĆĆØÜ Öp}e³¦m©iÓ|¹ħņ|ª¦QF¢Â¬ʖovg¿em^ucà÷gÕuíÙćĝ}FĻ¼Ĺ{µHKsLSđƃrč¤[AgoSŇYMÿ§Ç{FśbkylQxĕ]T·¶[BÑÏGáşşƇeăYSs­FQ}­BwtYğÃ@~CÍQ ×WjË±rÉ¥oÏ ±«ÓÂ¥kwWűmcih³K~µh¯e]lµélEģEďsmÇŧē`ãògK_ÛsUʝćğ¶höO¤Ǜn³c`¡y¦CezYwa[ďĵűMę§]XÎ_íÛ]éÛUćİÕBƣ±dy¹T^dûÅÑŦ·PĻþÙ`K¦¢ÍeĥR¿³£[~äu¼dltW¸oRM¢ď\\z}Æzdvň{ÎXF¶°Â_ÒÂÏL©ÖTmu¼ãlīkiqéfA·Êµ\\őDc¥ÝFyÔćcűH_hLÜêĺĐ¨c}rn`½Ì@¸¶ªVLhŒ\\Ţĺk~Ġið°|gtTĭĸ^xvKVGréAébUuMJVÃO¡qĂXËSģãlýà_juYÛÒBG^éÖ¶§EGÅzěƯ¤EkN[kdåucé¬dnYpAyČ{`]þ¯TbÜÈk¡ĠvàhÂƄ¢Jî¶²',
              ],
            ],
            encodeOffsets: [[[111707, 21520]], [[107619, 25527]]],
          },
          properties: {
            cp: [108.320004, 22.82402],
            name: '广西',
            childNum: 2,
          },
        },
        {
          id: '460000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@¦Ŝil¢XƦƞòïè§ŞCêɕrŧůÇąĻõ·ĉ³œ̅kÇm@ċȧŧĥĽʉ­ƅſȓÒË¦ŝE}ºƑ[ÍĜȋ gÎfǐÏĤ¨êƺ\\Ɔ¸ĠĎvʄȀÐ¾jNðĀÒRZǆzÐŘÎ°H¨Ƣb²_Ġ ',
            ],
            encodeOffsets: [[112750, 20508]],
          },
          properties: {
            cp: [110.33119, 20.031971],
            name: '海南',
            childNum: 1,
          },
        },
        {
          id: '510000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@LqKr'],
              [
                '@@[ĻéV£_ţġñpG réÏ·~ąSfy×Í·ºſƽiÍıƣıĻmHH}siaX@iÇ°ÁÃ×t«­T¤JJJyJÈ`Ohß¦¡uËhIyCjmÿwZGTiSsOB²fNmsPa{M{õE^Hj}gYpaeu¯oáwHjÁ½M¡pMuåmni{fk\\oÎqCwEZ¼KĝAy{m÷LwO×SimRI¯rKõBS«sFe]fµ¢óY_ÆPRcue°Cbo×bd£ŌIHgtrnyPt¦foaXďxlBowz_{ÊéWiêEGhÜ¸ºuFĈIxf®Y½ĀǙ]¤EyF²ċw¸¿@g¢§RGv»áW`ÃĵJwi]t¥wO­½a[×]`Ãi­üL¦LabbTÀåc}ÍhÆh®BHî|îºÉk­¤Sy£ia©taį·Ɖ`ō¥UhOĝLk}©Fos´JmµlŁuønÑJWÎªYÀïAetTŅÓGË«bo{ıwodƟ½OġÜÂµxàNÖ¾P²§HKv¾]|BÆåoZ`¡Ø`ÀmºĠ~ÌÐ§nÇ¿¤]wğ@srğu~Io[é±¹ ¿ſđÓ@qg¹zƱřaí°KtÇ¤V»Ã[ĩǭƑ^ÇÓ@áťsZÏÅĭƋěpwDóÖáŻneQËq·GCœýS]x·ýq³OÕ¶Qzßti{řáÍÇWŝŭñzÇWpç¿JXĩè½cFÂLiVjx}\\NŇĖ¥GeJA¼ÄHfÈu~¸Æ«dE³ÉMA|bÒćhG¬CMõƤąAvüVéŀ_VÌ³ĐwQj´·ZeÈÁ¨X´Æ¡Qu·»ÕZ³ġqDoy`L¬gdp°şp¦ėìÅĮZ°Iähzĵf²å ĚÑKpIN|Ñz]ń·FU×é»R³MÉ»GM«kiér}Ã`¹ăÞmÈnÁîRǀ³ĜoİzŔwǶVÚ£À]ɜ»ĆlƂ²ĠþTº·àUȞÏʦ¶I«dĽĢdĬ¿»Ĕ×h\\c¬ä²GêëĤł¥ÀǿżÃÆMº}BÕĢyFVvwxBèĻĒ©ĈtCĢɽŠȣ¦āæ·HĽîôNÔ~^¤Ɗu^s¼{TA¼ø°¢İªDè¾Ň¶ÝJ®Z´ğ~Sn|ªWÚ©òzPOȸbð¢|øĞŒQìÛÐ@ĞǎRS¤Á§di´ezÝúØã]HqkIþËQÇ¦ÃsÇ¤[E¬ÉŪÍxXƒ·ÖƁİlƞ¹ª¹|XÊwnÆƄmÀêErĒtD®ċæcQE®³^ĭ¥©l}äQtoŖÜqÆkµªÔĻĴ¡@Ċ°B²Èw^^RsºTĀ£ŚæQPJvÄz^Đ¹Æ¯fLà´GC²dt­ĀRt¼¤ĦOðğfÔðDŨŁĞƘïPÈ®âbMüÀXZ ¸£@Å»»QÉ­]dsÖ×_Í_ÌêŮPrĔĐÕGĂeZÜîĘqBhtO ¤tE[h|YÔZśÎs´xº±Uñt|OĩĠºNbgþJy^dÂY Į]Řz¦gC³R`Āz¢Aj¸CL¤RÆ»@­Ŏk\\Ç´£YW}z@Z}Ã¶oû¶]´^NÒ}èNªPÍy¹`S°´ATeVamdUĐwʄvĮÕ\\uÆŗ¨Yp¹àZÂmWh{á}WØǍÉüwga§áCNęÎ[ĀÕĪgÖÉªXøx¬½Ů¦¦[NÎLÜUÖ´òrÙŠxR^JkĳnDX{U~ET{ļº¦PZcjF²Ė@pg¨B{u¨ŦyhoÚD®¯¢ WòàFÎ¤¨GDäz¦kŮPġqË¥À]eâÚ´ªKxīPÖ|æ[xÃ¤JÞĥsNÖ½I¬nĨY´®ÐƐmDŝuäđđEbee_v¡}ìęǊē}qÉåT¯µRs¡M@}ůaa­¯wvƉåZw\\Z{åû^',
              ],
            ],
            encodeOffsets: [[[108815, 30935]], [[110617, 31811]]],
          },
          properties: {
            cp: [104.065735, 30.659462],
            name: '四川',
            childNum: 2,
          },
        },
        {
          id: '520000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@G\\lY£in'],
              ['@@q|mc¯tÏVSÎ'],
              [
                '@@hÑ£IsNgßHHªķÃh_¹¡ĝÄ§ń¦uÙùgS¯JH|sÝÅtÁïyMDč»eÕtA¤{b\\}G®u\\åPFqwÅaDK°ºâ_£ùbµmÁÛĹM[q|hlaªāI}Ñµ@swtwm^oµDéĽŠyVky°ÉûÛR³e¥]RÕěħ[ƅåÛDpJiVÂF²I»mN·£LbÒYbWsÀbpkiTZĄă¶Hq`ĥ_J¯ae«KpÝx]aĕÛPÇȟ[ÁåŵÏő÷Pw}TÙ@Õs«ĿÛq©½m¤ÙH·yǥĘĉBµĨÕnđ]K©œáGçş§ÕßgǗĦTèƤƺ{¶ÉHÎd¾ŚÊ·OÐjXWrãLyzÉAL¾ę¢bĶėy_qMĔąro¼hĊw¶øV¤w²Ĉ]ÊKx|`ź¦ÂÈdrcÈbe¸`I¼čTF´¼Óýȃr¹ÍJ©k_șl³´_pĐ`oÒh¶pa^ÓĔ}D»^Xy`d[KvJPhèhCrĂĚÂ^Êƌ wZL­Ġ£ÁbrzOIlMMĪŐžËr×ÎeŦtw|¢mKjSǘňĂStÎŦEtqFT¾Eì¬¬ôxÌO¢ K³ŀºäYPVgŎ¦ŊmŞ¼VZwVlz¤£Tl®ctĽÚó{G­AÇge~Îd¿æaSba¥KKûj®_Ä^\\Ø¾bP®¦x^sxjĶI_Ä Xâ¼Hu¨Qh¡À@Ëô}±GNìĎlT¸`V~R°tbÕĊ`¸úÛtÏFDu[MfqGH·¥yAztMFe|R_GkChZeÚ°tov`xbDnÐ{E}ZèxNEÞREn[Pv@{~rĆAB§EO¿|UZ~ìUf¨J²ĂÝÆsªB`s¶fvö¦Õ~dÔq¨¸º»uù[[§´sb¤¢zþF¢ÆÀhÂW\\ıËIÝo±ĭŠ£þÊs}¡R]ěDg´VG¢j±®èºÃmpU[Áëº°rÜbNu¸}º¼`niºÔXĄ¤¼ÔdaµÁ_ÃftQQgR·Ǔv}Ý×ĵ]µWc¤F²OĩųãW½¯K©]{LóµCIµ±Mß¿h©āq¬o½~@i~TUxŪÒ¢@£ÀEîôruńb[§nWuMÆLl¿]x}ĳ­½',
              ],
            ],
            encodeOffsets: [[[112158, 27383]], [[112105, 27474]], [[112095, 27476]]],
          },
          properties: {
            cp: [106.713478, 26.578343],
            name: '贵州',
            childNum: 3,
          },
        },
        {
          id: '530000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@[ùx½}ÑRHYīĺûsÍniEoã½Ya²ė{c¬ĝgĂsAØÅwďõzFjw}«Dx¿}Uũlê@HÅ­F¨ÇoJ´Ónũuą¡Ã¢pÒÅØ TF²xa²ËXcÊlHîAßËŁkŻƑŷÉ©hW­æßUËs¡¦}teèÆ¶StÇÇ}Fd£jĈZĆÆ¤Tč\\D}O÷£U§~ŃGåŃDĝ¸Tsd¶¶Bª¤u¢ŌĎo~t¾ÍŶÒtD¦ÚiôözØX²ghįh½Û±¯ÿm·zR¦Ɵ`ªŊÃh¢rOÔ´£Ym¼èêf¯ŪĽncÚbw\\zlvWªâ ¦gmĿBĹ£¢ƹřbĥkǫßeeZkÙIKueT»sVesbaĕ  ¶®dNĄÄpªy¼³BE®lGŭCǶwêżĔÂepÍÀQƞpC¼ŲÈ­AÎô¶RäQ^Øu¬°_Èôc´¹ò¨PÎ¢hlĎ¦´ĦÆ´sâÇŲPnÊD^¯°Upv}®BPÌªjǬxSöwlfòªvqĸ|`H­viļndĜ­Ćhňem·FyÞqóSį¯³X_ĞçêtryvL¤§z¦c¦¥jnŞklD¤øz½ĜàĂŧMÅ|áƆàÊcðÂFÜáŢ¥\\\\ºİøÒÐJĴîD¦zK²ǏÎEh~CD­hMn^ÌöÄ©ČZÀaüfɭyœpį´ěFűk]Ôě¢qlÅĆÙa¶~ÄqêljN¬¼HÊNQ´ê¼VØ¸E^ŃÒyM{JLoÒęæe±Ķygã¯JYÆĭĘëo¥Šo¯hcK«z_prC´ĢÖY¼ v¸¢RÅW³Â§fÇ¸Yi³xR´ďUË`êĿUûuĆBƣöNDH«ĈgÑaB{ÊNF´¬c·Åv}eÇÃGB»If¦HňĕM~[iwjUÁKE¾dĪçWIèÀoÈXòyŞŮÈXâÎŚj|àsRyµÖPr´þ ¸^wþTDŔHr¸RÌmfżÕâCôoxĜƌÆĮÐYtâŦÔ@]ÈǮƒ\\Ī¼Ä£UsÈ¯LbîƲŚºyhr@ĒÔƀÀ²º\\êpJ}ĠvqtĠ@^xÀ£È¨mËÏğ}n¹_¿¢×Y_æpÅA^{½Lu¨GO±Õ½ßM¶wÁĢÛPƢ¼pcĲx|apÌ¬HÐŊSfsðBZ¿©XÏÒKk÷Eû¿SrEFsÕūkóVǥŉiTL¡n{uxţÏhôŝ¬ğōNNJkyPaqÂğ¤K®YxÉƋÁ]āęDqçgOgILu\\_gz]W¼~CÔē]bµogpÑ_oď`´³Țkl`IªºÎȄqÔþ»E³ĎSJ»_f·adÇqÇc¥Á_Źw{L^É±ćxU£µ÷xgĉp»ĆqNē`rĘzaĵĚ¡K½ÊBzyäKXqiWPÏÉ¸½řÍcÊG|µƕƣGË÷k°_^ý|_zċBZocmø¯hhcæ\\lMFlư£ĜÆyHF¨µêÕ]HAàÓ^it `þßäkĤÎT~Wlÿ¨ÔPzUCNVv [jâôDôď[}z¿msSh¯{jïğl}šĹ[őgK©U·µË@¾m_~q¡f¹ÅË^»f³ø}Q¡ÖË³gÍ±^Ç\\ëÃA_¿bWÏ[¶ƛé£F{īZgm@|kHǭƁć¦UĔť×ë}ǝeďºȡȘÏíBÉ£āĘPªĳ¶ŉÿy©nď£G¹¡I±LÉĺÑdĉÜW¥}gÁ{aqÃ¥aıęÏZï`',
            ],
            encodeOffsets: [[104636, 22969]],
          },
          properties: {
            cp: [102.712251, 25.040609],
            name: '云南',
            childNum: 1,
          },
        },
        {
          id: '540000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@ÂhľxŖxÒVºÅâAĪÝȆµę¯Ňa±r_w~uSÕňqOj]ɄQ£ZUDûoY»©M[L¼qãË{VÍçWVi]ë©Ä÷àyƛhÚU°adcQ~Mx¥cc¡ÙaSyFÖk­uRýq¿ÔµQĽ³aG{¿FµëªéĜÿª@¬·K·àariĕĀ«V»ŶĴūgèLǴŇƶaftèBŚ£^âǐÝ®M¦ÁǞÿ¬LhJ¾óƾÆºcxwf]Y´¦|QLn°adĊ\\¨oǀÍŎ´ĩĀd`tÊQŞŕ|¨C^©Ĉ¦¦ÎJĊ{ëĎjª²rÐl`¼Ą[t|¦Stè¾PÜK¸dƄı]s¤î_v¹ÎVòŦj£Əsc¬_Ğ´|Ł¦Av¦w`ăaÝaa­¢e¤ı²©ªSªÈMĄwÉØŔì@T¤Ę\\õª@þo´­xA sÂtŎKzó´ÇĊµ¢r^nĊ­Æ¬×üG¢³ {âĊ]G~bÀgVjzlhǶfOfdªB]pjTOtĊn¤}®¦Č¥d¢¼»ddY¼t¢eȤJ¤}Ǿ¡°§¤AÐlc@ĝsªćļđAçwxUuzEÖġ~AN¹ÄÅȀŻ¦¿ģŁéì±Hãd«g[Ø¼ēÀcīľġ¬cJµÐʥVȝ¸ßS¹ý±ğkƁ¼ą^ɛ¤Ûÿb[}¬ōõÃ]ËNm®g@Bg}ÍF±ǐyL¥íCIĳÏ÷Ñį[¹¦[âšEÛïÁÉdƅß{âNÆāŨß¾ě÷yC£k­´ÓH@Â¹TZ¥¢į·ÌAÐ§®Zcv½Z­¹|ÅWZqgW|ieZÅYVÓqdqbc²R@c¥Rã»GeeƃīQ}J[ÒK¬Ə|oėjġĠÑN¡ð¯EBčnwôɍėª²CλŹġǝʅįĭạ̃ūȹ]ΓͧgšsgȽóϧµǛęgſ¶ҍć`ĘąŌJÞä¤rÅň¥ÖÁUětęuůÞiĊÄÀ\\Æs¦ÓRb|Â^řÌkÄŷ¶½÷f±iMÝ@ĥ°G¬ÃM¥n£Øąğ¯ß§aëbéüÑOčk£{\\eµª×MÉfm«Ƒ{Å×Gŏǩãy³©WÑăû··Qòı}¯ãIéÕÂZ¨īès¶ZÈsæĔTŘvgÌsN@îá¾ó@ÙwU±ÉTå»£TđWxq¹Zobs[×¯cĩvėŧ³BM|¹kªħ¥TzNYnÝßpęrñĠĉRS~½ěVVµõ«M££µBĉ¥áºae~³AuĐh`Ü³ç@BÛïĿa©|z²Ý¼D£àč²ŸIûI āóK¥}rÝ_Á´éMaň¨~ªSĈ½½KÙóĿeƃÆB·¬ën×W|Uº}LJrƳlŒµ`bÔ`QÐÓ@s¬ñIÍ@ûws¡åQÑßÁ`ŋĴ{ĪTÚÅTSÄ³Yo|Ç[Ç¾µMW¢ĭiÕØ¿@MhpÕ]jéò¿OƇĆƇpêĉâlØwěsǩĵ¸cbU¹ř¨WavquSMzeo_^gsÏ·¥Ó@~¯¿RiīB\\qTGªÇĜçPoÿfñòą¦óQīÈáPābß{ZŗĸIæÅhnszÁCËìñÏ·ąĚÝUm®ó­L·ăUÈíoù´Êj°ŁŤ_uµ^°ìÇ@tĶĒ¡ÆM³Ģ«İĨÅ®ğRāðggheÆ¢zÊ©Ô\\°ÝĎz~ź¤PnMĪÖB£kné§żćĆKĒ°¼L¶èâz¨u¦¥LDĘz¬ýÎmĘd¾ßFzhg²Fy¦ĝ¤ċņbÎ@yĄæm°NĮZRÖíJ²öLĸÒ¨Y®ƌÐVàtt_ÚÂyĠz]ŢhzĎ{ÂĢXc|ÐqfO¢¤ögÌHNPKŖUú´xx[xvĐCûĀìÖT¬¸^}Ìsòd´_KgžLĴÀBon|H@Êx¦BpŰŌ¿fµƌA¾zǈRx¶FkĄźRzŀ~¶[´HnªVƞuĒ­È¨ƎcƽÌm¸ÁÈM¦x͊ëÀxǆBú^´W£dkɾĬpw˂ØɦļĬIŚÊnŔa¸~J°îlɌxĤÊÈðhÌ®gT´øàCÀ^ªerrƘd¢İP|Ė ŸWªĦ^¶´ÂLaT±üWƜǀRÂŶUńĖ[QhlLüAÜ\\qRĄ©',
            ],
            encodeOffsets: [[90849, 37210]],
          },
          properties: {
            cp: [91.132212, 29.660361],
            name: '西藏',
            childNum: 1,
          },
        },
        {
          id: '610000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@p¢ȮµûGĦ}Ħðǚ¶òƄjɂz°{ºØkÈęâ¦jªBg\\ċ°s¬]jú EȌǆ¬stRÆdĠİwÜ¸ôW¾ƮłÒ_{Ìû¼jº¹¢GǪÒ¯ĘZ`ºŊecņą~BÂgzpâēòYǠȰÌTÎ¨ÂW|fcă§uF@N¢XLRMº[ğȣſï|¥Jkc`sŉǷY¹W@µ÷Kãï³ÛIcñ·VȋÚÒķø©þ¥yÓğęmWµÎumZyOŅƟĥÓ~sÑL¤µaÅY¦ocyZ{y c]{Ta©`U_Ěē£ωÊƍKùK¶ȱÝƷ§{û»ÅÁȹÍéuĳ|¹cÑdìUYOuFÕÈYvÁCqÓTǢí§·S¹NgV¬ë÷Át°DØ¯C´ŉƒópģ}ċcEËFéGU¥×K§­¶³BČ}C¿åċ`wġB·¤őcƭ²ő[Å^axwQOÿEËßŚĤNĔwƇÄńwĪ­o[_KÓª³ÙnKÇěÿ]ďă_d©·©Ýŏ°Ù®g]±ßå¬÷m\\iaǑkěX{¢|ZKlçhLtŇîŵœè[É@ƉĄEtƇÏ³­ħZ«mJ×¾MtÝĦ£IwÄå\\Õ{OwĬ©LÙ³ÙgBƕŀrÌĢŭO¥lãyC§HÍ£ßEñX¡­°ÙCgpťzb`wIvA|§hoĕ@E±iYd¥OĻ¹S|}F@¾oAO²{tfÜ¢FǂÒW²°BĤh^Wx{@¬­F¸¡ķn£P|ªĴ@^ĠĈæbÔc¶lYi^MicĎ°Â[ävï¶gv@ÀĬ·lJ¸sn|¼u~a]ÆÈtŌºJpþ£KKf~¦UbyäIĺãnÔ¿^­ŵMThĠÜ¤ko¼Ŏìąǜh`[tRd²Ĳ_XPrɲlXiL§à¹H°Ȧqº®QCbAŌJ¸ĕÚ³ĺ§ `d¨YjiZvRĺ±öVKkjGȊÄePĞZmļKÀ[`ösìhïÎoĬdtKÞ{¬èÒÒBÔpĲÇĬJŊ¦±J«Y§@·pHµàåVKepWftsAÅqC·¬ko«pHÆuK@oHĆÛķhxenS³àǍrqƶRbzy¸ËÐl¼EºpĤ¼x¼½~Ğà@ÚüdK^mÌSj',
            ],
            encodeOffsets: [[110234, 38774]],
          },
          properties: {
            cp: [108.948024, 34.263161],
            name: '陕西',
            childNum: 1,
          },
        },
        {
          id: '620000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@VuUv'],
              [
                '@@ũEĠtt~nkh`Q¦ÅÄÜdwAb×ĠąJ¤DüègĺqBqj°lI¡ĨÒ¤úSHbjÎB°aZ¢KJO[|A£Dx}NĂ¬HUnrk kp¼Y kMJn[aGáÚÏ[½rc}aQxOgsPMnUsncZsKúvAtÞġ£®ĀYKdnFw¢JE°Latf`¼h¬we|Æbj}GA·~W`¢MC¤tL©Ĳ°qdfObÞĬ¹ttu`^ZúE`[@Æsîz®¡CƳƜG²R¢RmfwĸgÜą G@pzJM½mhVy¸uÈÔO±¨{LfæU¶ßGĂq\\ª¬²I¥IŉÈīoıÓÑAçÑ|«LÝcspīðÍgtë_õ\\ĉñLYnĝgRǡÁiHLlõUĹ²uQjYi§Z_c¨´ĹĖÙ·ŋIaBD­R¹ȥr¯GºßK¨jWkɱOqWĳ\\a­Q\\sg_ĆǛōëp»£lğÛgSŶN®À]ÓämĹãJaz¥V}Le¤Lýo¹IsŋÅÇ^bz³tmEÁ´a¹cčecÇNĊãÁ\\č¯dNj]jZµkÓdaćå]ğĳ@ ©O{¤ĸm¢E·®«|@Xwg]Aģ±¯XǁÑǳªcwQÚŝñsÕ³ÛV_ý¥\\ů¥©¾÷w©WÕÊĩhÿÖÁRo¸V¬âDb¨hûxÊ×ǌ~Zâg|XÁnßYoº§ZÅŘv[ĭÖʃuďxcVbnUSfB¯³_TzºÎO©çMÑ~M³]µ^püµÄY~y@X~¤Z³[Èōl@®Å¼£QK·Di¡ByÿQ_´D¥hŗy^ĭÁZ]cIzýah¹MĪğPs{ò²Vw¹t³ŜË[Ñ}X\\gsF£sPAgěp×ëfYHāďÖqēŭOÏëdLü\\it^c®RÊº¶¢H°mrY£B¹čIoľu¶uI]vģSQ{UŻÅ}QÂ|Ì°ƅ¤ĩŪU ęĄÌZÒ\\v²PĔ»ƢNHĂyAmƂwVm`]ÈbH`Ì¢²ILvĜH®¤Dlt_¢JJÄämèÔDëþgºƫaʎÌrêYi~ Îİ¤NpÀA¾Ĕ¼bð÷®üszMzÖĖQdȨýv§Tè|ªHÃ¾a¸|Ð ƒwKĢx¦ivr^ÿ ¸l öæfƟĴ·PJv}n\\h¹¶v·À|\\ƁĚN´ĜçèÁz]ġ¤²¨QÒŨTIlªťØ}¼˗ƦvÄùØEÂ«FïËIqōTvāÜŏíÛßÛVj³âwGăÂíNOPìyV³ŉĖýZso§HÑiYw[ß\\X¦¥c]ÔƩÜ·«jÐqvÁ¦m^ċ±R¦΋ƈťĚgÀ»IïĨʗƮ°ƝĻþÍAƉſ±tÍEÕÞāNUÍ¡\\ſčåÒʻĘm ƭÌŹöʥëQ¤µ­ÇcƕªoIýIÉ_mkl³ăƓ¦j¡YzŇi}Msßõīʋ }ÁVm_[n}eı­Uĥ¼ªI{Î§DÓƻėojqYhĹT©oūĶ£]ďxĩǑMĝq`B´ƃ˺Чç~²ņj@¥@đ´ί}ĥtPńÇ¾V¬ufÓÉCtÓ̻¹£G³]ƖƾŎĪŪĘ̖¨ʈĢƂlɘ۪üºňUðǜȢƢż̌ȦǼĤŊɲĖÂ­Kq´ï¦ºĒǲņɾªǀÞĈĂD½ĄĎÌŗĞrôñnN¼â¾ʄľԆ|Ǆ֦ज़ȗǉ̘̭ɺƅêgV̍ʆĠ·ÌĊv|ýĖÕWĊǎÞ´õ¼cÒÒBĢ͢UĜð͒s¨ňƃLĉÕÝ@ɛƯ÷¿Ľ­ĹeȏĳëCȚDŲyê×Ŗyò¯ļcÂßYtÁƤyAã˾J@ǝrý@¤rz¸oP¹ɐÚyáHĀ[JwcVeȴÏ»ÈĖ}ƒŰŐèȭǢόĀƪÈŶë;Ñ̆ȤМľĮEŔĹŊũ~ËUă{ĻƹɁύȩþĽvĽƓÉ@ēĽɲßǐƫʾǗĒpäWÐxnsÀ^ƆwW©¦cÅ¡Ji§vúF¶¨c~c¼īeXǚ\\đ¾JwÀďksãAfÕ¦L}waoZD½Ml«]eÒÅaÉ²áo½FõÛ]ĻÒ¡wYR£¢rvÓ®y®LFLzĈôe]gx}|KK}xklL]c¦£fRtív¦PĤoH{tK',
              ],
            ],
            encodeOffsets: [[[108619, 36299]], [[108589, 36341]]],
          },
          properties: {
            cp: [103.823557, 36.058039],
            name: '甘肃',
            childNum: 2,
          },
        },
        {
          id: '630000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@InJm'],
              [
                '@@CÆ½OŃĦsΰ~Ē³¦@@Ņi±è}ШƄ˹A³r_ĞǒNĪĐw¤^ŬĵªpĺSZgrpiƼĘÔ¨C|ÍJ©Ħ»®VĲ~f\\m `UnÂ~ʌĬàöNt~ňjy¢ZiƔ¥Ąk´nl`JÊJþ©pdƖ®È£¶ìRʦźõƮËnʼėæÑƀĎ[¢VÎĂMÖÝÎF²sƊƀÎBļýƞ¯ʘƭðħ¼Jh¿ŦęΌƇ¥²Q]Č¥nuÂÏri¸¬ƪÛ^Ó¦d¥[Wàx\\ZjÒ¨GtpþYŊĕ´zUOëPîMĄÁxH´áiÜUàîÜŐĂÛSuŎrJðÌ¬EFÁú×uÃÎkrĒ{V}İ«O_ÌËĬ©ÓŧSRÑ±§Ģ£^ÂyèçěM³Ƃę{[¸¿uºµ[gt£¸OƤĿéYõ·kĀq]juw¥DĩƍõÇPéÄ½G©ã¤GuȧþRcÕĕNyyût­øï»a½ē¿BMoį£Íj}éZËqbʍƬh¹ìÿÓAçãnIÃ¡I`ks£CG­ěUy×Cy@¶ʡÊBnāzGơMē¼±O÷õJËĚăVĪũƆ£¯{ËL½ÌzżVR|ĠTbuvJvµhĻĖHAëáa­OÇðñęNwœľ·LmI±íĠĩPÉ×®ÿscB³±JKßĊ«`ađ»·QAmOVţéÿ¤¹SQt]]Çx±¯A@ĉĳ¢Óļ©l¶ÅÛrŕspãRk~¦ª]Į­´FRåd­ČsCqđéFn¿ÅƃmÉx{W©ºƝºįkÕƂƑ¸wWūÐ©ÈF£\\tÈ¥ÄRÈýÌJ lGr^×äùyÞ³fjc¨£ÂZ|ǓMĝÏ@ëÜőRĝ÷¡{aïȷPu°ËXÙ{©TmĠ}Y³­ÞIňµç½©C¡į÷¯B»|St»]vųs»}MÓ ÿʪƟǭA¡fs»PY¼c¡»¦cċ­¥£~msĉPSi^o©AecPeǵkgyUi¿h}aHĉ^|á´¡HØûÅ«ĉ®]m¡qĉ¶³ÈyôōLÁstB®wn±ă¥HSòė£Së@×œÊăxÇN©©T±ª£Ĳ¡fb®Þbb_Ą¥xu¥B{łĝ³«`dƐt¤ťiñÍUuºí`£^tƃĲc·ÛLO½sç¥Ts{ă\\_»kÏ±q©čiìĉ|ÍI¥ć¥]ª§D{ŝŖÉR_sÿc³ĪōƿÎ§p[ĉc¯bKmR¥{³Ze^wx¹dƽÅ½ôIg §Mĕ ƹĴ¿ǣÜÍ]Ý]snåA{eƭ`ǻŊĿ\\ĳŬűYÂÿ¬jĖqßb¸L«¸©@ěĀ©ê¶ìÀEH|´bRľÓ¶rÀQþvl®ÕETzÜdb hw¤{LRdcb¯ÙVgƜßzÃôì®^jUèXÎ|UäÌ»rK\\ªN¼pZCüVY¤ɃRi^rPŇTÖ}|br°qňbĚ°ªiƶGQ¾²x¦PmlŜ[Ĥ¡ΞsĦÔÏâ\\ªÚŒU\\f¢N²§x|¤§xĔsZPòʛ²SÐqF`ªVÞŜĶƨVZÌL`¢dŐIqr\\oäõFÎ·¤»Ŷ×h¹]ClÙ\\¦ďÌį¬řtTӺƙgQÇÓHţĒ´ÃbEÄlbʔC|CŮkƮ[ʼ¬ň´KŮÈΰÌĪ¶ƶlðļATUvdTGº̼ÔsÊDÔveOg',
              ],
            ],
            encodeOffsets: [[[105308, 37219]], [[95370, 40081]]],
          },
          properties: {
            cp: [101.778916, 36.623178],
            name: '青海',
            childNum: 2,
          },
        },
        {
          id: '640000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                '@@KëÀęĞ«Oęȿȕı]ŉ¡åįÕÔ«ǴõƪĚQÐZhv K°öqÀÑS[ÃÖHƖčËnL]ûcÙß@ĝ¾}w»»oģF¹»kÌÏ·{zP§B­¢íyÅt@@á]Yv_ssģ¼ißĻL¾ġsKD£¡N_X¸}B~HaiÅf{«x»ge_bsKF¯¡IxmELcÿZ¤­ĢÝsuBLùtYdmVtNmtOPhRw~bd¾qÐ\\âÙH\\bImlNZ»loqlVmGā§~QCw¤{A\\PKNY¯bFkC¥sks_Ã\\ă«¢ħkJi¯rrAhĹûç£CUĕĊ_ÔBixÅÙĄnªÑaM~ħpOu¥sîeQ¥¤^dkKwlL~{L~hw^ófćKyE­K­zuÔ¡qQ¤xZÑ¢^ļöÜ¾Ep±âbÊÑÆ^fk¬NC¾YpxbK~¥eÖäBlt¿Đx½I[ĒǙWf»Ĭ}d§dµùEuj¨IÆ¢¥dXªƅx¿]mtÏwßRĶX¢͎vÆzƂZò®ǢÌʆCrâºMÞzÆMÒÊÓŊZÄ¾r°Î®Ȉmª²ĈUªĚîøºĮ¦ÌĘk^FłĬhĚiĀĖ¾iİbjÕ',
              ],
              ['@@mfwěwMrŢªv@G'],
            ],
            encodeOffsets: [[[109366, 40242]], [[108600, 36303]]],
          },
          properties: {
            cp: [106.278179, 38.46637],
            name: '宁夏',
            childNum: 2,
          },
        },
        {
          id: '650000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@QØĔ²X¨~ǘBºjʐßØvKƔX¨vĊOÃ·¢i@~cĝe_«E}QxgɪëÏÃ@sÅyXoŖ{ô«ŸuXêÎf`C¹ÂÿÐGĮÕĞXŪōŸMźÈƺQèĽôe|¿ƸJR¤ĘEjcUóº¯Ĩ_ŘÁMª÷Ð¥OéÈ¿ÖğǤǷÂFÒzÉx[]­Ĥĝœ¦EP}ûƥé¿İƷTėƫœŕƅƱB»Đ±ēO¦E}`cȺrĦáŖuÒª«ĲπdƺÏØZƴwʄ¤ĖGĐǂZĶèH¶}ÚZצʥĪï|ÇĦMŔ»İĝǈì¥Βba­¯¥ǕǚkĆŵĦɑĺƯxūД̵nơʃĽá½M»òmqóŘĝčË¾ăCćāƿÝɽ©ǱŅ¹đ¥³ðLrÁ®ɱĕģŉǻ̋ȥơŻǛȡVï¹Ň۩ûkɗġƁ§ʇė̕ĩũƽō^ƕUv£ƁQïƵkŏ½ΉÃŭÇ³LŇʻ«ƭ\\lŭD{ʓDkaFÃÄa³ŤđÔGRÈƚhSӹŚsİ«ĐË[¥ÚDkº^Øg¼ŵ¸£EÍöůŉT¡c_ËKYƧUśĵÝU_©rETÏʜ±OñtYwē¨{£¨uM³x½şL©Ùá[ÓÐĥ Νtģ¢\\śnkOw¥±T»ƷFɯàĩÞáB¹ÆÑUwŕĽw[mG½Èå~Æ÷QyěCFmĭZīŵVÁƿQƛûXS²b½KÏ½ĉS©ŷXĕ{ĕK·¥Ɨcqq©f¿]ßDõU³h­gËÇïģÉɋwk¯í}I·œbmÉřīJɥĻˁ×xoɹīlc¤³Xù]ǅA¿w͉ì¥wÇN·ÂËnƾƍdÇ§đ®ƝvUm©³G\\}µĿQyŹlăµEwǇQ½yƋBe¶ŋÀůo¥AÉw@{Gpm¿AĳŽKLh³`ñcËtW±»ÕSëüÿďDu\\wwwù³VLŕOMËGh£õP¡erÏd{ġWÁč|yšg^ğyÁzÙs`s|ÉåªÇ}m¢Ń¨`x¥ù^}Ì¥H«YªƅAÐ¹n~ź¯f¤áÀzgÇDIÔ´AňĀÒ¶ûEYospõD[{ù°]uJqU|Soċxţ[õÔĥkŋÞŭZËºóYËüċrw ÞkrťË¿XGÉbřaDü·Ē÷AÃª[ÄäIÂ®BÕĐÞ_¢āĠpÛÄȉĖġDKwbmÄNôfƫVÉviǳHQµâFù­Âœ³¦{YGd¢ĚÜO {Ö¦ÞÍÀP^bƾl[vt×ĈÍEË¨¡Đ~´î¸ùÎhuè`¸HÕŔVºwĠââWò@{ÙNÝ´ə²ȕn{¿¥{l÷eé^eďXj©î\\ªÑòÜìc\\üqÕ[Č¡xoÂċªbØ­ø|¶ȴZdÆÂońéG\\¼C°ÌÆn´nxÊOĨŪƴĸ¢¸òTxÊǪMīĞÖŲÃɎOvʦƢ~FRěò¿ġ~åŊúN¸qĘ[Ĕ¶ÂćnÒPĒÜvúĀÊbÖ{Äî¸~Ŕünp¤ÂH¾ĄYÒ©ÊfºmÔĘcDoĬMŬS¤s²ʘÚžȂVŦ èW°ªB|ĲXŔþÈJĦÆæFĚêYĂªĂ]øªŖNÞüAfɨJ¯ÎrDDĤ`mz\\§~D¬{vJÂ«lµĂb¤pŌŰNĄ¨ĊXW|ų ¿¾ɄĦƐMTòP÷fØĶK¢ȝ˔Sô¹òEð­`Ɩ½ǒÂň×äı§ĤƝ§C~¡hlåǺŦŞkâ~}FøàĲaĞfƠ¥Ŕd®U¸źXv¢aƆúŪtŠųƠjdƺƺÅìnrh\\ĺ¯äɝĦ]èpĄ¦´LƞĬ´ƤǬ˼Ēɸ¤rºǼ²¨zÌPðŀbþ¹ļD¢¹\\ĜÑŚ¶ZƄ³àjĨoâȴLÊȮĐ­ĚăÀêZǚŐ¤qȂ\\L¢ŌİfÆs|zºeªÙæ§΢{Ā´ƐÚ¬¨Ĵà²łhʺKÞºÖTiƢ¾ªì°`öøu®Ê¾ãØ',
            ],
            encodeOffsets: [[88824, 50096]],
          },
          properties: {
            cp: [87.617733, 43.792818],
            name: '新疆',
            childNum: 1,
          },
        },
        {
          id: '110000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@ĽOÁûtŷmiÍt_H»Ĩ±d`¹­{bwYr³S]§§o¹qGtm_SŧoaFLgQN_dV@Zom_ć\\ßcÂ±x¯oœRcfe£o§ËgToÛJíĔóu|wP¤XnO¢ÉŦ¯rNÄā¤zâŖÈRpŢZÚ{GrFt¦Òx§ø¹RóäV¤XdżâºWbwŚ¨Ud®bêņ¾jnŎGŃŶnzÚSeîĜZczî¾i]ÍQaúÍÔiþĩȨWĢü|Ėu[qb[swP@ÅğP¿{\\¥A¨ÏÑ¨j¯X\\¯MKpA³[Hīu}}',
            ],
            encodeOffsets: [[120023, 41045]],
          },
          properties: {
            cp: [116.405285, 39.904989],
            name: '北京',
            childNum: 1,
          },
        },
        {
          id: '120000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: [
              '@@ŬgX§Ü«E¶FÌ¬O_ïlÁgz±AXeµÄĵ{¶]gitgIj·¥îakS¨ÐƎk}ĕ{gBqGf{¿aU^fIư³õ{YıëNĿk©ïËZŏR§òoY×Ógcĥs¡bġ«@dekąI[nlPqCnp{ō³°`{PNdƗqSÄĻNNâyj]äÒD ĬH°Æ]~¡HO¾X}ÐxgpgWrDGpù^LrzWxZ^¨´T\\|~@IzbĤjeĊªz£®ĔvěLmV¾Ô_ÈNW~zbĬvG²ZmDM~~',
            ],
            encodeOffsets: [[120237, 41215]],
          },
          properties: {
            cp: [117.190182, 39.125596],
            name: '天津',
            childNum: 1,
          },
        },
        {
          id: '310000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@ɧư¬EpƸÁxc'],
              ['@@©ª'],
              ['@@MA'],
              ['@@QpİE§ÉC¾'],
              ['@@bŝÕÕEȣÚƥêImɇǦèÜĠÚÃƌÃ͎ó'],
              ['@@ǜûȬɋŭ×^sYɍDŋŽąñCG²«ªč@h_p¯A{oloY¬j@Ĳ`gQÚhr|ǀ^MĲvtbe´R¯Ô¬¨Yô¤r]ìƬį'],
            ],
            encodeOffsets: [
              [[124702, 32062]],
              [[124547, 32200]],
              [[124808, 31991]],
              [[124726, 32110]],
              [[124903, 32376]],
              [[124438, 32149]],
            ],
          },
          properties: {
            cp: [121.472644, 31.231706],
            name: '上海',
            childNum: 6,
          },
        },
        {
          id: '500000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                '@@vjG~nGŘŬĶȂƀƾ¹¸ØÎezĆT¸}êÐqHðqĖä¥^CÆIj²p\\_ æüY|[YxƊæu°xb®Űb@~¢NQt°¶Sæ Ê~rǉĔëĚ¢~uf`faĔJåĊnÖ]jƎćÊ@£¾a®£Ű{ŶĕFègLk{Y|¡ĜWƔtƬJÑxq±ĢN´òKLÈÃ¼D|s`ŋć]Ã`đMûƱ½~Y°ħ`ƏíW½eI½{aOIrÏ¡ĕŇapµÜƅġ^ÖÛbÙŽŏml½SêqDu[RãË»ÿw`»y¸_ĺę}÷`M¯ċfCVµqŉ÷Zgg`d½pDOÎCn^uf²ènh¼WtƏxRGg¦pVFI±G^Ic´ecGĹÞ½sëĬhxW}KÓe­XsbkF¦LØgTkïƵNï¶}Gyw\\oñ¡nmĈzj@Óc£»Wă¹Ój_m»¹·~MvÛaq»­ê\\ÂoVnÓØÍ²«bq¿efE Ĝ^Q~ Évýş¤²ĮpEİ}zcĺL½¿gÅ¡ýE¡ya£³t\\¨\\vú»¼§·Ñr_oÒý¥u_n»_At©ÞÅ±ā§IVeëY}{VPÀFA¨ąB}q@|Ou\\FmQFÝMwå}]|FmÏCawu_p¯sfÙgYDHl`{QEfNysB¦zG¸rHeN\\CvEsÐùÜ_·ÖĉsaQ¯}_UxÃđqNH¬Äd^ÝŰR¬ã°wećJE·vÝ·HgéFXjÉê`|ypxkAwWĐpb¥eOsmzwqChóUQl¥F^lafanòsrEvfQdÁUVfÎvÜ^eftET¬ôA\\¢sJnQTjPØxøK|nBzĞ»LYFDxÓvr[ehľvN¢o¾NiÂxGpâ¬zbfZo~hGi]öF||NbtOMn eA±tPTLjpYQ|SHYĀxinzDJÌg¢và¥Pg_ÇzIIII£®S¬ØsÎ¼£N',
              ],
              ['@@ifjN@s'],
            ],
            encodeOffsets: [[[109628, 30765]], [[111725, 31320]]],
          },
          properties: {
            cp: [106.504962, 29.533155],
            name: '重庆',
            childNum: 2,
          },
        },
        {
          id: '810000',
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              ['@@AlBk'],
              ['@@mn'],
              ['@@EpFo'],
              ['@@ea¢pl¸Eõ¹hj[]ÔCÎ@lj¡uBX´AI¹[yDU]W`çwZkmcMpÅv}IoJlcafŃK°ä¬XJmÐ đhI®æÔtSHnEÒrÈc'],
              ['@@rMUwAS®e'],
            ],
            encodeOffsets: [
              [[117111, 23002]],
              [[117072, 22876]],
              [[117045, 22887]],
              [[116975, 23082]],
              [[116882, 22747]],
            ],
          },
          properties: {
            cp: [114.173355, 22.320048],
            name: '香港',
            childNum: 5,
          },
        },
        {
          id: '820000',
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates: ['@@kÊd°å§s'],
            encodeOffsets: [[116279, 22639]],
          },
          properties: {
            cp: [113.54909, 22.198951],
            name: '澳门',
            childNum: 1,
          },
        },
      ],
      UTF8Encoding: true,
    });
  }

  render() {
    const name = this.props.history.location.query.orgName;
    const dataForNow = data[name];
    if (!dataForNow) {
      return null;
    }
    // console.log(this);
    const groupColumns = [
      {
        title: '险种',
        dataIndex: 'insuranceType',
        key: 'insuranceType',
        className: 'column-group-info-style',
      },
      {
        title: '出险金额',
        dataIndex: 'fee',
        key: 'fee',
        // align: 'right',
        className: 'column-group-info-style',
      },
      // {
      //   title: '保险金额',
      //   dataIndex: 'insuranceAmount',
      //   key: 'insuranceAmount',
      //   align: 'right',
      //   className: 'column-group-info-style',
      // },
      // {
      //   title: '投保人数',
      //   dataIndex: 'insuredCount',
      //   key: 'insuredCount',
      //   className: 'column-group-info-style',
      // },
      {
        title: '出险人数',
        dataIndex: 'insuredClaimed',
        key: 'insuredClaimed',
        className: 'column-group-info-style',
      },
      {
        title: '出险案件',
        dataIndex: 'insuredCases',
        key: 'insuredCases',
        className: 'column-group-info-style',
      },
      // {
      //   title: '赔付金额',
      //   dataIndex: 'claimPay',
      //   key: 'claimPay',
      //   align: 'right',
      //   className: 'column-group-info-style',
      // },
    ];

    const geo = _.cloneDeep(geoConfig);
    let min = -1;
    let max = -1;
    if(dataForNow.geo)
    geo.series[0].data = geo.series[0].data.map(d => {
      min = dataForNow.geo[d.name] < min || min < 0 ? dataForNow.geo[d.name] : min;
      max = dataForNow.geo[d.name] > max ? dataForNow.geo[d.name] : max;
      return {
        name: d.name,
        value: dataForNow.geo[d.name],
        tipData: [dataForNow.geo[d.name], dataForNow.geo[d.name]],
      };
    });
    geo.visualMap.min = min;
    geo.visualMap.max = max;

    const top5hosp = _.cloneDeep(top5hospOri);

    top5hosp.yAxis[0].data = dataForNow.top5hosp.label.reverse();
    top5hosp.series[0].data = dataForNow.top5hosp.data.reverse();

    const top5hosp2 = _.cloneDeep(top5hospOri);

    top5hosp2.yAxis[0].data = dataForNow.top5hosp2.label.reverse();
    top5hosp2.series[0].data = dataForNow.top5hosp2.data.reverse();

    const pf1 = _.cloneDeep(pf1ori);
    pf1.xAxis.data = dataForNow.pf1.label;
    pf1.series[0].data = dataForNow.pf1.data[0];
    pf1.series[1].data = dataForNow.pf1.data[1];

    const pf2 = _.cloneDeep(pf1ori);
    pf2.xAxis.data = dataForNow.pf2.label;
    pf2.series[0].data = dataForNow.pf2.data[0];
    pf2.series[1].data = dataForNow.pf2.data[1];
    pf2.title.text = '住院';

    const sexR = _.cloneDeep(sexROri);

    sexR.series = [
      {
        type: 'bar',
        stack: '性别比例',
        barWidth: 10,
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: () => dataForNow.sexRatio[0] + '%',
            distance: 25,
          },
        },
        data: [
          {
            name: '女',
            value: dataForNow.sexRatio[0],
          },
        ],
      },
      {
        type: 'bar',
        stack: '性别比例',
        barWidth: 10,
        label: {
          normal: {
            show: true,
            position: 'top',
            formatter: () => dataForNow.sexRatio[1] + '%',
            distance: 25,
          },
        },
        data: [
          {
            name: '男',
            value: dataForNow.sexRatio[1],
          },
        ],
      },
    ];

    const insDist = _.cloneDeep(insDistOri);

    insDist.series[0].data = insDist.series[0].data.map((d, index) => {
      return {
        ...d,
        value: dataForNow.insDist[index],
      };
    });

    // insDistOri tags2Ori

    const pfc1 = _.cloneDeep(pf1ori);
    pfc1.xAxis.data = dataForNow.pfc1.label;
    pfc1.series[0].data = dataForNow.pfc1.data[0];
    pfc1.series[1].data = dataForNow.pfc1.data[1];
    pfc1.yAxis.name = '次数';
    const pfc2 = _.cloneDeep(pf1ori);
    pfc2.xAxis.data = dataForNow.pfc2.label;
    pfc2.series[0].data = dataForNow.pfc2.data[0];
    pfc2.series[1].data = dataForNow.pfc2.data[1];
    pfc2.title.text = '住院';
    pfc2.yAxis.name = '次数';
    const t1 = Object.keys(dataForNow.t1).map(key => {
      return {
        name: key,
        value: dataForNow.t1[key],
        type: 2,
      };
    });

    const t2 = Object.keys(dataForNow.t2).map(key => {
      return {
        name: key,
        value: dataForNow.t2[key],
        type: 2,
      };
    });

    const top1 = _.cloneDeep(top5hospOri);
    top1.yAxis[0].data = Object.keys(dataForNow.top1).reverse();
    top1.series[0].data = Object.values(dataForNow.top1).reverse();
    top1.title.text = '就诊次数前10员工';
    const top2 = _.cloneDeep(top5hospOri);
    top2.yAxis[0].data = Object.keys(dataForNow.top2).reverse();
    top2.series[0].data = Object.values(dataForNow.top2).reverse();
    top2.title.text = '赔付金额前10员工';

    return (
      <div className={styles.fullboard}>
        <GroupHeader name={name} timeRange={dataForNow.timeRange} />
        <div className={styles.title}>一 团体总览</div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardimg}>
              <img src={zbf} style={{height:60}} alt="" />
            </div>
            <div className={styles.cardtitle}>出险金额</div>
            <div className={styles.cardValue}>
              <span>{dataForNow.zbf}</span>
              <span className={styles.unit}>元</span>
            </div>
          </div>
          {/* <div className={styles.card}>
            <div className={styles.cardimg}>
              <img src={cbrs} alt="" />
            </div>
            <div className={styles.cardtitle}>承保人数</div>
            <div className={styles.cardValue}>
              <span>{dataForNow.cbrs}</span>
              <span className={styles.unit}>人</span>
            </div>
          </div> */}
          {/* <div className={styles.card}>
            <div className={styles.cardimg}>
              <img src={bdrs} style={{height:60}} alt="" />
            </div>
            <div className={styles.cardtitle}>保单人数</div>
            <div className={styles.cardValue}>
              <span>{dataForNow.bdrs}</span>
              <span className={styles.unit}>人</span>
            </div>
          </div> */}
          <div className={styles.card}>
            <div className={styles.cardimg}>
              <img src={cxaj} style={{height:60}} alt="" />
            </div>
            <div className={styles.cardtitle}>出险案件</div>
            <div className={styles.cardValue}>
              <span>{dataForNow.cxaj}</span>
              <span className={styles.unit}>件</span>
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.cardimg}>
              <img src={cxrs} alt="" />
            </div>
            <div className={styles.cardtitle}>出险人数</div>
            <div className={styles.cardValue}>
              <span>{dataForNow.cxrs}</span>
              <span className={styles.unit}>人</span>
            </div>
          </div>
        </div>
        <div className={styles.table}>
          <Table
            dataSource={dataForNow.insuranceList}
            columns={groupColumns}
            pagination={false}
            rowKey="id"
          />
        </div>
        <br />
        <div className={styles.title}>二 出险及赔付</div>
        <div className={styles.fullchart}>
          <Echarts option={claimPayConfig} notMerge />
        </div>
        <div className={styles.halffullchart}>
          <div className={styles.halfchart}>
            <Echarts option={top5hosp} notMerge />
          </div>
          <div className={styles.halfchart}>
            <Echarts option={top5hosp2} notMerge />
          </div>
          {/* <div className={styles.halfchart}>
            <Echarts option={geo} notMerge />
          </div> */}
        </div>
        <div>
          <div className={styles.charttitle}>出险分布统计图</div>
          <div className={styles.unionfullchart}>
            <div className={styles.halfchart}>
              <Echarts option={pf1} notMerge />
            </div>
            <div className={styles.halfchart}>
              <Echarts option={pf2} notMerge />
            </div>
          </div>
        </div>

        <div className={styles.title}>三 出险人画像</div>
        <div className={styles.fullchart} style={{ margin: 0, height: 300, marginBottom: 10 }}>
          <div>
            <div className={styles.halffullchart} style={{ height: 300 }}>
              <div className={styles.halfchart}>
                <div className={styles.cardtitle}>男女比例分布</div>
                <div className={styles.flexlayout}>
                  <div className={styles.chartimg}>
                    <img src={female} alt="" />
                  </div>
                  <div className={styles.cardratio}>
                    <Echarts option={sexR} notMerge />
                  </div>
                  <div className={styles.chartimg}>
                    <img src={male} alt="" />
                  </div>
                </div>
              </div>
              <div className={styles.halfchart} style={{ height: 300 }}>
                <div className={styles.cardtitle}>出险类型分布</div>
                <Echarts option={insDist} notMerge />
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className={styles.charttitle}>男女各年龄段出险次数分布</div>
          <div className={styles.unionfullchart}>
            <div className={styles.halfchart}>
              <Echarts option={pfc1} notMerge />
            </div>
            <div className={styles.halfchart}>
              <Echarts option={pfc2} notMerge />
            </div>
          </div>
        </div>
        <div>
          <div className={styles.charttitle}>就诊疾病次数前10统计分析</div>
          <div className={styles.unionfullchart} style={{ height: 260 }}>
            <div
              className={styles.halfchart}
              style={{ height: 260, background: 'rgba(240, 242, 244, 0.38)' }}
            >
              <div className={styles.chartTag}>门诊</div>
              <TagCloud data={t1} height={280} />
            </div>
            <div
              className={styles.halfchart}
              style={{ height: 260, background: 'rgba(240, 242, 244, 0.38)' }}
            >
              <div className={styles.chartTag}>住院</div>
              <TagCloud data={t2} height={280} />
            </div>
          </div>
        </div>
        <div className={styles.halffullchart} style={{ marginBottom: 20 }}>
          <div className={styles.halfchart}>
            <Echarts option={top1} notMerge />
          </div>
          <div className={styles.halfchart}>
            <Echarts option={top2} notMerge />
          </div>
        </div>
      </div>
    );
  }
}

export default GroupIndex;
