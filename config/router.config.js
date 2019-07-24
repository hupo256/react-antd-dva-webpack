export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
      // { path: '/user/register', component: './User/Register' },
      // { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },

  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['审核员'],
    routes: [
      { path: '/', redirect: '/product/insurance' },
      {
        path: '/riskcontrol',
        name: '案件导入及风控',
        icon: 'code',
        hideChildrenInMenu: true,
        authority: ['审核员'],
        routes: [
          {
            path: '/riskcontrol',
            component: './Importing/index',
          },
          {
            path: '/riskcontrol/batching',
            hideInMenu: true,
            component: './Importing/Batching',
          },
          {
            path: '/riskcontrol/riskReport',
            hideInMenu: true,
            component: './Importing/RiskReport/index',
          },
        ],
      },
      // product
      {
        path: '/product',
        icon: 'table',
        name: '产品配置',
        authority: ['审核员'],
        routes: [
          {
            path: '/product/insurance',
            name: '险种配置',
            authority: ['审核员'],
            component: './Product/Insurance/Insurance',
          },
          {
            path: '/product/insurance/update/:insId',
            name: '险种编辑',
            hideInMenu: true,
            component: './Product/Insurance/EditInsurance/EditInsurance',
          },
          {
            path: '/product/insurance/add',
            name: '险种增加',
            hideInMenu: true,
            component: './Product/Insurance/EditInsurance/EditInsurance',
          },
          {
            path: '/product/insurance/view',
            name: '险种预览',
            hideInMenu: true,
            component: './Product/Insurance/ViewInsurance/ViewInsurance',
          },
          {
            path: '/product/single',
            name: '个单产品配置',
            component: './Product/Single/Single',
          },
          {
            path: '/product/single/add',
            name: '个单产品新增',
            hideInMenu: true,
            component: './Product/Single/EditSingle/EditSingle',
          },
          {
            path: '/product/single/update/:singleCode',
            name: '个单产品编辑',
            hideInMenu: true,
            component: './Product/Single/EditSingle/EditSingle',
          },
          {
            path: '/product/group',
            name: '团单配置',
            component: './Product/Group/Group',
          },
          {
            path: '/product/group/add',
            name: '团单新增',
            hideInMenu: true,
            component: './Product/Group/EditGroup/EditGroup',
          },
          {
            path: '/product/group/update/:policyId',
            name: '团单编辑',
            hideInMenu: true,
            component: './Product/Group/EditGroup/EditGroup',
          },
          {
            path: '/product/fields',
            name: '自定义字段',
            component: './Product/CustomField/FieldList',
          },
          {
            path: '/product/fields/update/:itemId',
            name: '自定义字段编辑',
            hideInMenu: true,
            component: './Product/CustomField/EditField/EditField',
          },
          {
            path: '/product/fields/add',
            name: '添加义字段编辑',
            hideInMenu: true,
            component: './Product/CustomField/EditField/EditField',
          },
          {
            path: '/product/groupreport',
            name: '团体报告',
            component: './GroupReport/index',
          },
          {
            path: '/product/groupinfo',
            name: '团体信息',
            hideInMenu: true,
            // hideChildrenInMenu: true,
            component: './GroupInfo/index',
          },
        ],
      },
      {
        path: '/scenario',
        icon: 'dashboard',
        name: '风险场景配置',
        authority: ['审核员'],
        routes: [
          {
            path: '/scenario/insurance/import',
            name: '险种责任录入',
            component: './RiskModel/index',
          },
          {
            path: '/scenario/insurance/defining',
            name: '风险场景定义',
            component: './RiskModel/index',
          },
          {
            path: '/scenario/insurance/matching',
            name: '风险场景匹配',
            component: './RiskModel/index',
          },
          {
            path: '/scenario/insurancegroup',
            name: '团单风控模型配置',
            component: './RiskModel/index',
          },
          {
            path: '/scenario/singleinsurance',
            name: '个单风控模型配置',
            component: './RiskModel/index',
          },
          {
            path: '/scenario/insurance/detail',
            name: '导入配置',
            hideInMenu: true,
            component: './RiskModel/Duty/Settings',
          },
          {
            path: '/scenario/insurance/setting',
            name: '险种配置',
            hideInMenu: true,
            component: './RiskModel/Policy/Settings',
          },
          {
            path: '/scenario/insurancegroup/setting',
            name: '团单配置',
            hideInMenu: true,
            component: './RiskModel/Group/GroupSettings',
          },
          {
            path: '/scenario/singleinsurance/setting',
            name: '个单配置',
            hideInMenu: true,
            component: './RiskModel/Single/SingleSettings',
          },
          {
            path: '/scenario/scenegroup/setting',
            name: '风险场景配置',
            hideInMenu: true,
            component: './RiskModel/Defining/Settings',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
  // new
  {
    path: '/new',
    component: '../layouts/NewLayout',
    routes: [
      {
        path: '/pro',
        redirect: '/pro/list',
      },
      {
        path: '/pro/list',
        name: '新布局',
        component: './TestNewPage/NewPage',
      },
      {
        component: '404',
      },
    ],
  },
];
