import React from 'react';
import { Table } from 'antd';
import { menus } from '../common/menuJson';
import { BreadcrumbMenu } from '../common/BreadcrumbMenu';

class Index extends React.Component {
  state = {
    menuList: [],
  };

  componentDidMount() {
    const menuList = menus.filter(v => !v.pTid);
    this.setState({
      menuList,
    });
  }

  render() {
    const { menuList } = this.state;
    console.log(menuList);
    const columns = [{ dataIndex: 'title', title: '名称', key: 'title' }];
    return (
      <div>
        {BreadcrumbMenu()}
        <Table dataSource={menuList} columns={columns} bordered />
      </div>
    );
  }
}

export default Index;
