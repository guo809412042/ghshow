import React, { useEffect, useState } from 'react';
import {
  Collapse, Select, Button, Radio,
} from 'antd';
import moment from 'moment';
import { getHoloData } from '../../../../utils/request';
import { appProductSQL } from './sqlTemplate';
import MyDatePicker from '../../../components/MyDatePicker';

export default ({ onSearch, search }) => {
  const [startDate, setStartDate] = useState(search.startDate);
  const [endDate, setEndDate] = useState(search.endDate);

  // app 类型
  const [appProduct, setAppProduct] = useState(search.appProduct);
  const [appProductList, setAppProductList] = useState([]);

  const [dateType, setDateType] = useState(undefined);
  const getAppProduct = async () => {
    const res = await getHoloData(appProductSQL);
    setAppProductList(res);
  };
  useEffect(() => {
    getAppProduct();
  }, []);

  const handleSearch = () => {
    onSearch({
      startDate,
      endDate,
      appProduct,
    });
  };
  useEffect(() => {
    if (dateType) {
      setStartDate(moment().subtract(dateType, 'days'));
      setEndDate(moment().subtract(1, 'days'));
    }
  }, [dateType]);
  return <div>
    <Collapse defaultActiveKey={['1']}>
      <Collapse.Panel
        header="查询"
        key="1"
      >
        <Select
          style={{ width: 200, marginRight: '8px' }}
          value={appProduct}
          onChange={setAppProduct}
          placeholder="app类型"
        >
          <Select.Option key="" value="">整体</Select.Option>
          {appProductList.map(v => <Select.Option value={v.app_product} key={v.app_product}>{v.app_product}</Select.Option>)}
        </Select>
        <MyDatePicker
          dateTags={[30, 60, 90]}
          style={{ margin: '8px 8px 8px 0' }}
          value={[startDate, endDate]}
          onChange={(value) => {
            setStartDate(value[0]);
            setEndDate(value[1]);
          }}
        />
        {/* <Radio.Group onChange={e => setDateType(e.target.value)} value={dateType}>
          <Radio value="30">30天</Radio>
          <Radio value="60">60天</Radio>
          <Radio value="90">90天</Radio>
        </Radio.Group> */}
        <Button onClick={handleSearch} type="primary">
          查询
        </Button>
      </Collapse.Panel>
    </Collapse>
  </div>;
};
