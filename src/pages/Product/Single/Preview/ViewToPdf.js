import React, { Component } from 'react';
import { Spin } from 'antd';
import html2canvas from 'html2canvas';
import Jspdf from 'jspdf';
import moment from 'moment';
import InsTable from './InsTable'
import styles from './viewtopdf.less'

export default class ViewToPdf extends Component {
  state = {
    conArr:[],
    groupTit: null,
  };

  componentDidMount(){
    const { dispatch, iData, isGroup} = this.props;
    let paras = [];
    let pidData = null
    if(isGroup){
      paras = iData.group_levels[0].insurance_types[0];
      pidData = {group_id: iData.group_id};
    }else{
      paras = iData.insurance_types[0];
      pidData = {product_id: iData.product_id};
    }

    dispatch({
      type: 'product/queryViewData',
      payload: {
        pid: pidData,
        isGroup,
        nameFields: {
          company_code: paras.company_code,
          item_subcategory: paras.insurance_model,
          item_category: 'duty',
        },
      },
      callback: (res) => {
        console.log(res);
        this.setState({
          conArr: res.viewData,
          groupTit: res.groupTit
        })
      },
    });
  }

  getPdf = (e) => {
    e.nativeEvent.stopImmediatePropagation();
    const pdfcon = document.getElementById('pdfcon');
    html2canvas(pdfcon).then(canvas => {
      const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        // 一页pdf显示html页面生成的canvas高度;
        const pageHeight = contentWidth / 595.28 * 841.89;
        // 未生成pdf的html页面高度
        let leftHeight = contentHeight;
        // pdf页面偏移
        let position = 0;
        // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
        const imgWidth = 555.28;
        const imgHeight = 555.28/contentWidth * contentHeight;
        const pageData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new Jspdf('', 'pt', 'a4');
        // 有两个高度需要区分，一个是html页面的实际高度，和生成pdf的页面高度(841.89)
        // 当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          pdf.addImage(pageData, 'JPEG', 20, 0, imgWidth, imgHeight );
        } else {
          while(leftHeight > 0) {
            pdf.addImage(pageData, 'JPEG', 20, position, imgWidth, imgHeight)
            leftHeight -= pageHeight;
            position -= 841.89;
            // 避免添加空白页
            if(leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.save('list.pdf');
    });

    // return false;
  }

  closeViewDom = (e) => {
    if(e.target.nodeName !== "A"){
      const {isPreview} = this.props;
      isPreview();
    }
  }

  render() {
    const {conArr, groupTit} = this.state;
    const {iData, isGroup} = this.props;
    const dataLen = conArr.length;

    return (
      <div className={styles.pdfbox} onClick={this.closeViewDom}>
        <p className={styles.pagetit}>
          <b>保单预览</b>
          <a onClick={this.getPdf}>生成PDF</a>
        </p>

        <div className={styles.pdfcon} id="pdfcon">
          <h2>{iData.company_name}</h2>
          {!isGroup && 
            <>
              <h3>{iData.product_name}</h3>
              <p>{`产品代码：${iData.product_id}`}</p>
            </>
          }

          {isGroup && groupTit &&
            <>
              <p className={styles.titips}>保单概览</p>
              <ul className={styles.dutybox}>
                <li>
                  <span>团体名称</span><span>{groupTit.organization_name}</span>
                </li>
                <li>
                  <span>团体保单号</span><span>{groupTit.policy_id}</span>
                </li>
                <li>
                  <span>保单有效期</span>
                  <span>{`${moment(groupTit.policy_validate_from).format('YYYY.MM.DD')} ~ ${moment(groupTit.policy_validate_to).format('YYYY.MM.DD')}`}</span>
                </li>
                <li>
                  <span>团体限额</span><span>{groupTit.limit_amount || '- 元'}</span>
                </li>
                <li className={styles.w100}>
                  <span>团体特别约定</span><span>{groupTit.special_agreement || '-'}</span>
                </li>
              </ul>
            </>
          }

          {dataLen === 0 && <h3><Spin size="large" /></h3>}
          {dataLen > 0 && !isGroup  &&  <InsTable conArr={conArr} /> }
          {dataLen > 0 && isGroup  &&  conArr.map((con, index) => <InsTable conArr={con} groupTit={groupTit} isGroup={isGroup} insInd={index} key={index} />) }

          {/* {!isGroup &&
            <div className={styles.tipsbox}>
              <span>告知要求：</span>
              <span>
                一些说明性的文字一些说明性的文字一些说明性的文字一些说明性的文字...
              </span>
            </div>
          } */}
        </div>
      </div>
    );
  }
}


