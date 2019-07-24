import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/tongdongdong/aven/rc-ui/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/user",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/UserLayout'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/user",
        "redirect": "/user/login",
        "exact": true
      },
      {
        "path": "/user/login",
        "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import('/Users/tongdongdong/aven/rc-ui/src/pages/User/models/register.js').then(m => { return { namespace: 'register',...m.default}})
],
  component: () => import('../User/Login'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/tongdongdong/aven/rc-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/BasicLayout'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
    "Routes": [require('../Authorized').default],
    "authority": [
      "审核员"
    ],
    "routes": [
      {
        "path": "/",
        "redirect": "/product/insurance",
        "exact": true
      },
      {
        "path": "/riskcontrol",
        "name": "案件导入及风控",
        "icon": "code",
        "hideChildrenInMenu": true,
        "authority": [
          "审核员"
        ],
        "routes": [
          {
            "path": "/riskcontrol",
            "component": _dvaDynamic({
  
  component: () => import('../Importing/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/riskcontrol/batching",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Importing/Batching'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/riskcontrol/riskReport",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Importing/RiskReport/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/tongdongdong/aven/rc-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/product",
        "icon": "table",
        "name": "产品配置",
        "authority": [
          "审核员"
        ],
        "routes": [
          {
            "path": "/product/insurance",
            "name": "险种配置",
            "authority": [
              "审核员"
            ],
            "component": _dvaDynamic({
  
  component: () => import('../Product/Insurance/Insurance'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/insurance/update/:insId",
            "name": "险种编辑",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/Insurance/EditInsurance/EditInsurance'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/insurance/add",
            "name": "险种增加",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/Insurance/EditInsurance/EditInsurance'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/insurance/view",
            "name": "险种预览",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/Insurance/ViewInsurance/ViewInsurance'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/single",
            "name": "个单产品配置",
            "component": _dvaDynamic({
  
  component: () => import('../Product/Single/Single'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/single/add",
            "name": "个单产品新增",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/Single/EditSingle/EditSingle'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/single/update/:singleCode",
            "name": "个单产品编辑",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/Single/EditSingle/EditSingle'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/group",
            "name": "团单配置",
            "component": _dvaDynamic({
  
  component: () => import('../Product/Group/Group'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/group/add",
            "name": "团单新增",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/Group/EditGroup/EditGroup'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/group/update/:policyId",
            "name": "团单编辑",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/Group/EditGroup/EditGroup'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/fields",
            "name": "自定义字段",
            "component": _dvaDynamic({
  
  component: () => import('../Product/CustomField/FieldList'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/fields/update/:itemId",
            "name": "自定义字段编辑",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/CustomField/EditField/EditField'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/fields/add",
            "name": "添加义字段编辑",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../Product/CustomField/EditField/EditField'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/groupreport",
            "name": "团体报告",
            "component": _dvaDynamic({
  
  component: () => import('../GroupReport/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/product/groupinfo",
            "name": "团体信息",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../GroupInfo/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/tongdongdong/aven/rc-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/scenario",
        "icon": "dashboard",
        "name": "风险场景配置",
        "authority": [
          "审核员"
        ],
        "routes": [
          {
            "path": "/scenario/insurance/import",
            "name": "险种责任录入",
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/insurance/defining",
            "name": "风险场景定义",
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/insurance/matching",
            "name": "风险场景匹配",
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/insurancegroup",
            "name": "团单风控模型配置",
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/singleinsurance",
            "name": "个单风控模型配置",
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/index'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/insurance/detail",
            "name": "导入配置",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/Duty/Settings'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/insurance/setting",
            "name": "险种配置",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/Policy/Settings'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/insurancegroup/setting",
            "name": "团单配置",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/Group/GroupSettings'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/singleinsurance/setting",
            "name": "个单配置",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/Single/SingleSettings'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/scenario/scenegroup/setting",
            "name": "风险场景配置",
            "hideInMenu": true,
            "component": _dvaDynamic({
  
  component: () => import('../RiskModel/Defining/Settings'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/tongdongdong/aven/rc-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": _dvaDynamic({
  
  component: () => import('../404'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/tongdongdong/aven/rc-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "path": "/new",
    "component": _dvaDynamic({
  
  component: () => import('../../layouts/NewLayout'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/pro",
        "redirect": "/pro/list",
        "exact": true
      },
      {
        "path": "/pro/list",
        "name": "新布局",
        "component": _dvaDynamic({
  
  component: () => import('../TestNewPage/NewPage'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": _dvaDynamic({
  
  component: () => import('../404'),
  LoadingComponent: require('/Users/tongdongdong/aven/rc-ui/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/tongdongdong/aven/rc-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/tongdongdong/aven/rc-ui/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
