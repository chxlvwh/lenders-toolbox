import { IFormProps } from '@/components/SearchForm/SearchForm';
import currency from 'currency.js';
import dayjs from 'dayjs';
import { Loan } from '@/utils/Loan';
import styles from '@/styles/index.module.sass';

export type element = { before: number; after: number };
export interface ILoanDetailElement {
  key?: string | number;
  term: number;
  date: dayjs.Dayjs | string;
  amount: number;
  interest: number;
  seed: number;
  restSeed: number;
}

export const DateFormat = {
  YM: 'YYYY-MM',
  YMD: 'YYYY-MM-DD'
};
export const loanTermOptions = Array.from(new Array(31).keys()).map((it) => {
  if (it === 0) {
    return {
      key: it,
      label: `自定义贷款期限`,
      value: it
    };
  }
  return {
    key: it,
    label: `${it}年(${it * 12}月)`,
    value: it
  };
});

export const loanTypesMapping = {
  0: '等额本息',
  1: '等额本金'
};

export const loanTypes = [
  {
    key: 0,
    label: `等额本息`,
    value: 0
  },
  {
    key: 1,
    label: `等额本金`,
    value: 1
  }
];

export const repayPlans = [
  {
    key: 0,
    label: `月供基本不变`,
    value: 0
  },
  {
    key: 1,
    label: `还款期限不变`,
    value: 1
  },
  {
    key: 2,
    label: `调整还款期限`,
    value: 2
  },
  {
    key: 3,
    label: `调整月供金额`,
    value: 3
  }
];

// ts-ignore
export const getLoanDetailTableColumns = () => {
  return [
    {
      title: '期次',
      dataIndex: 'term',
      onCell(record: any) {
        return {
          ...record,
          className: styles['money-style']
        };
      }
    },
    {
      title: '还款日期',
      dataIndex: 'date',
      onCell(record: any) {
        return {
          ...record,
          className: styles['money-style']
        };
      }
    },
    {
      title: '每月还款',
      dataIndex: 'amount',
      onCell(record: any) {
        return {
          ...record,
          className: styles['money-style']
        };
      }
    },
    {
      title: '偿还利息',
      dataIndex: 'interest',
      onCell(record: any) {
        return {
          ...record,
          className: styles['money-style']
        };
      }
    },
    {
      title: '偿还本金',
      dataIndex: 'seed',
      onCell(record: any) {
        return {
          ...record,
          className: styles['money-style']
        };
      }
    },
    {
      title: '剩余本金',
      dataIndex: 'restSeed',
      onCell(record: any) {
        return {
          ...record,
          className: styles['money-style']
        };
      }
    }
  ];
};

export const getLoanDetailTableData = (): ILoanDetailElement[][] => {
  let list: ILoanDetailElement[][] = [];
  if (typeof window !== 'undefined') {
    list = JSON.parse(localStorage.getItem('loan_detail_List') || '[]');
  }
  return list.map((it: ILoanDetailElement[], index: number): ILoanDetailElement[] => {
    let prevLength = 0;
    if (Array.isArray(list[index - 1])) {
      for (let i = 0; i < index; i++) {
        prevLength += list[i].length;
      }
    }
    if (Array.isArray(it)) {
      return it.map((item, i: number): ILoanDetailElement => {
        return {
          key: `${item.term}-${i}`,
          term: item.term + 1 + prevLength,
          date: dayjs(item.date).format(DateFormat.YM),
          amount: currency(item.amount).value,
          interest: currency(item.interest).value,
          seed: currency(item.seed).value,
          restSeed: currency(item.restSeed).value
        };
      });
    }
    return it;
  });
};

type preRepayInfo = {
  repayAmount: number;
  restAmount: number;
};
export const getPreRepayInfo = (): preRepayInfo[] => {
  try {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('rest_seed_list') || '[]');
    }
    return [];
  } catch (e) {
    console.log(e);
    return [];
  }
};

export const getBeforePreRepayTableColumns = () => {
  return [
    {
      title: 'name',
      dataIndex: 'name',
      className: styles['table-col-sty'],
      width: '50%',
      onCell(record: any) {
        if (record.name === '节省利息') {
          return {
            ...record,
            className: styles['danger']
          };
        }
      }
    },
    {
      title: 'value',
      dataIndex: 'value',
      width: '50%',
      onCell(record: any) {
        return {
          ...record,
          className: styles['money-style']
        };
      }
    }
  ];
};
let loan: Loan;

