import React, { useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { DateFormat, getBeforePreRepayTableColumns, getPreRepayTableData, LoanTableColumns } from '@/contants';
import { IFormProps } from '../SearchForm/SearchForm';

const PreRepayTable = ({ formValues, index }: { formValues: IFormProps; index: number }) => {
  const [dataSource, setDataSource] = useState<LoanTableColumns[]>([]);
  useEffect(() => {
    setDataSource(getPreRepayTableData(formValues, index));
  }, [formValues, index]);
  return (
    <>
      <Typography.Title level={4}>
        第 {index + 1} 次提前还款（
        {formValues.preRepayList[index].prepayDate && formValues.preRepayList[index].prepayDate.format(DateFormat.YM)}）
      </Typography.Title>
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

export default PreRepayTable;
