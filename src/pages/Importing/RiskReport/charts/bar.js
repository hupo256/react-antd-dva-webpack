import info from './info.svg'

export default function bar(names, values){

  return {
    color: ['#6DB2F7'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    grid: {
      left: '10%',
      right: '10%',
      bottom: '5%',
      top: '5%',
      containLabel: true,
      backgroundColor: 'rgba(240, 242, 244, 0.38)',
    },
    yAxis: [
      {
        type: 'category',
        data: names,
        triggerEvent: true,
        axisTick: {
          show: false,
          alignWithLabel: true,
        },
        axisLabel: {
          show: true,
          textStyle: {
            color: '#54565A',
            fontSize: 14,
          },
          formatter:(value)=>`${value} {bg|}`,
          rich:{
            bg:{
              height: 13,
              align: 'right',
              backgroundColor: {
                image: info
              }
            }
          }
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
            color: '#54565A',
            fontSize: 14,
          },
          formatter: value => (value / 10000 >= 1 ? `${(value / 100).toFixed(2) / 100}W` : value),
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
        data: values,
      },
    ],
  };
}
