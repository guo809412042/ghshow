/* eslint-disable react/prop-types */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Spin, Card, Row, Col,
} from 'antd';
import { PRODUCT_APP_MIN } from '../../../utils/const';
import { createSqlWhere } from '../../../utils/utils';
import { listAllSQL } from './components/sqlTemplate';
import { getHoloData } from '../../../utils/request';
import { ChartRenderSimple } from './components/ChartRender';
import ModalChart from './components/ModalChart';
import CouldViewOld from './components/CouldViewOld';
import CouldViewNew from './components/CouldViewNew';

export default (props) => {
  let { product } = props.match.params;
  if (!PRODUCT_APP_MIN[product]) {
    product = 'viva';
  }
  const productId = PRODUCT_APP_MIN[product] || '2';
  const endDate = moment().subtract(1, 'days');
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [currentBusiness, setCurrentBusiness] = useState(undefined);

  const getChartData = async () => {
    setLoading(true);
    const andSQL = createSqlWhere({
      sql: listAllSQL,
      platform: 'android',
      startDate: `${moment(endDate).format('YYYY-MM-DD')} 00:00:00`,
      endDate: `${moment(endDate).format('YYYY-MM-DD')} 23:59:59`,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      product,
    });
    const iosSQL = createSqlWhere({
      sql: listAllSQL,
      platform: 'ios',
      startDate: `${moment(endDate).format('YYYY-MM-DD')} 00:00:00`,
      endDate: `${moment(endDate).format('YYYY-MM-DD')} 23:59:59`,
      dateFormat: 'YYYY-MM-DD HH:mm:ss',
      product,
    });
    const andRes = await getHoloData(andSQL);
    const iosRes = await getHoloData(iosSQL);
    const IAPData = [];
    const UserLoginData = [];
    const ExportData = [];
    const UploadData = [];
    for (const v of andRes) {
      const arr = {
        type: 'android',
        value: v.ratio * 1,
        day: v.date_time,
      };
      if (v.business === 'IAP') {
        IAPData.push(arr);
      } else if (v.business === 'UserLogin') {
        UserLoginData.push(arr);
      } else if (v.business === 'Export') {
        ExportData.push(arr);
      } else if (v.business === 'Upload') {
        UploadData.push(arr);
      }
    }
    for (const v of iosRes) {
      const arr = {
        type: 'ios',
        value: v.ratio * 1,
        day: v.date_time,
      };
      if (v.business === 'IAP') {
        IAPData.push(arr);
      } else if (v.business === 'UserLogin') {
        UserLoginData.push(arr);
      } else if (v.business === 'Export') {
        ExportData.push(arr);
      } else if (v.business === 'Upload') {
        UploadData.push(arr);
      }
    }
    ChartRenderSimple(IAPData, document.getElementById('chart-IAP'));
    ChartRenderSimple(UserLoginData, document.getElementById('chart-UserLogin'));
    ChartRenderSimple(ExportData, document.getElementById('chart-Export'));
    ChartRenderSimple(UploadData, document.getElementById('chart-Upload'));
    setLoading(false);
  };

  const modalShow = (business) => {
    setCurrentBusiness(business);
    setVisible(true);
  };
  useEffect(() => {
    getChartData();
  }, [product]);
  return (
    <Row>
      {[2, 15, 6, 3, 10, 35, 42].includes(productId * 1) ? (
        ''
      ) : (
        <CouldViewOld product={product} productId={productId} />
      )}
      {[42].includes(productId * 1) ? (
        ''
      ) : (
        <Spin spinning={loading}>
          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col span={12} onClick={() => modalShow('IAP')}>
              <Card title={`IAP | ${moment(endDate).format('YYYY-MM-DD')}`}>
                <div id="chart-IAP" />
              </Card>
            </Col>
            <Col span={12} onClick={() => modalShow('Export')}>
              <Card title={`Export | ${moment(endDate).format('YYYY-MM-DD')}`}>
                <div id="chart-Export" />
              </Card>
            </Col>
          </Row>
          <Row gutter={24} style={{ marginTop: 20 }}>
            <Col span={12} onClick={() => modalShow('Upload')}>
              <Card title={`Upload | ${moment(endDate).format('YYYY-MM-DD')}`}>
                <div id="chart-Upload" />
              </Card>
            </Col>
            <Col span={12} onClick={() => modalShow('UserLogin')}>
              <Card title={`UserLogin | ${moment(endDate).format('YYYY-MM-DD')}`}>
                <div id="chart-UserLogin" />
              </Card>
            </Col>
          </Row>
        </Spin>
      )}
      {[2, 15, 6, 3, 10, 35, 42].includes(productId * 1) ? (
        <CouldViewNew product={product} productId={productId} />
      ) : (
        ''
      )}
      <ModalChart
        business={currentBusiness}
        visible={visible}
        setVisible={setVisible}
        productId={productId}
        product={product}
      />
    </Row>
  );
};
