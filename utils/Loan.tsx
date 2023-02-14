import { IFormProps, PreRepayProps } from '@/components/SearchForm/SearchForm';
import { element, ILoanDetailElement, LoanType, LoanTypeEnum, RepayPlanEnum, RestSeedList } from '@/contants';
import dayjs from 'dayjs';
import { calMonthAmount, calMonthObj, calTerm } from './utils';
import currency from 'currency.js';

export class Loan {
  /*本金*/
  private readonly seed;
  /*还款月数*/
  private readonly term;
  /*还款类型：等额本息或者等额本金*/
  private readonly type: LoanType;
  /*第一次还款月份，不是提前还款*/
  private readonly firstRepayDate;
  /*提前还款之前利率*/
  private readonly rates;
  /*还款计划列表*/
  private readonly preRepayList: PreRepayProps[];
  /*每月还款的详情，二维数组，第一维是根据还款计划来划分，第二维是每次还款计划中每月的还款详情*/
  public detailList: ILoanDetailElement[][] = [];
  /** 剩余利息对象数组
   * @property before 本次提前还款前剩余利息
   * @property after 本次提前还款后剩余利息
   * */
  public restInterestList: element[] = [];
  /*已还本金数组，每一项数据代表上次提前还款之后到这次提前还款之前所还的本金*/
  public repaidSeedList: number[] = [];
  /** 剩余本金对象数组
   * @property before 上次提前还款后剩余本金
   * @property after 本次提前还款后剩余本金
   * */
  public restSeedList: element[] = [];
  /*已还利息数组，每一项数据代表上次提前还款之后到这次提前还款之前所还的利息*/
  public repaidInterestList: number[] = [];
  /**
   * 月供对象数组
   * @property before 上次提前还款后月供
   * @property after 本次提前还款后月供
   */
  public monthlyPaymentList: element[] = [];
  /**
   * 期数对象数组
   * @property before 上次提前还款后剩余总期数
   * @property after 本次提前还款后剩余总期数
   */
  public termList: element[] = [];
  /**
   * 本息合计对象数组
   * @property before 上次提前还款后本息合计
   * @property after 本次提前还款后本息合计
   */
  public totalList: element[] = [];
  /*每月还款明细*/
  public loan_detail_List: ILoanDetailElement[][] = [];
  /*每次提前还款后剩余本金*/
  public rest_seed_list: RestSeedList[] = [];

  constructor(formValue: IFormProps) {
    this.seed = formValue.loanAmount;
    this.term = formValue.loanYearTerm ? formValue.loanYearTerm * 12 : formValue.loanMonthTerm;
    this.type = formValue.loanType || 0;
    this.firstRepayDate = formValue.firstRepayDate;
    this.rates = formValue.rates;
    this.preRepayList = formValue.preRepayList;
  }

  /**
   * 获取月利率
   * @param rates 年利率
   * */
  getMonthRates(rates: number) {
    return rates / 100 / 12;
  }

  /**
   * 获取每月还款额
   * @param amount 贷款总数
   * @param rates 年利率
   * @param term 期数
   * @param type 还款类型
   */
  getMonthlyPayment(amount: number, rates: number, term: number, type: LoanType): number {
    if (type === LoanTypeEnum.EQUAL_SEED_INTEREST) {
      // 等额本息
      const basePower = Math.pow(1 + this.getMonthRates(rates), term);
      return (amount * (this.getMonthRates(rates) * basePower)) / (basePower - 1);
    }
    return 0;
  }

  getMonthlyDecline() {
    return 0;
  }

  /**
   * @function
   * 生成初始数据
   * */
  getInitialData() {
    const monthlyPayment = this.getMonthlyPayment(this.seed, this.rates, this.term, this.type);
    const total = monthlyPayment * this.term;
    return {
      seed: this.seed,
      term: this.term,
      rates: this.rates,
      type: this.type,
      monthlyPayment,
      monthlyDecline: this.getMonthlyDecline(),
      totalInterest: total - this.seed,
      total
    };
  }

