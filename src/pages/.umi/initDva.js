import dva from 'dva';
import createLoading from 'dva-loading';

const runtimeDva = window.g_plugins.mergeConfig('dva');
let app = dva({
  history: window.g_history,
  
  ...(runtimeDva.config || {}),
});

window.g_app = app;
app.use(createLoading());
(runtimeDva.plugins || []).forEach(plugin => {
  app.use(plugin);
});

app.model({ namespace: 'company', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/company.js').default) });
app.model({ namespace: 'global', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/global.js').default) });
app.model({ namespace: 'list', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/list.js').default) });
app.model({ namespace: 'login', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/login.js').default) });
app.model({ namespace: 'model', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/model.js').default) });
app.model({ namespace: 'product', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/product.js').default) });
app.model({ namespace: 'project', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/project.js').default) });
app.model({ namespace: 'riskControl', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/riskControl.js').default) });
app.model({ namespace: 'setting', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/setting.js').default) });
app.model({ namespace: 'user', ...(require('/Users/tongdongdong/aven/rc-ui/src/models/user.js').default) });
