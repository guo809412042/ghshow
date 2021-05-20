import React, { useState, useEffect } from 'react';
import {
  Button, Form, Input, Modal, Transfer, message,
} from 'antd';
import { saveClass, getClass } from '../services';
import { getData } from '../../../../../utils/request';
import { filterString, sortStringBySim } from '../../../../../utils/utils';

const { Item: FormItem } = Form;
export default ({
  refreshTable, buttonName, keywordSelectInit, classNameInit, dataId, keywordListSql,
}) => {
  const [showListModal, setShowListModal] = useState(false);
  const [className, setClassName] = useState(classNameInit);
  const [targetKeys, setTargetKeys] = useState(keywordSelectInit || []);
  const [canUseKeywordDataList, setCanUseKeywordDataList] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(keywordSelectInit || []);
  const [keywordDict, setKeywordDict] = useState({});
  const [selectedList, setSelectList] = useState([]);
  const [notSelectList, setNotSelectList] = useState([]);
  const [totalList, setTotalList] = useState([]);

  const initClassList = async () => {
    const res = await getClass(6);
    const keywordRes = await getData(keywordListSql);
    const effectiveDataList = keywordRes.filter(e => !!e.key_word);
    const disableKeywordListList = res.data.map(e => e.keyword.split(','));
    const disableKeywordList = disableKeywordListList.reduce((x, y) => x.concat(y));
    const canUseKeywordList = effectiveDataList.filter(e => !disableKeywordList.includes(e.key_word));
    const notSelectListTemp = [];
    canUseKeywordList.forEach((e) => {
      notSelectListTemp.push({ key: e.key_word, title: e.key_word });
    });
    setNotSelectList(notSelectListTemp);
    const selectedListTemp = [];
    if (keywordSelectInit && keywordSelectInit.length > 0) {
      keywordSelectInit.forEach((e) => {
        canUseKeywordList.push({ key_word: e });
        selectedListTemp.push({ key: e, title: e });
      });
    }
    setSelectList(selectedListTemp);
    const dictTemp = {};
    const tempList = canUseKeywordList.map((e) => {
      dictTemp[e.key_word] = { key: e.key_word, title: e.key_word };
      return { key: e.key_word, title: e.key_word };
    });
    setKeywordDict(dictTemp);
    setCanUseKeywordDataList(tempList);
    setTotalList(tempList);
  };

  const showAdd = () => {
    setShowListModal(true);
  };
  const handleOk = async () => {
    if (targetKeys.length === 0 || !className) {
      message.warning('分类名称或者关键字不能为空');
      return true;
    }
    await saveClass({
      dataId, productId: 6, className, keyword: selectedKeys.join(','),
    });
    await refreshTable();
    await initClassList();
    setShowListModal(false);
  };
  const handleCancel = async () => {
    setShowListModal(false);
  };
  const handleChange = (keyList) => {
    setTargetKeys(keyList);
  };

  const formItemLayoutTXT = {
    labelCol: { span: 4 },
    wrapperCol: { span: 20 },
  };
  const listOpts = {
    visible: showListModal,
    width: 700,
    onCancel: handleCancel,
    onOk: handleOk,
  };

  const handleSearch = (dir, value) => {
    if (!value) {
      setCanUseKeywordDataList(selectedList.concat(notSelectList));
      return true;
    }
    let res;
    if (dir === 'left') {
      res = filterString(value, notSelectList, 'key');
      res = res.concat(selectedList);
    } else {
      res = filterString(value, selectedList, 'key');
      setSelectedKeys(sortStringBySim(value, selectedKeys));
      res = res.concat(notSelectList);
    }
    setCanUseKeywordDataList(res);
  };

  const handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    const selectKeyList = targetSelectedKeys.concat(sourceSelectedKeys);
    setTargetKeys(selectKeyList);
    setSelectedKeys(selectKeyList);
    setSelectList(selectKeyList.map(e => keywordDict[e]));
    setNotSelectList(totalList.filter(e => !selectKeyList.includes(e.key)));
  };

  useEffect(() => {
    initClassList();
  }, [showListModal]);

  const filterOption = () => true;

  return <div>
    <Button type="primary" onClick={showAdd}>{buttonName}</Button>
    <Modal {...listOpts}>
      <Form>
        <FormItem name="className" {...formItemLayoutTXT} label="分类名称" rules={[{ required: true }]}>
          <Input onChange={(event) => { setClassName(event.target.value); }} defaultValue={classNameInit} />
        </FormItem>
        <FormItem name="keyword" label="关键字" rules={[{ required: true }]}>
          <Transfer
            dataSource={canUseKeywordDataList}
            titles={['可添加', '已添加']}
            targetKeys={targetKeys}
            selectedKeys={selectedKeys}
            render={item => item.title}
            onChange={handleChange}
            style={{ marginBottom: 16 }}
            listStyle={{ width: 300, height: 500 }}
            onSearch={handleSearch}
            onSelectChange={handleSelectChange}
            filterOption={filterOption}
            showSearch
          />
        </FormItem>
      </Form>
    </Modal>
  </div>;
};
