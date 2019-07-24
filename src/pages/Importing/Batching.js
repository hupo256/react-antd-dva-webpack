import React, { Component } from 'react';
import { connect } from 'dva';
import { parse } from 'qs';
import {
  Button,
  Breadcrumb,
  Form,
  Card,
  Icon,
  Table,
  Upload,
  message,
  Progress,
  Modal,
} from 'antd';
import styles from './index.less';
import uploading from '../../assets/Riskcontrol/upload.svg';
import info from '../../assets/Riskcontrol/info.svg';
import checkcircle from '../../assets/Riskcontrol/check-circle.svg';
import errorlog from '../../assets/Riskcontrol/errorlog.svg';
import FuncButton from './FunctionBtn';
import FuncPopover from './FunctionPopover';

// const FormItem = Form.Item;
// const { Option } = Select;

const companyList = {
  '000164': '东吴人寿保险股份有限公司',
  '000005': '中国人寿保险股份有限公司',
};

const alertcontent = [
  '文件格式错误，请导入.xls或.xlsx格式的文件。',
  '导入的文件名重复，请重新命名或删除已有文件。',
];

@Form.create(state => ({
  riskControl: state.riskControl,
}))
@connect()
class RiskControlBatching extends Component {
  constructor(props) {
    super(props);
    const payload = parse(window.location.href.split('?')[1]);
    this.state = {
      initing: true,
      ondelete: false,
      onhint: false,
      oncancel: false,
      notification: false,
      running: false,
      delbatch: false,
      onalert: false,
      riskalert: false,
      fileList: [],
      companyId: payload.companyId,
      batchId: payload.batchId,
      status: payload.status,
      riskPercent: 0,
      fileError: [],
    };
  }

  componentDidMount() {
    this.getBatchList();
    const { status } = this.state;
    if (status === '4') {
      const checkRiskStatus = setInterval(this.checkRiskRunning, 1500);
      this.setState({ running: true, riskStatus: checkRiskStatus });
    }
  }

