/*
 * @Date: 2020-05-12 10:59:50
 * @LastEditors: dongqi.zhao
 * @LastEditTime: 2021-04-12 10:39:06
 * @Email: dongqi.zhao@quvideo.com
 * @Copyright(c): QuVideo F2E Team
 */
import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Query from './Query';
import ClientCardView from './ClientCardView';
import CampaignNameQuery from './CampaignNameQuery';
import { getData } from '../../../utils/request';
import { clientCampaignListSql } from './sqlTemplate';
import ClientCoreView from './ClientCoreView';
import ClientRemainView from './ClientRemainView';
import ClientBehaviorAnalysis from './ClientBehaviorAnalysis';
import { createSqlWhere } from '../../../utils/utils';

export default ({
  product, noIos = false, noAndroid = false, database = 'cltusr',
}) => {
  const [onSearchValues, setOnSearchValues] = useState({ country: [] });
  const [selectCampaign, setCampainName] = useState(undefined);
  const [campaignList, setCampaignList] = useState([]);
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const onSearch = (values) => {
    setOnSearchValues(values);
  };
  const getCampainList = async () => {
    const res = await getData(
      createSqlWhere({
        sql: clientCampaignListSql,
        product,
        database,
      }),
    );
    setCampaignList(res);
  };
  const closeClick = async (v, index) => {
    let newTags = _.clone(tags);
    newTags = newTags.slice(0, index);
    setTags(newTags);
    setCurrentKeyIndex(Number(index));
  };
  useEffect(() => {
    getCampainList();
  }, []);
  return (
    <div>
      <Query product={product} onSearch={onSearch} noIos={noIos} noAndroid={noAndroid} database={database} />
      <ClientCardView query={onSearchValues} product={product} database={database} />
      <CampaignNameQuery
        setCampainName={setCampainName}
        selectCampaign={selectCampaign}
        setTags={setTags}
        tags={tags}
        campaignList={campaignList}
        currentKeyIndex={currentKeyIndex}
        setCurrentKeyIndex={setCurrentKeyIndex}
        database={database}
      />
      <ClientCoreView
        currentKeyIndex={currentKeyIndex}
        setCurrentKeyIndex={setCurrentKeyIndex}
        onSearchValues={onSearchValues}
        tags={tags}
        selectCampaign={selectCampaign}
        setTags={setTags}
        closeClick={closeClick}
        product={product}
        database={database}
      />
      <ClientRemainView
        currentKeyIndex={currentKeyIndex}
        setCurrentKeyIndex={setCurrentKeyIndex}
        onSearchValues={onSearchValues}
        tags={tags}
        selectCampaign={selectCampaign}
        setTags={setTags}
        closeClick={closeClick}
        product={product}
        database={database}
      />
      {product === 42 && <ClientBehaviorAnalysis
        currentKeyIndex={currentKeyIndex}
        setCurrentKeyIndex={setCurrentKeyIndex}
        onSearchValues={onSearchValues}
        tags={tags}
        selectCampaign={selectCampaign}
        setTags={setTags}
        closeClick={closeClick}
        product={product}
        database={database}
      />}
    </div>
  );
};
