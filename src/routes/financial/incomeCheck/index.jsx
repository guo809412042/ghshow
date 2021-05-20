import React, {
  useState, useEffect, useRef, Fragment,
} from 'react';
import moment from 'moment';
import {
  Table, Button, Modal, Form, Input, message, Spin, Tooltip,
} from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { isNull } from 'lodash';
import TextArea from 'antd/lib/input/TextArea';
import Query from './components/Query';
import { DownLoadButton } from '../../common/DownLoadButton';
import {
  GetFinancialCheckList,
  UpdateFinancialCheckItem,
  UpdateVCMIncome,
} from '../../business/advStatistics/services';
import styles from './styles/index.less';

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

export default () => {
  const [search, setSearch] = useState({
    startDate: moment().subtract(1, 'month'),
    endDate: moment().subtract(0, 'month'),
    channel: undefined,
    account: undefined,
    moneyType: 'rmb',
  });
  const [checkData, setCheckData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [row, setRow] = useState({});
  const [billIncome, setBillIncome] = useState(0);
  const [description, setDescription] = useState();
  const [currID, setCurrID] = useState();
  const [spinning, setSpinning] = useState(false);
  const formRef = useRef();

  const onSearch = (value) => {
    setSearch(value);
  };

  const getWhere = () => ({
    channel: search.channel,
    account: search.account,
    cash_type: search.moneyType || 'rmb',
    start_date: moment(search.startDate).format('YYYYMM'),
    end_date: moment(search.endDate).format('YYYYMM'),
  });

  const getCheckData = async () => {
    setSpinning(true);
    try {
      const res = await GetFinancialCheckList(getWhere());
      setCheckData(res.data || []);
    } catch (error) {
      message.warning(error);
    } finally {
      setSpinning(false);
    }
  };

  const edit = row => () => {
    setVisible(true);
    setRow(row);
    setBillIncome(row.bill_income);
    setDescription(row.description);
    setCurrID(row.id);
  };

  const submit = async () => {
    setSpinning(true);
    try {
      const res = await UpdateFinancialCheckItem({
        bill_income: billIncome,
        description,
        id: currID,
      });
      if (res && res.code === 20000) {
        message.success('保存成功');
        setVisible(false);
        getCheckData();
      } else {
        message.warning(res.message);
      }
    } catch (error) {
      message.warning(error);
    } finally {
      setSpinning(false);
    }
  };

  const refresh = id => async () => {
    await UpdateVCMIncome({
      id,
    });
    // 后台刷数据是异步的需要等待
    setSpinning(true);
    setTimeout(getCheckData, 1000);
  };

  const CheckColumns = [
    {
      title: '日期',
      dataIndex: 'month',
      key: 'month',
      render: text => text,
    },
    {
      title: '渠道',
      dataIndex: 'channel',
      key: 'channel',
      render: text => text,
    },
    {
      title: '账号',
      dataIndex: 'account',
      key: 'account',
      render: text => text,
    },
    {
      title: '公司主体',
      dataIndex: 'account_name',
      key: 'account_name',
      render: text => text,
    },
    {
      title: 'vcm账单收入',
      dataIndex: 'vcm_income',
      key: 'vcm_income',
      render: text => text,
    },
    {
      title: 'vcm账单退款',
      dataIndex: 'vcm_refund',
      key: 'vcm_refund',
      render: text => text,
    },
    {
      title: 'vcm净收入',
      dataIndex: 'vcm_revenue',
      key: 'vcm_revenue',
      render: (text, row) => (
        <Fragment>
          <span>{Number(row.vcm_income || 0) + Number(row.vcm_refund || 0)}</span>
          <a onClick={refresh(row.id)} className={`${styles.iconRefresh}`}>
            刷新
          </a>
        </Fragment>
      ),
    },
    {
      title: '账单净收入',
      dataIndex: 'bill_income',
      key: 'bill_income',
      render: text => text,
    },
    {
      title: '产品',
      dataIndex: 'product_name',
      key: 'product_name',
      render: text => text,
    },
    {
      title: '偏差',
      dataIndex: 'offset',
      key: 'offset',
      render: (text, row) => {
        if (isNull(row.vcm_income) || isNull(row.bill_income)) {
          return '-';
        }
        const offset = Number(row.bill_income) - (Number(row.vcm_income) + Number(row.vcm_refund));
        return <span>{offset}</span>;
      },
    },
    {
      title: '偏差率',
      dataIndex: 'offset_rate',
      key: 'offset_rate',
      render: (text, row) => {
        if (isNull(row.vcm_income) || isNull(row.bill_income)) {
          return '-';
        }
        const offset = Number(row.bill_income) - (Number(row.vcm_income) + Number(row.vcm_refund));
        const rate = (offset / row.vcm_income) * 100;
        if (
          rate > row.max_rate
          || rate < row.min_rate
          || (row.cash_type === 'rmb' && Math.abs(offset) > 100000)
          || (row.cash_type === 'dollar' && Math.abs(offset) > 14000)
        ) {
          return (
            <Tooltip title={row.description}>
              <span style={{ backgroundColor: 'red', color: 'white' }}>{`${rate.toFixed(2)}%`}</span>
            </Tooltip>
          );
        }
        return (
          <Tooltip title={row.description}>
            <span>{`${rate.toFixed(2)}%`}</span>
          </Tooltip>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'operator',
      key: 'operator',
      render: (text, row) => <Button onClick={edit(row)}>编辑</Button>,
    },
  ];

  useEffect(() => {
    getCheckData();
  }, [search]);
  const fileNameSuffix = `${search.channel}-${
    search.moneyType === 'dollar' ? '美元' : '人民币'
  }-${search.startDate.format('YYYY-MM')}-${search.endDate.format('YYYY-MM')}`;
  return (
    <div>
      <Query search={search} onSearch={onSearch} />
      <h3 style={{ margin: 10 }}>校验数据汇总展示</h3>
      <DownLoadButton columns={CheckColumns} data={checkData} filename={`校验数据汇总-${fileNameSuffix}`} />
      <Spin spinning={spinning}>
        <Table dataSource={checkData} columns={CheckColumns} bordered rowKey="key" scroll={{ x: 1500 }} />
      </Spin>

      <Modal title="编辑" width={500} visible={visible} onCancel={() => setVisible(false)} onOk={submit}>
        <Form ref={formRef} layout="horizontal">
          <FormItem key="cash_type" label="币种" {...formItemLayout}>
            <span>{row.cash_type}</span>
          </FormItem>

          <FormItem key="bill_income" label="账单净收入" {...formItemLayout}>
            <Input
              value={billIncome}
              onChange={(e) => {
                setBillIncome(e.target.value);
              }}
            />
          </FormItem>

          <FormItem key="description" label="备注" {...formItemLayout}>
            <TextArea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
              }}
            />
          </FormItem>
        </Form>
      </Modal>
    </div>
  );
};
