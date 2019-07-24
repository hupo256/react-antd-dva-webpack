
export default function regionPie(a,b,c){
  const total = a+b+c;
  const content = {
    '疾病型出险':`${(a/total*100).toFixed(1)}%`,
    '意外型出险':`${(b/total*100).toFixed(1)}%`,
    '其他出险':`${(c/total*100).toFixed(1)}%`
  }
  return({
  tooltip: {
    trigger: 'item',
    formatter: "{a} <br/>{b}: {c} ({d}%)"
  },
  color: ['#4291EB','#5FD9D1','#FFDF3C'],
  legend: {
    orient: 'horizontal',
    left:'center',
    bottom: '0%',
    data:[
      {icon:"circle",name:'疾病型出险'},
      {icon:"circle",name:'意外型出险'},
      {icon:"circle",name:'其他出险'},
    ],
    itemHeight: 8,
    itemGap: 16,
    selectedMode:false,
    textStyle: {
      fontSize: 12
    }
  },
  graphic:[{
    type:'text',
    left:'center',
    top:'32%',
    style:{
        text:'11111W',
        textAlign:'center',
        fill:'#54565A',
        fontSize:24,
        fontWeight: 500
    }
  },{
    type:'text',
    left:'center',
    top:'45%',
    style:{
        text:'总风险金额',
        textAlign:'center',
        fill:'#4A4A4A',
        fontSize:10,
    }
  }],
  series: [
    {
        name:'省辖区各市级分支机构风险金额占比',
        type:'pie',
        animation: false,
        radius: ['48%', '65%'],
        center: ['50%', '40%'],
        avoidLabelOverlap: false,
        label: {
          normal: {
              textStyle: {
                  color: '#4A4A4A'
              },
              formatter: '{b}: {d}%',
          }
        },
        labelLine: {
            normal: {
                smooth: 0.2,
                length: 10,
                length2: 20
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
