import React, { FC, useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { getLoanDetailTableColumns, getLoanDetailTableData, getPreRepayInfo, ILoanDetailElement } from '@/contants';

const LoanDetail: FC = () => {
  const [tableList, setTableList] = useState<ILoanDetailElement[][]>([]);
  useEffect(() => {
    setTableList(getLoanDetailTableData);
  }, []);
  return (
    <>
      <Typography.Title level={2}>提前还贷还款明细报表</Typography.Title>
      {tableList.map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <div key={index}>
              <Table
                key={index}
                className="loan-detail-table"
                bordered={true}
                columns={getLoanDetailTableColumns()}
                dataSource={item}
                pagination={false}
              />
              {index + 1 < tableList.length && getPreRepayInfo()[index] && (
                <Typography.Title
                  level={4}
                  style={{
                    color: 'darkred',
                    textAlign: 'right',
                    padding: '10px'
                  }}>
                  提前还款 {getPreRepayInfo()[index].repayAmount} 元， 剩余本金 {getPreRepayInfo()[index].restAmount} 元
                </Typography.Title>
              )}
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default LoanDetail;
