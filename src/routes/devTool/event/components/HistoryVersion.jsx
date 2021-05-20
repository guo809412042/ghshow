import React from 'react';
import {
  Modal, Button, Table, message,
} from 'antd';

import { baseColumns } from './TableColumn';

import { getHistroyEvent } from '../service';

class HistoryVersion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      listLoading: false,
      listData: [],
    };
  }

showModal = async () => {
  this.getList();
  this.setState({ visible: true });
}

hideModal = () => {
  this.setState({ visible: false });
}

getList = async () => {
  const {
    record: {
      event_id,
      product,
    },
  } = this.props;
  this.setState({ listLoading: true });
  try {
    const { data } = await getHistroyEvent(event_id, product);
    this.setState({ listData: data });
  } catch (err) {
    message.error(err);
  } finally {
    this.setState({ listLoading: false });
  }
}

render() {
  const {
    visible,
    listLoading,
    listData,
  } = this.state;
  const modalProps = {
    title: '历史版本',
    visible,
    onOk: this.hideModal,
    onCancel: this.hideModal,
    footer: [<Button onClick={this.hideModal}>关闭</Button>],
    width: '1200px',
  };
  const columns = [
    {
      title: '版本',
      dataIndex: 'history_version',
      width: 100,
    },
    ...baseColumns,
  ];
  const TableProps = {
    columns,
    loading: listLoading,
    dataSource: listData,
    rowKey: 'id',
  };
  return (
    <div>
      <Button onClick={this.showModal} size="small">查看历史版本</Button>
      <Modal {...modalProps}>
        <Table {...TableProps} />
      </Modal>
    </div>
  );
}
}
export default HistoryVersion;
