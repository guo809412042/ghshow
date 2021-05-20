import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Query from '../components/Query';
import CardView from './components/CardView';
import CampaignNameQuery from '../components/CampaignNameQuery';
import { getData } from '../../../utils/request';
import { campaignListSql } from './sqlTemplate';
// import RadioView from './components/RadioView';
import CoreView from './components/CoreView';
import RemainView from './components/RemainView';

const Index = () => {
  const [onSearchValues, setOnSearchValues] = useState({ country: [] });
  const [selectCampaign, setCampainName] = useState(undefined);
  const [campaignList, setCampaignList] = useState([]);
  // const [radioValue, setRadioValue] = useState('all');
  const [currentKeyIndex, setCurrentKeyIndex] = useState(0);
  const [tags, setTags] = useState([]);
  const onSearch = async (values) => {
    setOnSearchValues(values);
  };
  const getCampainList = async () => {
    const res = await getData(campaignListSql);
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
      <Query product="15" onSearch={onSearch} />
      <CardView query={onSearchValues} />
      <CampaignNameQuery
        setCampainName={setCampainName}
        selectCampaign={selectCampaign}
        setTags={setTags}
        tags={tags}
        campaignList={campaignList}
        currentKeyIndex={currentKeyIndex}
        setCurrentKeyIndex={setCurrentKeyIndex}
      />
      {/* <RadioView radioValue={radioValue} setRadioValue={setRadioValue} /> */}
      <CoreView
        currentKeyIndex={currentKeyIndex}
        setCurrentKeyIndex={setCurrentKeyIndex}
        radioValue="all"
        onSearchValues={onSearchValues}
        tags={tags}
        selectCampaign={selectCampaign}
        setTags={setTags}
        closeClick={closeClick}
      />
      <RemainView
        currentKeyIndex={currentKeyIndex}
        setCurrentKeyIndex={setCurrentKeyIndex}
        radioValue="all"
        onSearchValues={onSearchValues}
        tags={tags}
        selectCampaign={selectCampaign}
        setTags={setTags}
        closeClick={closeClick}
      />
    </div>
  );
};

export default Index;