export const getBeforePreRepayTableData = (formValue: IFormProps): LoanTableColumns[] => {
  loan = new Loan(formValue);
  const { seed, term, monthlyPayment, monthlyDecline, rates, type, total, totalInterest } = loan.getInitialData();
  const loanType = Reflect.get(loanTypesMapping, type);
  return [
    {
      key: '1',
      name: '贷款总额',
      value: `${currency(seed)} 元`
    },
    {
      key: '2',
      name: '还款月数',
      value: `${term} 月`
    },
    {
      key: '3',
      name: '贷款利率',
      value: `${rates} %`
    },
    {
      key: '4',
      name: '还款方式',
      value: loanType
    },
    {
      key: '5',
      name: '每月还款',
      value: `${currency(monthlyPayment)} 元`
    },
    {
      key: '6',
      name: '每月递减',
      value: `${currency(monthlyDecline)} 元`
    },
    {
      key: '7',
      name: '利息总额',
      value: `${currency(totalInterest)} 元`
    },
    {
      key: '8',
      name: '本息合计',
      value: `${currency(total)} 元`
    }
  ];
};

export const getPreRepayTableData = (formValue: IFormProps, index: number): LoanTableColumns[] => {
  try {
    loan.getDataBeforePreRepay(index);
  } catch (e) {
    console.log(e);
    return [];
  }
  return [
    {
      key: '1',
      name: '已还期次',
      value: (dayjs(formValue.preRepayList[index].prepayDate).diff(formValue.firstRepayDate, 'month') + 1).toString()
    },
    {
      key: '2',
      name: '已还利息',
      value: `上次提前还款之后：${currency(loan.repaidInterestList[index])} 元，
				总计已还：${currency(loan.getTotalRepaidInterest(index))} 元`
    },
    {
      key: '3',
      name: '剩余利息',
      value: `${currency(loan.restInterestList[index].before)} 元`
    },
    {
      key: '4',
      name: '已还本金',
      value: `上次提前还款之后：${currency(loan.repaidSeedList[index])} 元，
				总计已还：${currency(loan.getTotalRepaidSeed(index))} 元`
    },
    {
      key: '5',
      name: '剩余本金',
      value: `${currency(loan.restSeedList[index].after + formValue.preRepayList[index].prepayAmount)} 元`
    },
    {
      key: '6',
      name: '提前还款',
      value: `${currency(formValue.preRepayList[index].prepayAmount)} 元`
    },
    {
      key: '7',
      name: '节省利息',
      value: `${currency(loan.restInterestList[index].before - loan.restInterestList[index].after)} 元`
    }
  ];
};

export interface LoanTableColumns {
  key: string;
  name: string;
  value: string;
}

export const getAfterPreRepayTableData = (formValue: IFormProps, index: number): LoanTableColumns[] => {
  try {
    loan.getDataBeforePreRepay(index);
  } catch (e) {
    console.log(e);
    return [];
  }
  const loanType = Reflect.get(loanTypesMapping, formValue.loanType || 0);
  return [
    {
      key: '1',
      name: '贷款金额',
      value: `${currency(loan.restSeedList[index].after)} 元`
    },
    {
      key: '2',
      name: '贷款期限',
      value: `${loan.termList[index].after} 月，最后还款日：${dayjs(formValue.preRepayList[index].prepayDate)
        .add(loan.termList[index].after, 'month')
        .format(DateFormat.YM)}`
    },
    {
      key: '3',
      name: '贷款利率',
      value: `${formValue.rates} %`
    },
    {
      key: '4',
      name: '还款方式',
      value: loanType
    },
    {
      key: '5',
      name: '首月还款',
      value: `${currency(loan.monthlyPaymentList[index].after)} 元`
    },
    {
      key: '6',
      name: '每月递减',
      value: `0.00 元`
    },
    {
      key: '7',
      name: '利息总额',
      value: `${currency(loan.restInterestList[index].after)} 元`
    }
  ];
};
