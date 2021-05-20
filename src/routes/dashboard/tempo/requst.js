import { getData } from '../../../utils/request';
import { tempoChannelSQL } from './const';

export const getTempoChannelList = () =>
  getData(tempoChannelSQL).then(res =>
    res.map(item => ({
      key: item.channel,
      value: item.channel
    }))
  );
