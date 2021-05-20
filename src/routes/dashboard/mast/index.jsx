/**
 * Created with 盛丽芬.
 * User: shenglifen
 * Date: 2019/10/28
 * Time: 下午5:24
 *
 */
import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import {
  Collapse, Select, Button, message, DatePicker, Switch, Tag, Row,
} from 'antd';
import { FormattedMessage } from 'react-intl';
import * as sqlTemplate from './sqlTemplate';
import { BreadcrumbMenu } from '../../common/BreadcrumbMenu';
import { literalOptions, numberOptions } from '../../common/constants';
import { getCountryAndAppVersionAndChannel, selectAttr, versionNumber } from '../../../utils/utils';
import styles from '../../../styles/index.less';
import ChartView from './ChartView';
import { getTempoChannelList } from '../tempo/requst';

const { RangePicker } = DatePicker;
const userTypeArr = [{ key: 1, value: '全部用户' }, { key: 2, value: '新用户' }, { key: 3, value: '老用户' }];
const userObj = { 1: '全部用户', 2: '新用户', 3: '老用户' };
class Index extends React.Component {
   state = {
     countryList: [],
     appVersionList: [],
     channelList: [],
     selectCountry: undefined,
     selectAppVersion: undefined,
     selectChannel: undefined,
     startDate: moment().subtract(31, 'days'),
     endDate: moment().subtract(1, 'days'),
     countryOperation: '=',
     appVersionOperation: '=',
     channelOperation: '=',
     tags: ['默认'],
     colNum: 12,
     hideNormal: false,
     ghPlatform: '1',
     productId: 42,
     user: 1,
   };

   async componentDidMount() {
     this.getCountryAndAppVersionAndChannelList();
   }

   componentWillReceiveProps(nextProps) {
     if (this.state.productId !== nextProps.productId) {
       this.setState(
         {
           productId: nextProps.productId,
           ghPlatform: '1',
         },
         this.getCountryAndAppVersionAndChannelList,
       );
     }
   }

   getCountryAndAppVersionAndChannelList = async () => {
     const { countryList, appVersionList, channelList } = await getCountryAndAppVersionAndChannel(
       this.state.ghPlatform,
       this.state.productId,
     );
     if (this.props.product === 'tempo') {
       const c = await getTempoChannelList();
       channelList.splice(0, channelList.length, ...c);
     }
     this.setState({
       countryList,
       appVersionList,
       channelList,
     });
   };

   addQuery = () => {
     const {
       selectAppVersion,
       appVersionOperation,
       selectCountry,
       countryOperation,
       selectChannel,
       channelOperation,
       tags,
       user,
     } = this.state;
     let params = '';
     if (!selectAppVersion && !selectCountry) {
       params = '默认';
     }
     if (selectCountry && countryOperation) {
       params += `${countryOperation} '${selectCountry}'`;
     }
     params += '||';
     if (selectAppVersion && appVersionOperation) {
       params += `${appVersionOperation} '${versionNumber(selectAppVersion)}'`;
     }
     params += '||';
     if (user) {
       params += `${userObj[user]}`;
     }
     params += '||';
     if (selectChannel && channelOperation) {
       params += `${channelOperation} '${selectChannel}'`;
     }
     if (tags.includes(params)) {
       message.error('该条件已经存在');
     } else {
       const newTags = _.clone(tags);
       newTags.push(params);
       this.setState({
         tags: newTags,
       });
     }
   };

   onCheck = (e) => {
     const { tags } = this.state;
     let newTags = _.clone(tags);
     if (e) {
       if (!newTags.includes('= \'中东\'||||')) {
         newTags.push('= \'中东\'||||');
       }
       if (!newTags.includes('= \'印度\'||||')) {
         newTags.push('= \'印度\'||||');
       }
     } else {
       newTags = newTags.filter(i => i !== '= \'中东\'||||' && i !== '= \'印度\'||||');
     }
     this.setState({
       tags: newTags,
     });
   };

   dismiss = (item) => {
     let { tags } = this.state;
     tags = tags.filter(i => i !== item);
     this.setState({
       tags,
     });
   };

    getUserType=(value) => {
      this.setState({ user: value });
    }

