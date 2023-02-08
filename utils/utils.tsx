import dayjs from 'dayjs';
import { IFormProps } from '@/components/SearchForm/SearchForm';
import { ILoanDetailElement, loanTypesMapping } from '@/contants';

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
  // localStorage.setItem('loan_detail_List', JSON.stringify(detailList));
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

export const formatValue = (formValue: IFormProps) => {
  const seed = (formValue.loanAmount || 0) * 10000;
  const term = formValue.loanYearTerm ? formValue.loanYearTerm * 12 : formValue.loanMonthTerm;
  const loanType = Reflect.get(loanTypesMapping, formValue.loanType || 0);
  // const allInterestAndSeed = monthAmount * term;
  // const allInterest = allInterestAndSeed - seed;
  return {
    seed,
    term,
    loanType
    // allInterestAndSeed,
    // allInterest,
  };
};
