import React, { useState } from 'react';
import { Button, Modal, Table } from 'antd';
import { createSqlWhere, getNumber } from '../../../../utils/utils';
import { getData } from '../../../../utils/request';
import { DownLoadButton } from '../../../common/DownLoadButton';

export default ({
  title, colum, detailSQL, search,
}) => {
  const [visible, setVisible] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [lodaing, setLoading] = useState(false);
  const columns = [{ dataIndex: 'ds', title: '日期', key: 'ds' }].concat(colum);
  const getFetchData = async () => {
    setLoading(true);
    const {
      platform, country, startDate, endDate, appVersion,
      newUser,
    } = search;
    let where = '';
    if (platform) {
      where += ` and platform = '${platform}'`;
    }
    if (country.length) {
      where += ` and country in (${country.map(v => `'${v}'`).join(',')})`;
    }
    if (appVersion.length) {
      where += ` and app_version in (${appVersion.map(v => `'${v}'`).join(',')})`;
    }
    if (newUser) {
      where += ` and is_new_dvc = '${newUser}'`;
    }
    const sql = createSqlWhere({
      sql: detailSQL,
      startDate,
      endDate,
      where,
    });
    const res = await getData(sql);
    const dataSource = res.map(v => ({
      ...v,
      'gallery_entry_cnt_1d/home_entry_cnt_1d': `${getNumber(v.gallery_entry_cnt_1d, v.home_entry_cnt_1d)}%`,
      'preview_entry_cnt_1d/gallery_entry_cnt_1d': `${getNumber(v.preview_entry_cnt_1d, v.gallery_entry_cnt_1d)}%`,
      'save_button_clk_cnt_1d/preview_entry_cnt_1d': `${getNumber(v.save_button_clk_cnt_1d, v.preview_entry_cnt_1d)}%`,
      'share_savetogallery_cnt_1d/save_button_clk_cnt_1d': `${getNumber(
        v.share_savetogallery_cnt_1d,
        v.save_button_clk_cnt_1d,
      )}%`,
      'share_button_clk_cnt_1d/share_savetogallery_cnt_1d': `${getNumber(
        v.share_button_clk_cnt_1d,
        v.share_savetogallery_cnt_1d,
      )}%`,
      'share_button_clk_cnt_1d/save_button_clk_cnt_1d': `${getNumber(
        v.share_button_clk_cnt_1d,
        v.save_button_clk_cnt_1d,
      )}%`,
      'pay_entry_cnt_1d/home_entry_cnt_1d': `${getNumber(v.pay_entry_cnt_1d, v.home_entry_cnt_1d)}%`,
      'pay_clk_cnt_1d/pay_entry_cnt_1d': `${getNumber(v.pay_clk_cnt_1d, v.pay_entry_cnt_1d)}%`,
      'pay_clk_cnt_1d/home_entry_cnt_1d': `${getNumber(v.pay_clk_cnt_1d, v.home_entry_cnt_1d)}%`,
      '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_clk_cnt_1d': `${(
        ((Number(v.pay_year_cnt_1d || 0) + Number(v.pay_month_cnt_1d || 0)) * 100)
        / v.pay_clk_cnt_1d
      ).toFixed(2)}%`,
      '(pay_year_cnt_1d+pay_month_cnt_1d)/pay_entry_cnt_1d': `${(
        ((Number(v.pay_year_cnt_1d || 0) + Number(v.pay_month_cnt_1d || 0)) * 100)
        / v.pay_entry_cnt_1d
      ).toFixed(2)}%`,
      'pay_year_cnt_1d+pay_month_cnt_1d': Number(v.pay_year_cnt_1d || 0) + Number(v.pay_month_cnt_1d || 0),
      'enter_buy_home_dvc_cnt/enter_home_dvc_cnt': getNumber(v.enter_buy_home_dvc_cnt, v.enter_home_dvc_cnt),
      'click_buy_dvc_cnt/enter_buy_home_dvc_cnt': getNumber(v.click_buy_dvc_cnt, v.enter_buy_home_dvc_cnt),
      'buy_dvc_cnt/click_buy_dvc_cnt': getNumber(v.buy_dvc_cnt, v.click_buy_dvc_cnt),
      'buy_dvc_cnt/enter_home_dvc_cnt': getNumber(v.buy_dvc_cnt, v.enter_home_dvc_cnt),
    }));
    setDataSource(dataSource);
    setLoading(false);
  };
  const handleClick = async () => {
    setVisible(true);
    await getFetchData();
  };
  return (
    <div>
      <Button onClick={handleClick}>详情</Button>
      <Modal
        visible={visible}
        title={title}
        onCancel={() => setVisible(false)}
        onOk={() => setVisible(false)}
        width={1000}
      >
        <DownLoadButton filename={title} data={dataSource} columns={columns} />
        <Table columns={columns} dataSource={dataSource} loading={lodaing} bordered rowKey="ds" scroll={{ x: 1300 }} />
      </Modal>
    </div>
  );
};