    render() {
      const colorArr = ['#2db7f5', '#87d068', '#108ee9', '#f50'];
      const {
        countryList,
        channelList,
        appVersionList,
        selectAppVersion,
        selectChannel,
        selectCountry,
        countryOperation,
        appVersionOperation,
        channelOperation,
        startDate,
        endDate,
        tags,
        hideNormal,
        colNum,
        ghPlatform,
        user,
      } = this.state;
      const { app, product, productId } = this.props;
      const { graphDefinition } = app;
      return (
        <div>
          {BreadcrumbMenu()}
          <RangePicker
            value={[startDate, endDate]}
            onChange={value => this.setState({ startDate: value[0], endDate: value[1] })}
            style={{ marginBottom: 10 }}
          />
          <Select
            style={{ marginLeft: 10, width: 120 }}
            value={ghPlatform}
            onChange={value => this.setState({ ghPlatform: value }, this.getCountryAndAppVersionAndChannelList)}
          >
            <Select.Option key="1" value="1">
             Android
            </Select.Option>
          </Select>

          <Switch
            style={{ float: 'right' }}
            onChange={e => this.setState({ colNum: e ? 24 : 12 })}
            defaultChecked={false}
            checkedChildren="大图"
            unCheckedChildren="小图"
          />
          <Switch
            style={{ float: 'right', marginRight: 5 }}
            checkedChildren="隐藏默认"
            unCheckedChildren="显示默认"
            onChange={e => this.setState({ hideNormal: e })}
          />
          <Switch
            style={{ float: 'right', marginRight: 5 }}
            checkedChildren="常用地区"
            unCheckedChildren="常用地区"
            onChange={this.onCheck}
          />
          <Collapse defaultActiveKey={['1']}>
            <Collapse.Panel
              header={
                <div>
                  <FormattedMessage id="common.search" />
                </div>
              }
              key="1"
            >
              <div className={classNames(styles.circle, styles.textPrimary)} />
              <Select {...selectAttr} value={countryOperation} onChange={e => this.setState({ countryOperation: e })}>
                {literalOptions}
              </Select>
              <Select
                {...selectAttr}
                placeholder="地区"
                value={selectCountry}
                onChange={e => this.setState({ selectCountry: e })}
              >
                <Select.Option key="中东" value="中东">
                 中东
                </Select.Option>
                <Select.Option key="独联体" value="独联体">
                 独联体
                </Select.Option>
                <Select.Option key="欧美" value="欧美">
                 欧美
                </Select.Option>
                <Select.Option key="拉美" value="拉美">
                 拉美
                </Select.Option>
                <Select.Option key="东南亚十国" value="东南亚十国">
                 东南亚十国
                </Select.Option>
                <Select.Option key="俄语区" value="俄语区">
                 俄语区
                </Select.Option>
                {_.map(countryList, item => (
                  <Select.Option key={item.key} value={item.value}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
              <div className={classNames(styles.circle, styles.textGreen)} />
              <Select
                {...selectAttr}
                value={appVersionOperation}
                onChange={e => this.setState({ appVersionOperation: e })}
              >
                {numberOptions}
              </Select>
              <Select
                placeholder="版本"
                {...selectAttr}
                value={selectAppVersion}
                onChange={value => this.setState({ selectAppVersion: value })}
              >
                {_.map(appVersionList, item => (
                  <Select.Option key={item.key} value={item.value}>
                    {item.value}
                  </Select.Option>
                ))}
              </Select>
              <Select
                style={{ marginLeft: 10, width: 120 }}
                value={user}
                onChange={this.getUserType}
              >
                {userTypeArr.map(i => (<Select.Option key={i.key} value={i.key}>
                  {i.value}
                </Select.Option>))}


              </Select>
              <div className={classNames(styles.circle, styles.textPink)} />
              <Select {...selectAttr} value={channelOperation} onChange={e => this.setState({ channelOperation: e })}>
                {numberOptions}
              </Select>
              <Select
                placeholder="渠道"
                {...selectAttr}
                value={selectChannel}
                onChange={value => this.setState({ selectChannel: value })}
              >
                {_.map(channelList, item => (
                  <Select.Option key={item.key} value={item.value}>
                    {item.key}
                  </Select.Option>
                ))}
              </Select>
              <Button type="primary" onClick={this.addQuery}>
               添加
              </Button>
            </Collapse.Panel>
          </Collapse>
          <div style={{ margin: '10px 0' }}>
            {tags.map((x, index) => (
              <Tag key={x} closable color={colorArr[index % 4]} onClose={() => this.dismiss(x)}>
                {x}
              </Tag>
            ))}
          </div>
          <Row>
            <ChartView
              colNum={colNum}
              title="新增设备数(该数据不支持区分新老用户)"
              graphDefinition={graphDefinition}
              graphName="新增设备数"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.deviceAddSQL}
              tags={tags}
              chartFunc="deviceAdditionData"
              hideNormal={hideNormal}
              product_type="mast"
            />
            <ChartView
              colNum={colNum}
              title="新增活跃设备数(该数据不支持区分新老用户)"
              graphDefinition={graphDefinition}
              graphName="新增活跃设备数"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.deviceAddActSQL}
              tags={tags}
              chartFunc="deviceAddActSQL"
              hideNormal={hideNormal}
              product_type="mast"
            />


            <ChartView
              colNum={colNum}
              title="DAU(该数据不支持区分新老用户)"
              graphDefinition={graphDefinition}
              graphName="DAU"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.DAU}
              tags={tags}
              chartFunc="DAU"
              product_type="mast"
              hideNormal={hideNormal}
            />
            <ChartView
              colNum={colNum}
              title="次日留存"
              graphDefinition={graphDefinition}
              graphName="次日留存"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.staySQL}
              tags={tags}
              chartFunc="stayData"
              hideNormal={hideNormal}
              product_type="mast"
              suffix
            />
            <ChartView
              colNum={colNum}
              title="老用户留存(该数据不支持区分新老用户)"
              graphDefinition={graphDefinition}
              graphName="老用户留存"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.oldUserActStaySQL}
              tags={tags}
              chartFunc="oldStayData"
              hideNormal={hideNormal}
              product_type="mast"
            />
            <ChartView
              colNum={colNum}
              title="制作率"
              graphDefinition={graphDefinition}
              graphName="制作率"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.madeRateOfPVSQL}
              tags={tags}
              chartFunc="madeRateData"
              hideNormal={hideNormal}
              product_type="mast"
              selectList={[
                {
                  name: 'PV',
                  value: 'PV',
                },
                {
                  name: 'UV',
                  value: 'UV',
                },
              ]}
            />
            <ChartView
              colNum={colNum}
              title="导出率"
              graphDefinition={graphDefinition}
              graphName="导出率"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.exportRateOfPVSQL}
              tags={tags}
              chartFunc="exportRateDataOfMast"
              hideNormal={hideNormal}
              product_type="mast"
              selectList={[
                {
                  name: 'PV',
                  value: 'PV',
                },
                {
                  name: 'UV',
                  value: 'UV',
                },
              ]}
            />
            <ChartView
              colNum={colNum}
              title="分享率"
              graphDefinition={graphDefinition}
              graphName="分享率"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.shareRateOfPVSQL}
              tags={tags}
              chartFunc="shareRateData"
              hideNormal={hideNormal}
              product_type="mast"
              selectList={[
                {
                  name: 'PV',
                  value: 'PV',
                },
                {
                  name: 'UV',
                  value: 'UV',
                },
              ]}
            />
            <ChartView
              colNum={colNum}
              title="首页曝光率"
              graphDefinition={graphDefinition}
              graphName="首页曝光率"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.homeExposeSQL}
              tags={tags}
              chartFunc="homeExposeData"
              hideNormal={hideNormal}
              product_type="mast"

            />
            <ChartView
              colNum={colNum}
              title="预览页转化率"
              graphDefinition={graphDefinition}
              graphName="预览页转化率"
              startDate={startDate}
              endDate={endDate}
              ghPlatform={ghPlatform}
              sql={sqlTemplate.prePageExpOfUVSQL}
              tags={tags}
              chartFunc="prePageExpData"
              hideNormal={hideNormal}
              product_type="mast"
              selectList={[
                {
                  name: 'PV',
                  value: 'PV',
                },
                {
                  name: 'UV',
                  value: 'UV',
                },
              ]}
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
  app: PropTypes.object,
};
export default connect(({ app }) => ({ app }))(Index);
