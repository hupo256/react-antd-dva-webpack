const 前十名药品 = {
  "aggregations":[
    {
      "fieldName":"item_pay_sum",
      "name":"item_pay_sum",
      "type":"doubleSum"
    },
  ],
  "dimensions":["item_sub_name"],
  "dataSource":"claim_report",
  "granularity":{
    "type":"all"
  },
  "limitSpec":{
    "type": "default",
    "columns": [
        {
            "dimension": "item_pay_sum",
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
        "type": "and",
        "fields": [
          {
            type: 'regex',
            dimension: 'batch_id',
            pattern: '190613115947549'
          },
          {
            "type":"in",
            "dimension":"item_name",
            "values": ["中成药费", "中草药费", "西药费"]
          }
        ]
      }
    ]
  }
}

const 前十名疾病 = {
  "aggregations":[
    {
      "fieldName":"item_pay_sum",
      "name":"item_pay_sum",
      "type":"doubleSum"
    },
  ],
  "dimensions":["third_ill_name"],
  "dataSource":"claim_report",
  "granularity":{
    "type":"all"
  },
  "limitSpec":{
    "type": "default",
    "columns": [
        {
            "dimension": "item_pay_sum",
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
};

const 风险金额前十名机构 = {
  "aggregations":[
    {
      "type": "thetaSketch",
      "name": "claim_id",
      "fieldName": "claim_id",
      "isInputHyperUnique": false,
      "round": true
    },
    {
      "fieldName":"bill_amt_sum",
      "name":"bill_amt_sum",
      "type":"doubleSum"
    },
    {
      "fieldName":"risk_amount_sum",
      "name":"risk_amount_sum",
      "type":"doubleSum"
    },
  ],
  "dimensions":["hospital_name"],
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
}

export default { 前十名药品, 前十名疾病, 风险金额前十名机构 };
