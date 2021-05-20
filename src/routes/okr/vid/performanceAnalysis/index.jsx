import React, { useEffect } from 'react';
import { Row, Radio } from 'antd';
import { cardData } from './const';
import ChartCardView from './components/ChartCardView';

export default ((props) => {
  const { product } = props.match.params;
  const [template, setTemplateType] = React.useState(() => ('local_tmpl'));
  useEffect(() => {
    setTemplateType(product === 'vid' ? null : 'local_tmpl');
  }, [product]);
  return (
    <div style={{ padding: 10 }}>
      <>
        {
          ['mast'].includes(product) && <Radio.Group value={template} style={{ marginBottom: '16px' }} onChange={e => setTemplateType(e.target.value)}>
            <Radio.Button value="local_tmpl">本地模版</Radio.Button>
            <Radio.Button value="cloud_tmpl">云端模版</Radio.Button>
          </Radio.Group>
        }
        <Row gutter={16}>
          {cardData.map((v, index) => {
            if (v.unit === 'kb' && template === 'cloud_tmpl') {
              v.unit = 'mb';
            } else if (v.unit === 'mb' && template === 'local_tmpl') {
              v.unit = 'kb';
            }
            return <ChartCardView product={product} templateType={product === 'vid' ? null : template} {...v} key={index}/>;
          })}
        </Row>
      </>
    </div>
  );
});
