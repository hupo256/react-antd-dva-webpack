import React, { Component } from 'react';
import { Button } from 'antd';
import styles from './index.less';

class FuncButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      solid: false,
      warning: false,
      text: '',
    };
  }

  componentDidMount() {
    const { text, onClick, disabled, solid, warning } = this.props;
    this.setState({ text, onClick, disabled, solid, warning });
  }

  componentWillReceiveProps(nextProps) {
    const { disabled, solid, warning } = this.state;
    if (
      nextProps.disabled !== disabled ||
      nextProps.warning !== warning ||
      nextProps.solid !== solid
    ) {
      this.setState({
        disabled: nextProps.disabled,
        warning: nextProps.warning,
        solid: nextProps.solid,
      });
    }
  }

  render() {
    const { disabled, solid, warning, text, onClick } = this.state;
    let code = 0;
    if (disabled) {
      if (solid) {
        code = 0;
      } else if (warning) {
        code = 1;
      } else {
        code = 2;
      }
    } else if (solid) {
      code = 3;
    } else if (warning) {
      code = 4;
    } else {
      code = 5;
    }
    const style = [
      styles.disabledpriBtn,
      styles.disabledDelBtn,
      styles.disabledBtn,
      styles.priBtn,
      styles.delBtn,
      styles.subBtn,
    ];
    return (
      <Button className={style[code]} onClick={disabled ? false : onClick}>
        {text}
      </Button>
    );
  }
}

export default FuncButton;