  /**
   * 获取数据（月供基本不变）
   * @param preRepayIndex 第几次提前还款，从0次开始
   */
  getDataBeforePreRepay(preRepayIndex: number) {
    // 本次提前还款数据
    const currentPreRepayValue = this.preRepayList[preRepayIndex];
    // 自上次提前还款后又还期数 默认是已还总期数
    let currentRepaidTimes = dayjs(currentPreRepayValue.prepayDate).diff(this.firstRepayDate);
    if (preRepayIndex !== 0) {
      currentRepaidTimes = dayjs(currentPreRepayValue.prepayDate).diff(this.preRepayList[preRepayIndex - 1].prepayDate);
    }
    if (currentRepaidTimes <= 0) {
      throw new Error('提前还款日期不对，请检查输入的日期');
    }
    let /** 本次提前还款后月供 */
      monthlyPaymentAfter: number,
      /** 上次提前还款后月供 */
      monthlyPaymentBefore: number,
      /** 上次提前还款后第一个月份 */
      firstMonth: dayjs.Dayjs,
      /** 上次提前还款后利率 */
      rates: number,
      /** 本次提前还款后剩余本金 */
      seedAfter: number,
      /** 上次提前还款后剩余本金 */
      seedBefore: number,
      /** 上次提前还款后剩余总期数 */
      termBefore: number,
      /** 本次提前还款后总期数 */
      termAfter: number,
      /** 上次提前还款后本息合计 */
      totalBefore: number,
      /** 本次提前还款后本息合计 */
      totalAfter: number;
    if (preRepayIndex === 0) {
      seedBefore = this.seed;
      monthlyPaymentBefore = this.getInitialData().monthlyPayment;
      rates = this.getInitialData().rates;
      firstMonth = this.firstRepayDate;
    } else {
      seedBefore = this.restSeedList[preRepayIndex - 1].after;
      rates = this.preRepayList[preRepayIndex - 1].newRates;
      monthlyPaymentBefore = this.monthlyPaymentList[preRepayIndex - 1].after;
      firstMonth = this.preRepayList[preRepayIndex - 1].prepayDate;
    }
    const { restSeed, repaidInterest } = calMonthObj(
      seedBefore,
      rates,
      monthlyPaymentBefore,
      firstMonth,
      currentPreRepayValue.prepayDate,
      preRepayIndex,
      this.detailList
    );
    this.repaidSeedList[preRepayIndex] = seedBefore - restSeed;
    seedAfter = restSeed - currentPreRepayValue.prepayAmount;
    this.restSeedList[preRepayIndex] = {
      before: seedBefore,
      after: seedAfter
    };
    this.repaidInterestList[preRepayIndex] = repaidInterest;

    switch (currentPreRepayValue.repayPlan) {
      case RepayPlanEnum.KEEP_MONTHLY_PAYMENT:
        if (preRepayIndex === 0) {
          termBefore = this.term;
          totalBefore = termBefore * monthlyPaymentBefore;
        } else {
          termBefore = this.termList[preRepayIndex - 1].after;
          totalBefore = this.totalList[preRepayIndex - 1].after;
        }
        // 根据本次提前还款之后每月还款算出期数
        termAfter = Math.ceil(calTerm(seedAfter, currentPreRepayValue.newRates, monthlyPaymentBefore));
        break;
      case RepayPlanEnum.KEEP_TERM:
      default:
        if (preRepayIndex === 0) {
          termBefore = this.term;
          totalBefore = termBefore * monthlyPaymentBefore;
          termAfter = termBefore - currentPreRepayValue.prepayDate.diff(firstMonth, 'month') - 1;
        } else {
          termBefore = this.termList[preRepayIndex - 1].after;
          totalBefore = this.totalList[preRepayIndex - 1].after;
          termAfter = termBefore - currentPreRepayValue.prepayDate.diff(firstMonth, 'month');
        }
    }

    // 根据期数算出还款后的每月还款值
    monthlyPaymentAfter = calMonthAmount(seedAfter, currentPreRepayValue.newRates, termAfter);
    this.monthlyPaymentList[preRepayIndex] = {
      before: monthlyPaymentBefore,
      after: monthlyPaymentAfter
    };
    totalAfter = termAfter * monthlyPaymentAfter;
    this.termList[preRepayIndex] = {
      before: termBefore,
      after: termAfter
    };
    this.totalList[preRepayIndex] = {
      before: totalBefore,
      after: totalAfter
    };
    this.restInterestList[preRepayIndex] = {
      // 本次提前还款前剩余利息
      before: this.totalList[preRepayIndex].before - this.restSeedList[preRepayIndex].before - repaidInterest,
      // 本次提前还款后剩余利息
      after: this.totalList[preRepayIndex].after - this.restSeedList[preRepayIndex].after
    };
    if (preRepayIndex === this.preRepayList.length - 1) {
      this.detailList[preRepayIndex + 1] = [];
      calMonthObj(
        seedAfter,
        currentPreRepayValue.newRates,
        monthlyPaymentAfter,
        currentPreRepayValue.prepayDate,
        currentPreRepayValue.prepayDate.add(termAfter, 'month'),
        preRepayIndex + 1,
        this.detailList
      );
    }
    this.loan_detail_List = this.detailList;
    this.rest_seed_list = this.restSeedList.map((it, index) => {
      return {
        restAmount: currency(it.after).value,
        repayAmount: currency(this.preRepayList[index].prepayAmount).value
      };
    });
  }

  getTotalRepaidSeed(index: number) {
    let result = 0;
    this.repaidSeedList.forEach((item, i) => {
      if (i <= index) {
        result = result + item + Number(this.preRepayList[i].prepayAmount);
      }
    });
    return result;
  }

  getTotalRepaidInterest(index: number) {
    let result = 0;
    this.repaidInterestList.forEach((item, i) => {
      if (i <= index) {
        result += item;
      }
    });
    return result;
  }
}
