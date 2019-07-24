/* eslint-disable camelcase */
import React, { Component } from 'react';
import { Input, Checkbox } from 'antd';

export default class RangeInputFix extends Component {
  static getDerivedStateFromProps(nextProps) {
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);

    const value = props.value || {};
    this.state = {
      start_value: value.start_value || 0,
      end_value: value.end_value || 0,
    };
  }

  handleNumberStartChange = e => {
    const start_value = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(start_value)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ start_value });
    }
    this.triggerChange({ start_value });
  };

  handleNumberEndChange = e => {
    const end_value = parseInt(e.target.value || 0, 10);
    if (Number.isNaN(end_value)) {
      return;
    }
    if (!('value' in this.props)) {
      this.setState({ end_value });
    }
    this.triggerChange({ end_value });
  };

  triggerChange = changedValue => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { start_value, end_value } = this.state;
    const { item_unit, connect_text } = this.props;
    return (
      <span>
        <Input
          type="text"
          value={start_value}
          onChange={this.handleNumberStartChange}
          style={{ width: '100px', marginRight: '3%' }}
          addonAfter={item_unit}
        />
        <span style={{ paddingRight: '3%' }}>{connect_text}</span>
        <Input
          type="text"
          value={end_value}
          onChange={this.handleNumberEndChange}
          addonAfter={item_unit}
          style={{ width: '100px', marginRight: '3%' }}
        />{' '}
        <Checkbox>含</Checkbox>
      </span>
    );
  }
}
