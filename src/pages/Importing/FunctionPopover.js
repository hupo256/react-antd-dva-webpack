import React, { Component } from 'react';
import { Modal, Icon, Button } from 'antd';

const reminder = {
  hint: '当前系统中并未做相关产品配置，继续跑风控将使用通用场景参数，是否继续？',
  warning: '正在创建案件批次，取消后，所有数据将不被保存且无法恢复，确认取消创建？',
  deleting: '删除此文件后将无法恢复，确认删除？',
  delall: '删除后，所选批次中的案件及风控报告将被一并删除，无法恢复，确认删除？',
};

const btn1 = {
  hint: '关闭',
  warning: '继续创建',
  deleting: '取消',
  delall: '取消',
};

const btn2 = {
  hint: '继续风控',
  warning: '取消创建',
  deleting: '删除',
  delall: '删除',
};

const title = {
  hint: '提示',
  warning: '提示',
  deleting: '删除',
  delall: '删除',
};

const icon = {
  hint: <Icon type="info-circle" style={{ color: '#4291EB', fontSize: 28, margin: 6 }} />,
  warning: <Icon type="warning" style={{ color: 'rgb(241, 194, 22)', fontSize: 28, margin: 6 }} />,
  deleting: <Icon type="warning" style={{ color: '#EB3850', fontSize: 28, margin: 6 }} />,
  delall: <Icon type="warning" style={{ color: '#EB3850', fontSize: 28, margin: 6 }} />,
};

class FuncPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    const { type, onOk, onCancel, visible } = this.props;
    this.setState({ type, onOk, onCancel, visible });
  }

  componentWillReceiveProps(nextProps) {
    const { type, onOk, onCancel, visible } = this.state;
    if (
      nextProps.type !== type ||
      nextProps.onCancel !== onCancel ||
      nextProps.onOk !== onOk ||
      nextProps.visible !== visible
    ) {
      this.setState({
        type: nextProps.type,
        onOk: nextProps.onOk,
        onCancel: nextProps.onCancel,
        visible: nextProps.visible,
      });
    }
  }

  render() {
    const { type, onOk, onCancel, visible } = this.state;
    return (
      <Modal
        title={
          <div style={{ fontSize: 18 }}>
            {icon[type]}
            {title[type]}
          </div>
        }
        wrapClassName="newBatchModal"
        visible={visible}
        width={450}
        onCancel={() => onCancel()}
        footer={
          <div>
            <Button
              style={{
                width: 100,
                background: 'white',
                border: '1px solid #4291EB',
                color: '#4291EB',
              }}
              onClick={() => onCancel()}
            >
              {btn1[type]}
            </Button>
            <Button
              style={{
                width: 100,
                background: 'white',
                border: '1px solid #4291EB',
                color: '#4291EB',
              }}
              onClick={() => onOk()}
            >
              {btn2[type]}
            </Button>
          </div>
        }
      >
        {reminder[type]}
      </Modal>
    );
  }
}

export default FuncPopover;
