import React, { FC, useEffect, useState } from 'react';
import { Table, Typography } from 'antd';
import { getLoanDetailTableColumns, getLoanDetailData, ILoanDetailElement, PreRepayInfo } from '@/contants';
import styles from '@/styles/index.module.sass';
import queryString from 'query-string';
import { queryToFormValues, RouterQueryProps } from '@/utils/utils';
import { useRouter } from 'next/router';

const LoanDetail: FC = () => {
  const [tableList, setTableList] = useState<ILoanDetailElement[][]>([]);
  const [preRepayInfoList, setPreRepayInfoList] = useState<PreRepayInfo[]>([]);
  const router = useRouter();
  useEffect(() => {
    if (router.query.prepayDate) {
      const query = queryString.parse(queryString.stringify(router.query)) as RouterQueryProps;
      const formValue = queryToFormValues(query);
      setTableList(getLoanDetailData(formValue).loanDetailList);
      setPreRepayInfoList(getLoanDetailData(formValue).restSeedList);
    }
  }, [router.query]);
  return (
    <>
      <Typography.Title level={2}>提前还贷还款明细报表</Typography.Title>
      {tableList.map((item, index) => {
        if (Array.isArray(item)) {
          return (
            <div key={index}>
              <Table
                key={index}
                className={styles['loan-detail-table']}
                bordered={true}
                columns={getLoanDetailTableColumns()}
                dataSource={item}
                pagination={false}
              />
              {index + 1 < tableList.length && preRepayInfoList[index] && (
                <Typography.Title
                  level={4}
                  style={{
                    color: 'darkred',
                    textAlign: 'right',
                    padding: '10px'
                  }}>
                  提前还款 {preRepayInfoList[index].repayAmount} 元， 剩余本金 {preRepayInfoList[index].restAmount} 元
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
