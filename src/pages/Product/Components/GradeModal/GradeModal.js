/* eslint-disable jsx-a11y/label-has-for,react/no-unused-state,max-len,prefer-destructuring,react/destructuring-assignment */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Modal, Row, InputNumber} from 'antd';
import styles from '../../product.less';

const FormItem = Form.Item;
const TextArea = Input.TextArea;

@Form.create()
@connect(({ product, loading }) => ({
  product,
  loading: loading.models.product,
}))
class GradeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  handleCancel = () => {
    this.props.handleCancel();
  };

  handleSaveGrade = () => {
    this.props.handleSaveGrade();
  };

  handleEditGrade = groupLevelItemIndex => {
    this.props.handleEditGrade(groupLevelItemIndex);
  };

  handleDeleteGrade = groupLevelItemIndex => {
    this.props.handleDeleteGrade(groupLevelItemIndex);
  };

  inpValidator = (rule, value, callback, name, index) => {
    if (!value) callback();
    const { groupLevels } = this.props;
    console.log(groupLevels);
    console.log(index);
    const cname = name === 'group_level_name' ? '层级名称' : '层级代码'
    // const levelNames = groupLevels.filter(level => (level[name] === value));
    // const levelNames = groupLevels.filter((level, ind) => (level[name] === value && ind !== index));
    groupLevels.forEach((level, ind) => {
      if (level[name] === value && ind !== index) {
        callback(`${cname}已存在，请勿重复`);
      }
    });

    // if (levelNames.length > 0) {
    //   callback(`${cname}已存在，请勿重复`);
    // }
    callback();
  }

  render() {
    const {
      isShowGradeModal,
      modalTitle,
      isAddGrade,
      groupLevelItem,
      groupLevelItemIndex,
    } = this.props;

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    return (
      <div>
        <Modal
          title={modalTitle}
          visible={isShowGradeModal}
          width={800}
          maskClosable={false}
          onCancel={this.handleCancel}
          footer={
            isAddGrade
              ? [
                <Button
                  className={styles.cusModalButton}
                  key={Math.random()}
                  onClick={this.handleSaveGrade}
                >
                    保存
                </Button>,
                ]
              : [
                <Button
                  className={styles.cusModalButton}
                  key={Math.random()}
                  onClick={() => this.handleDeleteGrade(groupLevelItemIndex)}
                >
                    删除
                </Button>,
                <Button
                  className={styles.cusModalButton}
                  key={Math.random()}
                  onClick={() => this.handleEditGrade(groupLevelItemIndex)}
                >
                    保存
                </Button>,
                ]
          }
        >
          <div className={styles.cusModalBody}>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="层级名称">
                  {getFieldDecorator('group_level_name', {
                    initialValue: groupLevelItem.group_level_name || '',
                    rules: [{
                      required: true,
                      message: '请输入层级名称',
                    }, {
                      validator: (rule, value, callback) => this.inpValidator(rule, value, callback, 'group_level_name', groupLevelItemIndex)
                    }],
                  })(<Input placeholder="输入层级名称" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="层级代码">
                  {getFieldDecorator('group_level_code', {
                    initialValue: groupLevelItem.group_level_code || '',
                    rules: [{
                      required: true,
                      message: '输入层级代码',
                    }, {
                      validator: (rule, value, callback) => this.inpValidator(rule, value, callback, 'group_level_code', groupLevelItemIndex)
                    }],
                  })(<Input placeholder="输入层级代码" />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="层级限额">
                  {getFieldDecorator('limit_amount', {
                    initialValue: groupLevelItem.limit_amount || null,
                    rules: [
                      {
                        required: false,
                        message: '请输入层级限额',
                      },
                    ],
                  })(<InputNumber min={0} />)}元
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem {...formItemLayout} label="特别约定：">
                  {getFieldDecorator('special_agreement', {
                    initialValue: groupLevelItem.special_agreement || '',
                    rules: [
                      {
                        required: false,
                        message: '请输入特别约定',
                      },
                    ],
                  })(<TextArea autosize={{ minRows: 2 }} />)}
                </FormItem>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

export default GradeModal;
