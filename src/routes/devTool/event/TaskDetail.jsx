import React, { Component } from 'react';
import {
  Select, Card, Steps, Button, Row, Col, Descriptions, Popconfirm,
} from 'antd';
import { connect } from 'dva';
import jsCookie from 'js-cookie';

import AddTaskEvent from './components/AddTaskEvent';
import EditTaskEvent from './components/EditTaskEvent';
import TaskEventList from './components/TaskEventList';
import UploadTaskEventFile from './components/UploadTaskEventFile';

import { getEventTaskDetail, getParam, nextEventTaskStatus } from '../../eventTask/services';

class TaskDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchEventName: null,
      taskInfo: {},
      right: false,
      payloadList: [],
      objectList: [],
      actionList: [],
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.init(parseInt(this.props.match.params.taskId, 10));
  }

  componentWillReceiveProps(nextProps) {
    const {
      match: {
        params: { taskId: oldTaskId },
      },
    } = this.props;
    const {
      match: {
        params: { taskId: newTaskId },
      },
    } = nextProps;
    if (oldTaskId !== newTaskId) {
      console.log('componentWillReceiveProps');
      this.init(newTaskId);
    }
  }

  init = async (taskId) => {
    const res = await getEventTaskDetail(taskId);
    const nowEmail = jsCookie.get('email');

    if (res.code === 20000) {
      // 判断对应的权利
      const data = res.data;
      let right = false;
      if (data.status === 0 && data.designer_email === nowEmail) {
        right = true;
      }
      if (data.status === 1) {
        if ([0, 2].includes(data.platform) && data.ios_email === nowEmail) {
          right = true;
        }
        if ([0, 1].includes(data.platform) && data.android_email === nowEmail) {
          right = true;
        }
      }
      if (data.status === 2 && data.tester_email === nowEmail) {
        right = true;
      }

      this.setState({
        taskInfo: res.data,
        right,
      });

      this.initFormFields({
        product: res.data.product_id,
        version: res.data.version,
        task_id: res.data.id,
        // data_type: 1
      });
      this.getList();
      this.initData();
      this.initOnce();
    }

    const params = await getParam();
    console.log(params);

    if (params.code === 20000) {
      const payloadList = [];
      const objectList = [];
      const actionList = [];

      params.data.forEach((item) => {
        if (item.type === 1) {
          payloadList.push(item);
        }
        if (item.type === 2) {
          objectList.push(item);
        }
        if (item.type === 3) {
          actionList.push(item);
        }
      });
      this.setState({
        payloadList,
        objectList,
        actionList,
      });
    }
  };

  initFormFields = (formData) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'devToolEvent/saveFormFields',
      payload: {
        data: formData,
      },
    });
  };

  initData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'devToolEvent/initOtherData' });
  };

  initOnce = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'devToolEvent/initOnce' });
  };

  getList = async () => {
    const { dispatch } = this.props;
    dispatch({ type: 'devToolEvent/listInit' });
    // dispatch({ type: 'devToolEvent/getMyEvent' });
  };

  nextStep = async () => {
    await nextEventTaskStatus(this.state.taskInfo.id);
    console.log('nextStep');
    this.init(parseInt(this.props.match.params.taskId, 10));
  };

  checkData = () => {
    this.props.history.push(`/gh/event_task/task_result/${this.state.taskInfo.id}`);
  };

  render() {
    const {
      searchEventName, taskInfo, right, payloadList, objectList, actionList,
    } = this.state;
    const {
      dispatch,
      devToolEvent: {
        listData,
        insertData,
        modifyData,
        listLoading,
        formFields,

        classList,
        versionList,
        appVersionList,
        moduleList,
        moduleListAll,
        tagList,
        androidDevList,
        iosDevList,
        myEventList,
        IDpageDict,
        IDpageList,
        IDmoduleDict,
        IDmoduleList,
        IDcontrolDict,
        IDcontrolList,
        IDactionDict,
        IDactionList,
        devList,
        employee,
      },
    } = this.props;
    const comProps = {
      taskInfo,
      listData,
      searchEventName,
      listLoading,
      formFields,
      IDpageDict,
      IDpageList,
      IDmoduleDict,
      IDmoduleList,
      IDcontrolDict,
      IDcontrolList,
      IDactionDict,
      IDactionList,
      classList,
      versionList,
      appVersionList,
      moduleList,
      moduleListAll,
      tagList,
      androidDevList,
      iosDevList,
      devList,
      myEventList,
      payloadList,
      objectList,
      actionList,
      employee,

      dispatch,
      initData: this.initData,
      getMyEvent: this.getMyEvent,
      reFresh: this.getList,
    };
    return (
      <div>
        <Card>{`【${taskInfo.task_name}】详细情况`}</Card>
        <br />
        <Card>
          <Row>
            <Col span={20}>
              <Steps current={taskInfo.status + 1}>
                <Steps.Step title="立项" />
                <Steps.Step title="埋点方案设计" />
                <Steps.Step title="前端开发" />
                <Steps.Step title="埋点测试" />
                <Steps.Step title="埋点上线" />
              </Steps>
            </Col>
            <Col span={4}>
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {right && (
                  <Popconfirm
                    title="确定进入下一步吗？操作不可逆"
                    onConfirm={this.nextStep}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button>进入下一步骤</Button>
                  </Popconfirm>
                )}
                <Button onClick={this.checkData}>埋点线上数据</Button>
              </div>
            </Col>
          </Row>
        </Card>
        <br />
        <Card>
          <Descriptions bordered>
            <Descriptions.Item label="产品名称">{taskInfo.product_name}</Descriptions.Item>
            <Descriptions.Item label="平台">{['ios', 'android', 'ios/android'][taskInfo.platform]}</Descriptions.Item>
            <Descriptions.Item label="版本">{taskInfo.version}</Descriptions.Item>
            <Descriptions.Item label="任务文档" span={3}>
              {taskInfo.document_url}
            </Descriptions.Item>
            <Descriptions.Item label="埋点设计人员">{taskInfo.designer_email}</Descriptions.Item>
            <Descriptions.Item label="开发人员">
              {taskInfo?.ios_email && `ios: ${taskInfo.ios_email}`}
              <br />
              {taskInfo?.android_email && `android: ${taskInfo.android_email}`}
            </Descriptions.Item>
            <Descriptions.Item label="测试人员">{taskInfo.tester_email}</Descriptions.Item>
            <Descriptions.Item label="备注" span={3}>
              {taskInfo.remark}
            </Descriptions.Item>
          </Descriptions>
          {/* <Query {...comProps} /> */}
          <br />
          <div style={{ display: 'flex' }}>
            {taskInfo.status === 0 && right && (
              <>
                <AddTaskEvent {...comProps} />
                &nbsp;&nbsp;
                <EditTaskEvent {...comProps} title="编辑事件" />
                &nbsp;&nbsp;
                <UploadTaskEventFile taskInfo={taskInfo} reFresh={comProps.reFresh} />
                &nbsp;&nbsp;
                <a
                  href="https://quvideo.feishu.cn/sheets/shtcn2yJNf27HZLKgTWsMKqoDBd"
                  target="_blank"
                >
                  埋点文档规范下载
                </a>
              </>
            )}
          </div>
        </Card>
        <br />
        <Card title="新增事件" bodyStyle={{ padding: 0 }}>
          <TaskEventList {...comProps} listData={insertData} inTable listType="insert" />
        </Card>
        <br />
        <Card title="修改事件" bodyStyle={{ padding: 0 }}>
          <TaskEventList {...comProps} listData={modifyData} inTable listType="modify" />
        </Card>
      </div>
    );
  }
}

export default connect(({ devToolEvent }) => ({ devToolEvent }))(TaskDetail);
