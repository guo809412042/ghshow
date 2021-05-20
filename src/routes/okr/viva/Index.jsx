import React from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import moment from 'moment';
import { Row, Select } from 'antd';
import * as sqlTemplate from './sqlTemplate';
import QueryPannel from '../../components/QueryPannel/Index';
import ChartView from '../../common/ChartView';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';

class Index extends React.Component {
  state = {
    tags: ['默认'],
    colNum: 12,
    hideNormal: false,
    startDate: moment().subtract(31, 'days'),
    endDate: moment().subtract(1, 'days'),
    ghPlatform: '1',
  };

  componentDidMount() {}

  queryButton = (value) => {
    this.setState({ ...value });
  };

  render() {
    const {
      colNum, hideNormal, tags, startDate, endDate, ghPlatform,
    } = this.state;
    const { graphDefinition } = this.props.app;
    return (
      <div>
        {BreadcrumbMenu()}
        <Select
          style={{ width: 200, marginBottom: 10 }}
          value={ghPlatform}
          onChange={value => this.setState({ ghPlatform: value })}
        >
          <Select.Option key="1" value="1">
            Android
          </Select.Option>
          <Select.Option key="2" value="2">
            iOS
          </Select.Option>
        </Select>
        <QueryPannel ghPlatform={ghPlatform} queryButton={this.queryButton} noChannel />
        <Row gutter={24}>
          <ChartView
            colNum={colNum}
            title="剪辑完成率(导出完成/进入Preview)"
            graphDefinition={graphDefinition}
            graphName="剪辑完成率(导出完成/进入Preview)"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.cutRate}
            tags={tags}
            app_version="app_version"
            chartFunc="cutRate"
            suffix
            hideNormal={hideNormal}
            country="country"
            userSelect
          />
          <ChartView
            colNum={colNum}
            title="剪辑完成率(点击保存/进入Preview)"
            graphDefinition={graphDefinition}
            graphName="剪辑完成率(点击保存/进入Preview)"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.cutRateSave}
            tags={tags}
            app_version="app_version"
            chartFunc="cutRateSave"
            suffix
            hideNormal={hideNormal}
            country="country"
            userSelect
          />
          <ChartView
            colNum={colNum}
            title="用户进入preview占比(进入Preview/DAU)"
            graphDefinition={graphDefinition}
            graphName="用户进入preview占比(进入Preview/DAU)"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.enterPreviewSql}
            tags={tags}
            chartFunc="enterPreview"
            suffix
            hideNormal={hideNormal}
            userSelect
            country="country"
            app_version="app_version"
          />
          <ChartView
            colNum={colNum}
            title="用户导出完成占比(导出完成/DAU)"
            graphDefinition={graphDefinition}
            graphName="用户导出完成占比(导出完成/DAU)"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.shareExportDone}
            tags={tags}
            chartFunc="shareExportDone"
            suffix
            hideNormal={hideNormal}
            userSelect
            country="country"
            app_version="app_version"
          />

          <ChartView
            colNum={colNum}
            title="分享用户占比"
            graphDefinition={graphDefinition}
            graphName="分享用户占比"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.videoShare}
            tags={tags}
            chartFunc="videoShare"
            suffix
            hideNormal={hideNormal}
            app_version="app_version"
            country="country"
          />
          <ChartView
            colNum={colNum}
            title="人均分享次数"
            graphDefinition={graphDefinition}
            graphName="人均分享次数"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.pvShare}
            tags={tags}
            app_version="app_version"
            chartFunc="pvShare"
            hideNormal={hideNormal}
            country="country"
          />
          <ChartView
            colNum={colNum}
            title="7日rolling留存"
            graphDefinition={graphDefinition}
            graphName="7日rolling留存"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.rollingAtv}
            tags={tags}
            app_version="app_version"
            chartFunc="rollingAtv"
            suffix
            hideNormal={hideNormal}
            country="country"
          />
          <ChartView
            colNum={colNum}
            title="7日rolling导出完成留存"
            graphDefinition={graphDefinition}
            graphName="7日rolling导出完成留存"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.rollingExp}
            tags={tags}
            app_version="app_version"
            chartFunc="rollingExp"
            suffix
            hideNormal={hideNormal}
            country="country"
          />

          <ChartView
            colNum={colNum}
            title="教程用户播放的7日rolling"
            graphDefinition={graphDefinition}
            graphName="教程用户播放的7日rolling"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.rollingPly}
            tags={tags}
            app_version="app_version"
            chartFunc="rollingPly"
            suffix
            hideNormal={hideNormal}
            country="country"
          />
          <ChartView
            colNum={colNum}
            title="模版创作用户占比"
            graphDefinition={graphDefinition}
            graphName="模版创作用户占比"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.modAtr}
            tags={tags}
            app_version="app_version"
            chartFunc="modAtr"
            suffix
            hideNormal={hideNormal}
            country="country"
          />
          <ChartView
            colNum={colNum}
            title="模版创作视频数占比"
            graphDefinition={graphDefinition}
            graphName="模版创作视频数占比"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.modAtrPv}
            tags={tags}
            chartFunc="modAtrPv"
            app_version="app_version"
            suffix
            hideNormal={hideNormal}
            country="country"
          />
          <ChartView
            colNum={colNum}
            title="教程播放总数"
            graphDefinition={graphDefinition}
            graphName="教程播放总数"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.pvPly}
            app_version="app_version"
            tags={tags}
            chartFunc="pvPly"
            hideNormal={hideNormal}
            country="country"
          />
          <ChartView
            colNum={colNum}
            title="教程播放用户占比"
            graphDefinition={graphDefinition}
            graphName="教程播放用户占比"
            startDate={startDate}
            endDate={endDate}
            ghPlatform={ghPlatform}
            sql={sqlTemplate.uvPly}
            tags={tags}
            app_version="app_version"
            chartFunc="uvPly"
            suffix
            hideNormal={hideNormal}
            country="country"
          />
        </Row>
      </div>
    );
  }
}

Index.propTypes = {
  app: PropTypes.object,
};
Index.defaultProps = {
  app: {},
};
export default connect(({ app }) => ({ app }))(Index);
