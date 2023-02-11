import React from 'react';
import { Table, Typography } from 'antd';
import { getBeforePreRepayTableColumns, LoanTableColumns } from '@/contants';

const BeforePreRepayTable = ({ tableData }: { tableData: LoanTableColumns[] }) => {
  return (
    <>
      <Typography.Title level={4}>提前还款前</Typography.Title>
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

export default BeforePreRepayTable;
