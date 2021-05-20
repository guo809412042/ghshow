/* eslint-disable no-empty */
/* eslint-disable no-eval */
import React, { useState } from 'react';
import { Row, Tabs, Radio } from 'antd';
import { initData, titleList, otherData } from './const';
import CardView from './components/CardView';

const tabsList = [
  { label: '用户行为漏斗', key: '1' },
  { label: '社区数据', key: '2' },
  { label: '工具数据', key: '3' },
];
export default () => {
  const [showType, setShowType] = useState(0);
  return (
    <div style={{ padding: 10 }}>
      <Radio.Group value={showType} onChange={e => setShowType(e.target.value)}>
        <Radio.Button value={0}>绝对值</Radio.Button>
        <Radio.Button value={1}>占比</Radio.Button>
      </Radio.Group>
      <Tabs
        style={{ marginTop: 20 }}
      >
        {tabsList.map(tab => <Tabs.TabPane tab={<p style={{ color: ' #7d8c95', fontSize: 16 }} >{tab.label}</p>} key={tab.key}>
          <Tabs>
            {titleList.map(i => <Tabs.TabPane tab={i.label} key={`${i.value}-tabs`}>
              <Row gutter={12} key={`${i.value}-row`}>
                {initData.filter(v => v.pTitle === tab.label).map((v, index) => {
                  let flag = true;
                  if (v.conditionExpr && typeof v.conditionExpr === 'string') {
                    try {
                      flag = eval(v.conditionExpr);
                    } catch (_err) {}
                  }
                  return flag && <CardView row={v} key={index} usr_type={i.value} tabs={tab.label} index={index}/>;
                })}
              </Row>
              <Row gutter={12} key={`${i.value}-row-2`}>
                {
                  tab.key === '3' && i.value === 'all' ? otherData.map((v, index) => {
                    let flag = true;
                    if (v.conditionExpr && typeof v.conditionExpr === 'string') {
                      try {
                        flag = eval(v.conditionExpr);
                      } catch (_err) {}
                    }
                    return (
                      flag && <CardView
                        database ="rpt_vid_log_dvc_path_als_nd"
                        row={v}
                        key={index}
                        usr_type={i.value}
                        tabs={tab.label}
                        index={index}
                        showSuffix={[true, false].includes(v?.showSuffix) ? v?.showSuffix : true}
                        durationFlag
                      />
                    );
                  }) : ''
                }
              </Row>
            </Tabs.TabPane>)}
          </Tabs>
        </Tabs.TabPane>)}
      </Tabs>
    </div>
  );
};
