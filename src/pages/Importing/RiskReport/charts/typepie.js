
export default function typePie(a,b,c){
  const total = a+b+c;
  const unit = value => (value / 10000 >= 1 ? `${(value / 100).toFixed(2) / 100}W` : `${value}件`)
  const content = {
    '疾病型出险':`${unit(a)}          ${(a/total*100).toFixed(1)}%`,
    '意外型出险':`${unit(b)}          ${(b/total*100).toFixed(1)}%`,
    '其他出险':`   ${unit(c)}          ${(c/total*100).toFixed(1)}%`,
  }
  return({
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  legend: {
    orient: 'vertical',
    right:'5%',
    top: '18%',
    data:[
      {icon:"circle",name:'疾病型出险'},
      {icon:"circle",name:'意外型出险'},
      {icon:"circle",name:'其他出险'},
    ],
    itemHeight: 8,
    itemGap: 16,
    selectedMode:false,
    formatter: (name) => `${name}          ${content[name]}`,
    textStyle: {
      fontSize: 12
    }
  },
  color: ['#4291EB','#5FD9D1','#FFDF3C'],
  series: [
    {
        name:'各类型占比',
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
            {value:a, name:'疾病型出险'},
            {value:b, name:'意外型出险'},
            {value:c, name:'其他出险'},
        ]
    }
  ]
})
}
