import React, { useState, useEffect } from 'react';
import {
  Transfer, Modal, Input,
} from 'antd';
import { filterString, sortStringBySim } from '../../../../../utils/utils';

export default ({
  keywordList,
  setKeywordSelect,
  selectList,
  key,
}) => {
  const [showListModal, setShowListModal] = useState(false);
  const [targetKeys, setTargetKeys] = useState(selectList || []);
  const [selectedKeys, setSelectedKeys] = useState(selectList || []);
  const [selectedList, setSelectList] = useState([]);
  const [notSelectList, setNotSelectList] = useState([]);
  const [canUseKeywordDataList, setCanUseKeywordDataList] = useState(keywordList);
  const [totalList, setTotalList] = useState([]);
  const [keywordDict, setKeywordDict] = useState({});

  const init = () => {
    setCanUseKeywordDataList(keywordList);
    setTargetKeys(selectList || []);
    setSelectedKeys(selectList || []);
    setTotalList(keywordList);
    const dictTemp = {};
    keywordList.forEach((e) => {
      dictTemp[e.key] = e;
    });
    setKeywordDict(dictTemp);
  };

  const handleOk = async () => {
    setKeywordSelect(targetKeys);
    setShowListModal(false);
  };
  const handleCancel = async () => {
    setShowListModal(false);
  };
  const showAdd = () => {
    setShowListModal(true);
  };
  const listOpts = {
    visible: showListModal,
    width: 700,
    onCancel: handleCancel,
    onOk: handleOk,
  };
  const handleChange = (keyList) => {
    setTargetKeys(keyList);
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
    init();
  }, [showListModal]);
  const filterOption = () => true;
  return <>
    <Input key={key} onClick={showAdd} style={{ marginRight: 10, marginLeft: 10, width: 150 }} value={selectList && selectList.length > 0 ? `已选中${selectList.length}个` : '请选择'} />
    <Modal {...listOpts}>
      <Transfer
        key = {key + 4}
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
    </Modal>
  </>;
};
