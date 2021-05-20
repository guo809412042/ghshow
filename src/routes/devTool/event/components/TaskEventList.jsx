import React from 'react';
import { Select, Table, Tag } from 'antd';
import jsCookie from 'js-cookie';

import Del from './Del';
import EditTaskEvent from './EditTaskEvent';

import { baseColumns } from './TableColumn';
import { STATEMAP, STATEMAPColor } from '../const';

import { updataEvent } from '../service';

// ALTER TABLE `gh`.`gh_event_manage`
// ADD COLUMN `tester_email` varchar(255) NULL COMMENT '测试人员' AFTER `task_id`;

//  以下两种状态不显示编辑和删除
const hideHandle = [1, 2];

const List = ({
  inTable,
  listType,
  taskInfo,
  listData,
  searchEventName,
  listLoading,
  androidDevList,
  iosDevList,
  appVersionList,
  tagList,
  formFields,
  IDpageDict,
  IDpageList,
  IDmoduleDict,
  IDmoduleList,
  IDcontrolDict,
  IDcontrolList,
  IDactionDict,
  IDactionList,
  reFresh,
  myEventList,
  devList,
  employee,
}) => {
  const changeDeveloperState = (sqlKey, id) => async (e) => {
    const res = await updataEvent({
      id,
      [sqlKey]: e,
    });
    reFresh();
  };
  const columns = [
    {
      title: '版本',
      dataIndex: 'version',
      fixed: 'left',
      width: 100,
    },
    ...baseColumns.map(item => ({
      ...item,
      title: item.title === '业务描述' ? '触发条件' : item.title,
    })),
    {
      title: '安卓负责人',
      dataIndex: 'android_dev',
      width: 160,
      render: (text, row) => (text ? (
        <span>
          <Select placeholder="请选择android开发人员" value={text} style={{ width: 150 }} onChange={changeDeveloperState('android_dev', row.id)}>
            {employee
              .filter(i => i.job_type === 2)
              .map(e => (
                <Select.Option value={e.email} key={e.id}>
                  {e.name}
                </Select.Option>
              ))}
          </Select>：<Tag color={STATEMAPColor[row.android_state]}>{STATEMAP[row.android_state]}</Tag>
        </span>
      ) : <Select placeholder="请选择android开发人员" style={{ width: 150 }} onChange={changeDeveloperState('android_dev', row.id)}>
        {employee
          .filter(i => i.job_type === 2)
          .map(e => (
            <Select.Option value={e.email} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
      </Select>),
    },
    {
      title: 'iOS负责人',
      dataIndex: 'ios_dev',
      width: 160,
      render: (text, row) => (text ? (
        <span>
          <Select placeholder="请选择ios开发人员" value={text} style={{ width: 150 }} onChange={changeDeveloperState('ios_dev', row.id)}>
            {employee
              .filter(i => i.job_type === 1)
              .map(e => (
                <Select.Option value={e.email} key={e.id}>
                  {e.name}
                </Select.Option>
              ))}
          </Select>：<Tag color={STATEMAPColor[row.ios_state]}>{STATEMAP[row.ios_state]}</Tag>
        </span>
      ) : <Select placeholder="请选择ios开发人员" style={{ width: 150 }} onChange={changeDeveloperState('ios_dev', row.id)}>
        {employee
          .filter(i => i.job_type === 1)
          .map(e => (
            <Select.Option value={e.email} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
      </Select>),
    },
    {
      title: '测试负责人',
      dataIndex: 'tester_email',
      width: 160,
      render: (text, row) => ((text || taskInfo.tester_email) ? (
        <span>
          <Select placeholder="请选择测试人员" value={text || taskInfo.tester_email} style={{ width: 150 }} onChange={changeDeveloperState('tester_email', row.id)}>
            {employee
              .filter(i => i.job_type === 3)
              .map(e => (
                <Select.Option value={e.email} key={e.id}>
                  {e.name}
                </Select.Option>
              ))}
          </Select>：<Tag color={STATEMAPColor[row.ios_state]}>{STATEMAP[row.ios_state]}</Tag>
        </span>
      ) : <Select placeholder="请选择测试人员" style={{ width: 150 }} onChange={changeDeveloperState('tester_email', row.id)}>
        {employee
          .filter(i => i.job_type === 3)
          .map(e => (
            <Select.Option value={e.email} key={e.id}>
              {e.name}
            </Select.Option>
          ))}
      </Select>),
      // render: () => taskInfo.tester_email,
    },
    {
      title: '操作',
      dataIndex: 'handle',
      width: 200,
      fixed: 'right',
      render: (text, row) => {
        const nowEmail = jsCookie.get('email');
        if (taskInfo.status === 0 && nowEmail === taskInfo.designer_email) {
          return (
            <>
              <EditTaskEvent
                listType={listType}
                inTable={inTable}
                taskInfo={taskInfo}
                key={`${row.id}Copy`}
                record={row}
                title="修改"
                formFields={formFields}
                appVersionList={appVersionList}
                tagList={tagList}
                androidDevList={androidDevList}
                iosDevList={iosDevList}
                reFresh={reFresh}
                IDpageDict={IDpageDict}
                IDpageList={IDpageList}
                IDmoduleDict={IDmoduleDict}
                IDmoduleList={IDmoduleList}
                IDcontrolDict={IDcontrolDict}
                IDcontrolList={IDcontrolList}
                IDactionDict={IDactionDict}
                IDactionList={IDactionList}
              />
              {hideHandle.includes(Number(row.android_state)) || hideHandle.includes(Number(row.ios_state)) ? null : (
                <Del key={`${row.id}del`} id={row.id} callback={reFresh} />
              )}
            </>
          );
        }
        if (taskInfo.status === 1) {
          const options = [];
          if (nowEmail === taskInfo.ios_email) {
            options.push(
              <div>
                ios：
                <Select
                  defaultValue={row.ios_state}
                  size="small"
                  style={{ width: 100 }}
                  onChange={changeDeveloperState('ios_state', row.id)}
                >
                  <Select.Option value={0}>未开始</Select.Option>
                  <Select.Option value={1}>开发完成</Select.Option>
                  <Select.Option value={2} disabled>
                    测试完成
                  </Select.Option>
                </Select>
              </div>,
              <br />,
            );
          }
          if (nowEmail === taskInfo.android_email) {
            options.push(
              <div>
                android：
                <Select
                  defaultValue={row.android_state}
                  size="small"
                  style={{ width: 100 }}
                  onChange={changeDeveloperState('android_state', row.id)}
                >
                  <Select.Option value={0}>未开始</Select.Option>
                  <Select.Option value={1}>开发完成</Select.Option>
                  <Select.Option value={2} disabled>
                    测试完成
                  </Select.Option>
                </Select>
              </div>,
            );
          }

          return options;
        }

        if (taskInfo.status === 2 && nowEmail === taskInfo.tester_email) {
          // ios
          if (taskInfo.platform === 0) {
            return (
              <div>
                ios：
                <Select
                  defaultValue={row.ios_state}
                  size="small"
                  style={{ width: 100 }}
                  onChange={changeDeveloperState('ios_state', row.id)}
                >
                  <Select.Option value={0} disabled>
                    未开始
                  </Select.Option>
                  <Select.Option value={1}>开发完成</Select.Option>
                  <Select.Option value={2}>测试完成</Select.Option>
                </Select>
              </div>
            );
          }
          if (taskInfo.platform === 1) {
            return (
              <div>
                android：
                <Select
                  defaultValue={row.android_state}
                  size="small"
                  style={{ width: 100 }}
                  onChange={changeDeveloperState('android_state', row.id)}
                >
                  <Select.Option value={0} disabled>
                    未开始
                  </Select.Option>
                  <Select.Option value={1}>开发完成</Select.Option>
                  <Select.Option value={2}>测试完成</Select.Option>
                </Select>
              </div>
            );
          }
        }
      },
    },
  ];
  const TableProps = {
    columns,
    loading: listLoading,
    pagination: { showSizeChanger: true },
    scroll: { x: 2300 },
    dataSource: searchEventName
      ? listData.filter(item => `${item.event_id}-${item.event_name}-${item.id}` === searchEventName)
      : listData,
    rowKey: 'id',
  };
  return <Table {...TableProps} style={{ marginTop: '15px' }} />;
};

export default List;
