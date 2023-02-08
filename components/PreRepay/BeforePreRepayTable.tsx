import React from 'react';
import { Table, Typography } from 'antd';
import { getBeforePreRepayTableColumns, getBeforePreRepayTableData } from '@/contants';
import { IFormProps } from '../SearchForm/SearchForm';

const BeforePreRepayTable = ({ formValues }: { formValues: IFormProps }) => {
  return (
    <>
      <Typography.Title level={4}>提前还款前</Typography.Title>
      <Table
        bordered={true}
        size={'small'}
        showHeader={false}
        columns={getBeforePreRepayTableColumns()}
        dataSource={getBeforePreRepayTableData(formValues)}
        pagination={false}
      />
    </>
  );
};

export default BeforePreRepayTable;
