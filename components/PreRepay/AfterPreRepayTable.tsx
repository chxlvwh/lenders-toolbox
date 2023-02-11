import React from 'react';
import { Table, Typography } from 'antd';
import { getBeforePreRepayTableColumns, LoanTableColumns } from '@/contants';

const AfterPreRepayTable = ({ tableData, index }: { tableData: LoanTableColumns[]; index: number }) => {
  return (
    <>
      <Typography.Title level={4}>第 {index + 1} 次提前还款后</Typography.Title>
      <Table
        bordered={true}
        size={'small'}
        showHeader={false}
        columns={getBeforePreRepayTableColumns()}
        dataSource={tableData}
        pagination={false}
      />
    </>
  );
};

export default AfterPreRepayTable;
