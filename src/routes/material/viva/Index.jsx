import React from 'react';
import { Select, Tabs, Row } from 'antd';
import moment from 'moment';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import Query from './components/Query';
import { cardData, TABLE_INFO } from './constant';
import ChartCardView from './components/ChartCardView';
import TabPane1 from './components/TabPane1';

class Index extends React.Component {
  state = {
    platform: '1',
    searchItem: {
      selectUserType: '1',
      startDate: moment().subtract(30, 'days'),
      endDate: moment().subtract(1, 'days'),
      tags: ['全球'],
    },
    tabsKey: '1',
  };

  componentDidMount() {}

  onSearch = (value) => {
    const { searchItem } = this.state;
    this.setState({
      searchItem: {
        ...searchItem,
        ...value,
      },
    });
  };

  render() {
    const { platform, tabsKey, searchItem } = this.state;
    const { startDate, endDate, selectUserType } = searchItem;
    return (
      <div>
        {BreadcrumbMenu()}
        <div style={{ paddingBottom: 10, borderBottom: '1px solid #e7ebf1' }}>
          <Select
            style={{ width: 120 }}
            placeholder="平台"
            value={platform}
            onChange={value => this.setState({ platform: value })}
          >
            <Select.Option key="1" value="1">
              Android
            </Select.Option>
            <Select.Option key="2" value="2">
              iOS
            </Select.Option>
          </Select>
        </div>

        <Query platform={platform} onSearch={this.onSearch} />
        <Tabs activeKey={tabsKey} style={{ marginTop: 20 }} onChange={value => this.setState({ tabsKey: value })}>
          <Tabs.TabPane tab="音乐&滤镜" key="1">
            <Row gutter={24}>
              {tabsKey === '1'
                && cardData
                  .filter(v => v.thirdLevel === '音乐&滤镜')
                  .map(v => <ChartCardView key={v.id} info={v} platform={platform} searchItem={searchItem} />)}
            </Row>
            <TabPane1
              platform={platform}
              searchItem={{
                startDate,
                endDate,
                selectUserType,
                model: '\'viva_normalfilter\', \'viva_effectfilter\'',
              }}
              info={TABLE_INFO}
              title="音乐&滤镜"
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="主题" key="2">
            <Row gutter={24}>
              {tabsKey === '2'
                && cardData
                  .filter(v => v.thirdLevel === '主题')
                  .map(v => <ChartCardView key={v.id} info={v} platform={platform} searchItem={searchItem} />)}
            </Row>
            <TabPane1
              platform={platform}
              searchItem={{
                startDate,
                endDate,
                selectUserType,
                model: 'viva_template_theme',
              }}
              title="主题"
              info={TABLE_INFO}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="字幕" key="3">
            <Row gutter={24}>
              {tabsKey === '3'
                && cardData
                  .filter(v => v.thirdLevel === '字幕')
                  .map(v => <ChartCardView key={v.id} info={v} platform={platform} searchItem={searchItem} />)}
            </Row>
            <TabPane1
              title="字幕"
              platform={platform}
              searchItem={{
                startDate,
                endDate,
                selectUserType,
                model: 'viva_text',
              }}
              info={TABLE_INFO}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="贴纸" key="4">
            <Row gutter={24}>
              {tabsKey === '4'
                && cardData
                  .filter(v => v.thirdLevel === '贴纸')
                  .map(v => <ChartCardView key={v.id} info={v} platform={platform} searchItem={searchItem} />)}
            </Row>
            <TabPane1
              title="贴纸"
              platform={platform}
              searchItem={{
                startDate,
                endDate,
                selectUserType,
                model: 'viva_sticker',
              }}
              info={TABLE_INFO}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="特效" key="5">
            <Row gutter={24}>
              {tabsKey === '5'
                && cardData
                  .filter(v => v.thirdLevel === '特效')
                  .map(v => <ChartCardView key={v.id} info={v} platform={platform} searchItem={searchItem} />)}
            </Row>
            <TabPane1
              title="特效"
              platform={platform}
              searchItem={{
                startDate,
                endDate,
                selectUserType,
                model: 'viva_effect',
              }}
              info={TABLE_INFO}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="转场" key="6">
            <Row gutter={24}>
              {tabsKey === '6'
                && cardData
                  .filter(v => v.thirdLevel === '转场')
                  .map(v => <ChartCardView key={v.id} info={v} platform={platform} searchItem={searchItem} />)}
            </Row>
            <TabPane1
              platform={platform}
              title="转场"
              searchItem={{
                startDate,
                endDate,
                selectUserType,
                model: 'viva_transition',
              }}
              info={TABLE_INFO}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

export default Index;
