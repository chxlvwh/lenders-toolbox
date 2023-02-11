import dayjs from 'dayjs';
import { IFormProps } from '@/components/SearchForm/SearchForm';
import { DateFormat, ILoanDetailElement } from '@/contants';
import queryString from 'query-string';

/**
 * 1、等额本金还款：月供=(借款金额/借款月数)+(借款金额-累计已还本金)×月利率;
 *
 * 2、等额本息还款：月供=贷款本金×[月利率×(1+月利率)^还款月数]÷{[(1+月利率)^还款月数]-1}。
 */
export const calMonthAmount = (amount: number, rates: number, term: number) => {
  const monthRates = rates / 100 / 12;
  const basePower = Math.pow(1 + monthRates, term);
  return (amount * (monthRates * basePower)) / (basePower - 1);
};

export const calMonthObj = (
  seed: number,
  rates: number,
  monthAmount: number,
  firstMonth: dayjs.Dayjs,
  lastMonth: dayjs.Dayjs,
  index: number,
  detailList: ILoanDetailElement[][]
) => {
  detailList[index] = [];
  const repaidMonths = lastMonth.diff(firstMonth, 'month') + (index === 0 ? 1 : 0);
  const monthRates = rates / 100 / 12;
  let monthSeed = 0;
  let monthInterest = 0;
  let restSeed = seed;
  let repaidInterest = 0;
  Array.from(new Array(repaidMonths)).forEach((item, i) => {
    const lastRestSeed = restSeed;
    restSeed = restSeed * (1 + monthRates) - monthAmount;
    monthSeed = lastRestSeed - restSeed;
    monthInterest = monthAmount - monthSeed;
    repaidInterest += monthInterest;
    detailList[index].push({
      term: i,
      date: firstMonth.add(i + 1, 'month'),
      amount: monthAmount,
      interest: monthInterest,
      seed: monthSeed,
      restSeed
    });
  });
  return {
    monthSeed,
    monthInterest,
    restSeed,
    repaidInterest
  };
};

export const calTerm = (seed: number, rates: number, monthAmount: number) => {
  const monthRates = rates / 100 / 12;
  return Math.log(monthAmount / (monthAmount - monthRates * seed)) / Math.log(1 + monthRates);
};

const setDefaultFormValue = (val: string) => {
  return !isNaN(Number(val)) ? Number(val) : 0;
};

export const formValuesToQueryString = (values: IFormProps) => {
  let qs = '';
  const copyValues = { ...values, firstRepayDate: values.firstRepayDate.format(DateFormat.YM) };
  Reflect.deleteProperty(copyValues, 'preRepayList');
  qs += queryString.stringify(copyValues);
  const preRepayList = values.preRepayList;
  preRepayList.forEach((item) => {
    const copyItem = { ...item, prepayDate: item.prepayDate.format(DateFormat.YM) };
    qs += `&${queryString.stringify(copyItem)}`;
  });
  return qs;
};

export type RouterQueryProps = {
  firstRepayDate: string;
  loanAmount: string;
  loanMonthTerm: string;
  loanType: string;
  loanYearTerm: string;
  rates: string;
  newMonthlyAmount: string[] | string;
  newRates: string[] | string;
  newRepayType: string[] | string;
  preRepayType: string[] | string;
  prepayAmount: string[] | string;
  prepayDate: string[] | string;
  repayPlan: string[] | string;
};

export const queryToFormValues = (query: RouterQueryProps): IFormProps => {
  const result: IFormProps = {
    loanAmount: setDefaultFormValue(query.loanAmount),
    loanYearTerm: setDefaultFormValue(query.loanYearTerm),
    loanMonthTerm: setDefaultFormValue(query.loanMonthTerm),
    loanType: setDefaultFormValue(query.loanType),
    rates: setDefaultFormValue(query.rates),
    firstRepayDate: dayjs(query.firstRepayDate),
    preRepayList: []
  };
  let projectLength = 1;
  if (
    Array.isArray(query.prepayDate) ||
    Array.isArray(query.prepayAmount) ||
    Array.isArray(query.newRates) ||
    Array.isArray(query.newRepayType) ||
    Array.isArray(query.repayPlan) ||
    Array.isArray(query.newMonthlyAmount) ||
    Array.isArray(query.preRepayType)
  ) {
    projectLength = query.prepayDate.length;
    Array.from(new Array(projectLength)).forEach((_, i) => {
      result.preRepayList.push({
        prepayDate: dayjs(query.prepayDate[i]),
        prepayAmount: setDefaultFormValue(query.prepayAmount[i]),
        newRates: setDefaultFormValue(query.newRates[i]),
        newRepayType: setDefaultFormValue(query.newRepayType[i]),
        repayPlan: setDefaultFormValue(query.repayPlan[i]),
        newMonthlyAmount: setDefaultFormValue(query.newMonthlyAmount[i]),
        preRepayType: setDefaultFormValue(query.preRepayType[i])
      });
    });
  } else {
    result.preRepayList.push({
      prepayDate: dayjs(query.prepayDate),
      prepayAmount: setDefaultFormValue(query.prepayAmount),
      newRates: setDefaultFormValue(query.newRates),
      newRepayType: setDefaultFormValue(query.newRepayType),
      repayPlan: setDefaultFormValue(query.repayPlan),
      newMonthlyAmount: setDefaultFormValue(query.newMonthlyAmount),
      preRepayType: setDefaultFormValue(query.preRepayType)
    });
  }
  return result;
};