  getBatchList() {
    const { dispatch } = this.props;
    const payload = parse(window.location.href.split('?')[1]);
    dispatch({
      type: 'riskControl/getBatchDetail',
      payload: {
        companyCode: payload.companyId,
        batchId: payload.batchId,
      },
      callback: res => {
        if (res.code === '000000') {
          this.setState({
            fileList: res.data ? res.data : [],
            initing: res.data && res.data.length ? !!false : true,
          });
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  }

  checkUpload = () => {
    const { dispatch } = this.props;
    const { batchId, companyId, fileName, fileList, uploadStatus } = this.state;
    dispatch({
      type: 'riskControl/checkUpload',
      payload: { batchId, companyCode: companyId, fileName },
      callback: res => {
        if (res.code === '000000') {
          const theindex = fileList.findIndex(fe => fe.fileName === fileName);
          if (theindex > -1 && res.data) {
            console.log(res.data.progressValue);
            fileList[theindex].progressValue = res.data.progressValue;
            this.setState({ fileList });
            if (res.data.progressValue === 100) {
              clearInterval(uploadStatus);
            }
          }
        }
      },
    });
  };

  checkRiskRunning = () => {
    const { dispatch } = this.props;
    const { batchId, riskStatus } = this.state;
    dispatch({
      type: 'riskControl/checkRiskStatus',
      payload: { batchId },
      callback: res => {
        if (res.code === '000000') {
          this.setState({ riskPercent: res.data.progressValue });
          if (res.data.progressValue === 100) {
            // message.success('风控完成！');
            clearInterval(riskStatus);
          }
        }
      },
    });
  };

  uploadFile = () => {
    const { dispatch } = this.props;
    const { file, batchId, companyId } = this.state;
    const checkUploadStatus = setInterval(this.checkUpload, 500);
    this.setState({ uploadStatus: checkUploadStatus });
    dispatch({
      type: 'riskControl/upload',
      payload: {
        file,
        batchId,
        fileSize: `${file.size / 1000}kb`,
        companyCode: companyId,
      },
      callback: res => {
        const { fileError, fileList } = this.state;
        const theindex = fileList.findIndex(fe => fe.fileName === file.name);
        fileList[theindex].progressValue = 100;
        if (res.code !== '000000') {
          message.error(res.message);
          const errorMsg = res.data.secondErrorMsg;

          errorMsg.map(err =>
            fileError.push({
              fileName: file.name,
              errorType: err.errorType,
              msg: err.msg,
            })
          );
          fileList[theindex].status = 'fail';
          this.setState({ fileError, fileList });
        } else {
          this.setState({ fileList });
          this.startNotification(`所有文件导入成功，可以开始进行风控。`);
        }
      },
    });
  };

  getFiles = () => {
    const { fileList, riskPercent, status } = this.state;
    return fileList.map(file => {
      const loading =
        !(file.progressValue === 0 || file.progressValue === 100) ||
        riskPercent > 0 ||
        status === '5';
      return (
        <div className={styles.importCard}>
          <div className={styles.importSlot}>
            <div className={styles.slotTitle}>文件名称</div>
            <div className={styles.slotContent}>{file.fileName}</div>
          </div>
          <div className={styles.importSlot}>
            <div className={styles.slotTitle}>文件大小</div>
            <div className={styles.slotContent}>{file.fileSize}</div>
          </div>
          <div className={styles.importSlot} style={{ width: 200 }}>
            <div className={styles.slotTitle}>导入进度</div>
            <div style={{ width: 120, float: 'left', margin: '5px 5px 0 0' }}>
              <Progress
                percent={file.progressValue}
                style={{ float: 'left' }}
                size="small"
                showInfo={false}
                strokeColor={file.status === 'fail' ? '#EB3850' : '#39ccc7'}
              />
            </div>
            <div style={{ float: 'left' }}>{file.progressValue}%</div>
          </div>
          <Icon
            className={`${styles.closeIcon} ${loading ? '' : styles.closable}`}
            type="close-circle"
            onClick={() => {
              if (!loading) this.setState({ ondelete: true, currentItem: file });
            }}
          />
        </div>
      );
    });
  };

  deleteFile = () => {
    const { currentItem, batchId, fileError } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/deleteFile',
      payload: { batchId, fileName: currentItem.fileName },
      callback: res => {
        if (res.code === '000000') {
          message.success('删除成功！', [10]);
          this.getBatchList();
          const newErrorList =
            fileError && fileError.find(file => file.fileName !== currentItem.fileName);
          this.setState({ fileError: newErrorList });
        } else {
          message.error(res.message, [10]);
        }
        this.setState({ ondelete: false });
      },
    });
  };

  deleteBatch = () => {
    const { batchId } = this.state;
    const { dispatch, history } = this.props;
    dispatch({
      type: 'riskControl/deleteBatch',
      payload: { batchIds: [batchId] },
      callback: res => {
        if (res.code === '000000') {
          history.push('/riskcontrol');
        } else {
          message.error(res.message, [10]);
        }
      },
    });
  };

  startNotification = text => {
    this.setState({ notext: text, notification: true });
    setTimeout(() => this.setState({ notification: false }), 5000);
  };

  riskReport = () => {
    const { batchId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/checkRisk',
      payload: batchId,
      callback: res => {
        if (res.code === '000000') {
          console.log(res);
          this.runRisk();
        } else {
          this.setState({ riskalert: true });
        }
      },
    });
  };

  runRisk = () => {
    const { batchId } = this.state;
    const { dispatch } = this.props;
    let checkRiskStatus = setInterval(this.checkRiskRunning, 1500);
    this.setState({ running: true, riskStatus: checkRiskStatus });
    dispatch({
      type: 'riskControl/runRisk',
      payload: { batchId },
      callback: res => {
        if (res.code === '000000') {
          this.startNotification(`批次${batchId}即将开始风控计算…`);
          console.log(res);
        } else {
          message.error(res.message, [10]);
          clearInterval(checkRiskStatus);
          if (res.code === '005100') {
            checkRiskStatus = setInterval(this.checkRiskRunning, 1500);
            this.setState({ running: true, riskStatus: checkRiskStatus });
          }
        }
      },
    });
  };

  exportReport = () => {
    const { batchId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'riskControl/exportRisk',
      payload: { batchId },
      callback: res => {
        const url = URL.createObjectURL(res);
        const eleLink = document.createElement('a');
        eleLink.download = `批次${batchId}风控报告.xls`;
        eleLink.style.display = 'none';
        eleLink.href = url;
        document.body.appendChild(eleLink);
        eleLink.click();
        document.body.removeChild(eleLink);
      },
    });
  };

