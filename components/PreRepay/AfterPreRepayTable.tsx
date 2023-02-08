import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { getAfterPreRepayTableData, getBeforePreRepayTableColumns } from '@/contants';
import { IFormProps } from '../SearchForm/SearchForm';

const AfterPreRepayTable = ({ formValues, index }: { formValues: IFormProps; index: number }) => {
  const [dataSource, setDataSource] = useState<any>([]);
  useEffect(() => {
    setDataSource(getAfterPreRepayTableData(formValues, index));
  }, [formValues, index]);
  return (
    <>
      <Typography.Title level={4}>第 {index + 1} 次提前还款后</Typography.Title>
      <Table
        bordered={true}
        size={'small'}
        showHeader={false}
        columns={getBeforePreRepayTableColumns()}
        dataSource={dataSource}
        pagination={false}
      />
    </>
  );
};

export default AfterPreRepayTable;
