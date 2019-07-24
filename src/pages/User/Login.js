import React, { Component } from 'react';
import { connect } from 'dva';
// import { FormattedMessage } from 'umi/locale';
import { Alert, notification, Icon } from 'antd';
// import { routerRedux } from 'dva/router';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {

  componentWillReceiveProps(nextProps) {
    const { dispatch, history } = this.props;
    // console.log(nextProps.login);
    if (nextProps.login.success === '成功') {
      document.cookie = `access-token=${escape(nextProps.login.token)}; expires=${20000}`;
      history.push("/");
    } else if (nextProps.login.success !== undefined){
      notification.open({
        message: '对不起, 登录失败',
        description: '请检查您的登录名或密码',
        icon: <Icon type="close-cycle" style={{ color: 'red' }} />,
      });
      dispatch({
        type: 'login/changeLoginStatus',
        payload: {
          success: undefined,
        },
      });
    }
  }

  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <UserName
            name="username"
            // placeholder={`${formatMessage({ id: 'app.login.userName' })}: admin or user`}
            rules={[
              {
                required: true,
                 message: '请输入用户名',
              },
            ]}
          />
          <Password
            name="password"
            // placeholder={`${formatMessage({ id: 'app.login.password' })}: ant.design`}
            rules={[
              {
                required: true,
                message: '请输入密码',
              },
            ]}
            onPressEnter={e => {
              e.preventDefault();
              this.loginForm.validateFields(this.handleSubmit);
            }}
          />
          <Submit loading={submitting}>
            登录
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
