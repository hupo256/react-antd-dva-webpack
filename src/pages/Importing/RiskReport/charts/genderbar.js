export default function bar(){

  return {
    tooltip : {
        trigger: 'axis',
        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    yAxis:  {
        type: 'value',
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        splitLine: {
          show: false
        },
    },
    xAxis: {
        type: 'category',
        data: ['0-10','11-20','21-30','31-40','41-50','51-60','61-70','70+'],
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
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#D6DBE2',
          },
        },
    },
    color: ['#6DB2F7','#FF8F96'],
    series: [
        {
            name: '男性',
            type: 'bar',
            stack: '总量',
            data: [12,23,55,66,77,88,99,44]
        },
        {
            name: '女性',
            type: 'bar',
            stack: '总量',
            // label: {
            //     normal: {
            //         show: true,
            //         position: 'insideRight'
            //     }
            // },
            data: [12,23,55,66,77,88,99,44]
        }
    ]
  }
}
