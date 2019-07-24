
export default function riskgauge(a){
  let title = '';
  let color = '';
  if(a>0.66){
    title='高';
    color = '#FF450D';
  }else if(a>0.33){
    title='中';
    color = '#FF9600';
  }else{
    title='低';
    color='#FFDF3C';
  }

  return({
    series: [
        {
            name: '风险等级',
            type: 'gauge',
            splitLine:{show:false},
            axisLine:{
                lineStyle:{
                    color:[[0.33,'#FFDF3C'],[0.66,'#FF9600'],[1,'#FF450D']],
                    width:6,
                }
            },
            axisTick:{show:false},
            axisLabel:{show:false},
            pointer:{
                width: 3,
                length:'50%',
            },
            itemStyle:{
                color:'#54565A'
            },
            silent:true,
            detail:{
                show:false
            },
            data: [{value: a*100, name: title}],
            title:{
                offsetCenter:[0,'100%'],
                fontSize:14,
                color
            }
        }
    ]
})
}
