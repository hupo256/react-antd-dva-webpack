
export default function feePie(a,b,c,d){
  const total = a+b+c+d;
  const unit = value => (value / 10000 >= 1 ? `${(value / 100).toFixed(2) / 100}W` : `${value}件`)
  const content = {
    '无风险':`${unit(a)}          ${(a/total*100).toFixed(1)}%`,
    '高风险':`${unit(b)}          ${(b/total*100).toFixed(1)}%`,
    '中风险':`${unit(c)}          ${(c/total*100).toFixed(1)}%`,
    '低风险':`${unit(d)}          ${(d/total*100).toFixed(1)}%`,
  }
  return({
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    right:'5%',
    top: '15%',
    data:[
      {icon:"circle",name:'无风险'},
      {icon:"circle",name:'高风险'},
      {icon:"circle",name:'中风险'},
      {icon:"circle",name:'低风险'}
    ],
    itemHeight: 8,
    itemGap: 10,
    selectedMode:false,
    formatter: (name) => `${name}          ${content[name]}`,
    textStyle: {
      fontSize: 12
    }
  },
  color: ['#D6DBE2','#DE3E12','#FF9600','#FFDF3C'],
  series: [
    {
        name:'各金额占比',
        type:'pie',
        animation: false,
        radius: ['35%', '55%'],
        center: ['20%', '45%'],
        avoidLabelOverlap: false,
        label: {
            normal: {
                show: false,
                position: 'center'
            },
            emphasis: {
                show: false,
            },
        },
        labelLine: {
            normal: {
                show: false
            }
        },
        data:[
            {value:a, name:'无风险'},
            {value:b, name:'高风险'},
            {value:c, name:'中风险'},
            {value:d, name:'低风险'},
        ]
    }
  ]
})
}
