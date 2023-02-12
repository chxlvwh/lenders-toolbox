import React from 'react';
import { Table, Typography } from 'antd';
import { DateFormat, getBeforePreRepayTableColumns, LoanTableColumns } from '@/contants';
import { IFormProps } from '../SearchForm/SearchForm';

const PreRepayTable = ({
  tableData,
  formValues,
  index
}: {
  tableData: LoanTableColumns[];
  formValues: IFormProps;
  index: number;
}) => {
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
        dataSource={tableData}
        pagination={false}
      />
    </>
  );
};

export default PreRepayTable;