  downloadErr = () => {
    const { fileError, batchId } = this.state;
    if (fileError.length === 0) {
      message.info('无导入错误记录！', [5]);
      return;
    }
    const a = document.createElement('a');

    const download = data => {
      const file = new Blob(data, { type: 'text/plain' });
      a.href = URL.createObjectURL(file);
      a.download = `${batchId}导入错误列表.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };

    setTimeout(() => {
      const arr = [];
      fileError.map(er =>
        arr.push(`错误类别:${er.errorType},文件名称:${er.fileName},错误明细:${er.msg};`)
      );
      download(arr);
    }, 0);
  };

  render() {
    const {
      batchId,
      companyId,
      initing,
      fileList,
      fileError,
      riskPercent,
      oncancel,
      ondelete,
      onhint,
      notification,
      notext,
      status,
      running,
      delbatch,
      onalert,
      alertnum,
      riskalert,
    } = this.state;
    const { history, dispatch } = this.props;
    const props = {
            name: 'file',
            action: '',
            headers: {
              authorization: 'authorization-text',
            },
            showUploadList: false,
            fileList: [],
            beforeUpload: file => {
              if (file.name.indexOf('.xls') < 0) {
                this.setState({ onalert: true, alertnum: 0 });
                return;
              }
              if (fileList.some(item => item.fileName === file.name)) {
                this.setState({ onalert: true, alertnum: 1 });
                return;
              }
              fileList.push({
                fileName: file.name,
                fileSize: `${file.size / 1000}kb`,
                progressValue: 0,
              });
              this.setState(
                {
                  file,
                  fileList,
                  initing: false,
                  fileName: file.name,
                },
                this.uploadFile
              );
            },
          };
    const columns = [
      {
        title: '错误类别',
        dataIndex: 'errorType',
      },
      {
        title: '文件名称',
        dataIndex: 'fileName',
      },
      {
        title: '错误明细',
        dataIndex: 'msg',
      },
    ];
    return (
      <div className={styles.settingboard}>
        <div className={styles.topLine}>
          <Breadcrumb style={{ float: 'left' }}>
            <Breadcrumb.Item
              onClick={() => {
                history.push('/riskcontrol');
              }}
            >
              批次列表
            </Breadcrumb.Item>
            <Breadcrumb.Item>创建案件批次</Breadcrumb.Item>
          </Breadcrumb>
          {status !== '-1' ? (
            <FuncButton
              text="删除批次"
              disabled={!(riskPercent === 0)}
              warning={!!true}
              onClick={() => this.setState({ delbatch: true })}
            />
          ) : (
            <FuncButton
              text="取消创建"
              disabled={!(riskPercent === 0)}
              onClick={() => this.setState({ oncancel: true })}
            />
          )}
          <FuncButton
            text="导出报告"
            disabled={!(riskPercent === 100) && !(status === '5' && running === false)}
            onClick={() => this.exportReport()}
          />
          <FuncButton
            text="跑风控"
            disabled={
              !fileList ||
              fileList.length === 0 ||
              !(
                fileList &&
                fileList.every(file => file.progressValue === 100) &&
                (riskPercent === 0 || riskPercent === 100)
              )
            }
            onClick={() => this.riskReport()}
          />
          {riskPercent !== 0 || status === '5'?
            <FuncButton text="导入新文件" disabled={!!true} />
          :
            <Upload {...props}>
              <FuncButton text="导入新文件" disabled={false} />
            </Upload>}
          {/* <FuncButton
            text="保存"
            disabled={
              (fileList &&
                fileList.some(file => file.progressValue !== 100 && file.progressValue !== 0)) ||
              (riskPercent !== 0 && riskPercent !== 100)
            }
            solid={!!1}
            onClick={() => {
              history.push('/riskcontrol');
            }}
          /> */}
        </div>
        <Card className={styles.batchCard}>
          <div className={styles.batchingSlot}>
            <div>保险公司</div>
            <div>{companyList[companyId]}</div>
          </div>
          <div className={styles.batchingSlot}>
            <div>批次号</div>
            <div>{batchId}</div>
          </div>
        </Card>
        {initing && (
          <div className={styles.initBlock}>
            <Upload {...props}>
              <div className={styles.uploadCover}>
                <div className={styles.uploadInfo}>点击或拖入赔案文件</div>
                <img src={uploading} alt="" />
              </div>
            </Upload>
            <div>
              <Button
                style={{ background: '#4291eb', color: 'white', width: 100, marginTop: '-30px' }}
                onClick={() => {
                  dispatch({
                    type: 'riskControl/exportSample',
                    callback: res => {
                      const url = URL.createObjectURL(res);
                      const eleLink = document.createElement('a');
                      eleLink.download = '风控模版.xlsx';
                      eleLink.style.display = 'none';
                      eleLink.href = url;
                      document.body.appendChild(eleLink);
                      eleLink.click();
                      document.body.removeChild(eleLink);
                    },
                  });
                }}
              >
                下载模版
              </Button>
            </div>
          </div>
        )}
        {!initing && (
          <div className={styles.uploadBoard}>
            <div className={styles.leftPart}>
              {this.getFiles()}
              {running &&
                riskPercent < 100 && (
                  <div className={styles.calculatingBar}>
                    <div
                      className={styles.calculatingFilling}
                      style={{ width: `${riskPercent}%` }}
                    />
                    <div style={{ position: 'relative', top: '-45px', left: '20px' }}>
                      <img
                        src={info}
                        alt=""
                        style={{ height: 20, marginRight: 10, marginTop: '-3px' }}
                      />
                      以上导入成功的案件正在进行计算……
                    </div>
                  </div>
                )}
              {running &&
                riskPercent === 100 && (
                  <div className={styles.calculatingBar}>
                    <div className={styles.calculatingFilled} style={{ width: `100%` }} />
                    <div
                      style={{ position: 'relative', top: '-45px', left: '20px', color: '#177C80' }}
                    >
                      <img
                        src={checkcircle}
                        alt=""
                        style={{ height: 18, marginRight: 10, marginTop: '-3px' }}
                      />
                      以上案件风控已完成，已出报告。
                    </div>
                  </div>
                )}
            </div>
            <div className={styles.rightPart}>
              <div className={styles.titleLine}>
                <img src={errorlog} alt="" />
                <div className={styles.titleFont}>导入错误记录</div>
                <Icon
                  type="download"
                  className={styles.downloadIcon}
                  onClick={() => this.downloadErr()}
                />
              </div>
              <Table columns={columns} dataSource={fileError} pagination={false} />
            </div>
          </div>
        )}
        {onhint && (
          <FuncPopover
            visible={onhint}
            type="hint"
            onOk={() => {}}
            onCancel={() => this.setState({ onhint: false })}
          />
        )}
        {ondelete && (
          <FuncPopover
            visible={ondelete}
            type="deleting"
            onOk={this.deleteFile}
            onCancel={() => this.setState({ ondelete: false })}
          />
        )}
        {oncancel && (
          <FuncPopover
            visible={oncancel}
            type="warning"
            onOk={this.deleteBatch}
            onCancel={() => this.setState({ oncancel: false })}
          />
        )}
        {delbatch && (
          <FuncPopover
            visible={delbatch}
            type="delall"
            onOk={this.deleteBatch}
            onCancel={() => this.setState({ delbatch: false })}
          />
        )}
        {riskalert && (
          <FuncPopover
            visible={riskalert}
            type="hint"
            onOk={() => {
              this.setState({ riskalert: false });
              this.runRisk();
            }}
            onCancel={() => this.setState({ riskalert: false })}
          />
        )}
        {onalert && (
          <Modal
            visible={onalert}
            title={
              <div style={{ fontSize: 18 }}>
                <Icon type="close-circle" style={{ color: '#EB3850', fontSize: 20, margin: 10 }} />
                错误
              </div>
            }
            width={450}
            onCancel={() => this.setState({ onalert: false })}
            footer={
              <div>
                <Button
                  style={{
                    width: 100,
                    background: 'white',
                    border: '1px solid #4291EB',
                    color: '#4291EB',
                  }}
                  onClick={() => this.setState({ onalert: false })}
                >
                  知道了
                </Button>
              </div>
            }
          >
            {alertcontent[alertnum]}
          </Modal>
        )}
        {notification && <div className={styles.notification}>{notext}</div>}
      </div>
    );
  }
}

export default RiskControlBatching;
