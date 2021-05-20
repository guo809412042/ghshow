import React from 'react';
import SortTable from './SortTable';
import SortDetailTable from './SortDetailTable';
import TagRateTable from './TagRateTable';
import TagDetailTable from './TagDetailTable';

export default () => {
  return (
    <div>
      <SortTable />
      <SortDetailTable />
      <TagRateTable />
      <TagDetailTable />
    </div>
  );
};
