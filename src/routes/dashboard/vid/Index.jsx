import React from 'react';
import { connect } from 'dva';
import { Row } from 'antd';
import { cardData } from './contants';
import ChartCardView from './components/ChartCardView';
import CardLineView from './components/CardLineView';
import * as sqlTemplate from './sqlTemplate';
// import BarChartView from './components/BarChartView';

class Index extends React.Component {
  componentDidMount() {}

  render() {
    return (
      <div style={{ padding: 10 }}>
        <Row gutter={16}>
          {cardData.map((v, index) => (
            <ChartCardView {...v} key={index} />
          ))}
        </Row>
        <CardLineView
          title="vv/uv人均播放"
          database="rpt_vid_itr_idx_1d"
          engTitle="vv&&uv"
          graphName="vv/uv 人均播放"
          sql={sqlTemplate.vvuvPlay}
          id="vv_uv"
          day="day"
          type
        />
        <CardLineView
          title="各分类用户"
          database="rpt_vid_itr_idx_1d"
          graphName="各分类用户"
          engTitle="Typical Users"
          sql={sqlTemplate.usersql}
          id="typical_users"
          day="ds"
        />
        {/* <BarChartView
          title="播放用户分层"
          graphName="播放用户分层"
          engTitle="Hierarchy For Consume User"
          sql={sqlTemplate.vivashowplaycountplot}
          id="hierarchy_consume_user"
          day="day"
        /> */}
        <CardLineView
          title="发布数据"
          database="rpt_vid_itr_idx_1d"
          graphName="发布数据"
          engTitle="Creator Data"
          sql={sqlTemplate.publishcount}
          id="publish_count"
          day="ds"
        />
        <CardLineView
          title="互动数据"
          database="rpt_vid_itr_idx_1d"
          graphName="互动数据"
          engTitle="Community Data"
          sql={sqlTemplate.interactivesql}
          id="community_data"
          day="ds"
          source
        />
      </div>
    );
  }
}
export default connect(({ app }) => ({ app }))(Index);
