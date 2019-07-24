import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form } from 'antd';
import classNames from 'classnames';
import LoginItem from './LoginItem';
import LoginTab from './LoginTab';
import LoginSubmit from './LoginSubmit';
import styles from './index.less';
import LoginContext from './loginContext';

class Login extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      active: {},
    };
  }

  getContext = () => {
    const { form } = this.props;
    return {
      form,
      updateActive: activeItem => {
        const { active } = this.state;
        if (active.account) {
          active.account.push(activeItem);
        } else {
          active.account = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  };

  handleSubmit = e => {
    e.preventDefault();
    const { active } = this.state;
    const { form, onSubmit } = this.props;
    const activeFileds = active.account;
    form.validateFields(activeFileds, { force: true }, (err, values) => {
      onSubmit(err, values);
    });
  };

  render() {
    const { className, children } = this.props;
    return (
      <LoginContext.Provider value={this.getContext()}>
        <div className={classNames(className, styles.login)}>
          <Form onSubmit={this.handleSubmit}>
            {children}
          </Form>
        </div>
      </LoginContext.Provider>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  Login[item] = LoginItem[item];
});

export default Form.create()(Login);
