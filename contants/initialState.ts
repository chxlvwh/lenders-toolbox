import dayjs from 'dayjs';

const devInitState = {
  loanAmount: 1190000,
  loanYearTerm: 0,
  loanMonthTerm: 360,
  loanType: 0,
  rates: 6.027,
  firstRepayDate: dayjs('2019-10'),
  preRepayList: [
    {
      prepayDate: dayjs('2023-05'),
      prepayType: 0,
      prepayAmount: 100000,
      newRates: 6.027,
      newRepayType: 0,
      repayPlan: 0,
      preRepayType: 0,
      newMonthlyAmount: 7155.32
    }
  ]
};
const prodInitState = {
  loanAmount: 0,
  loanYearTerm: 0,
  loanMonthTerm: 0,
  loanType: 0,
  rates: 0,
  firstRepayDate: dayjs(),
  preRepayList: [
    {
      prepayDate: dayjs(),
      prepayType: 0,
      prepayAmount: 0,
      newRates: 0,
      newRepayType: 0,
      repayPlan: 0,
      preRepayType: 0,
      newMonthlyAmount: 0
    }
  ]
};
export const getInitialValues = () => {
  return process.env.NODE_ENV === 'development' ? devInitState : prodInitState;
};
