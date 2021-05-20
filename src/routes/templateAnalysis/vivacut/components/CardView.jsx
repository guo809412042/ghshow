import React from 'react';
import {
  Col, Card, Statistic, Icon,
} from 'antd';

export default ({
  title, pecision = 0.0, value = 0.0, type, setClickType, suffix,
}) => <Col
  span={6}
  style={{ margin: '10px 0' }}
>
  <div
    style={{
      border: '1px solid #d9d9d9',
      cursor: 'pointer',
    }}
    onClick={() => setClickType(type)}
  >
    <Card>
      <Statistic
        title={<p
          style={{ fontSize: 22 }}
        >
          {title}
          <span
            style={{ fontSize: 28, float: 'right', fontWeight: 600 }}
          >{value}{suffix ? '%' : ''}
          </span>
        </p>}
        value={pecision}
        precision={2}
        valueStyle={{ color: pecision > 0 ? '#cf1322' : '#3f8600' }}
        prefix={<Icon type={pecision > 0 ? 'arrow-up' : 'arrow-down'} />}
        suffix="%"
      />
    </Card>
  </div>
</Col>;
