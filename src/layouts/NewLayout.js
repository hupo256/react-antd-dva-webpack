import React from 'react';
// import { Layout } from 'antd';
// import DocumentTitle from 'react-document-title';
// import { connect } from 'dva';
//
// const { Content } = Layout;


class NewLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={
      loading: false,
    }
  }

  state = {
  };

  componentDidMount() {

  }

  render() {
    const { loading } = this.state;
    console.log(loading);
    return (
      <React.Fragment>
        我的中国心
      </React.Fragment>
    );
  }
}

export default NewLayout;
