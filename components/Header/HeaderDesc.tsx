import { Typography } from 'antd';
import styles from '@/styles/index.module.sass';

const SegmentExampleSegment = () => (
  <Typography.Title level={2} className={styles['header-message']}>
    房贷提前还款计算器可计算：①提前还款前每月还款金额、利息总额及还款月数，②提前还款时已还期次、剩余利息、剩余本金以及③提前还款后利息总额等，并可查看每月还款明细。
    <br />
    特点是： <strong className={styles['danger']}>可添加多次还款计划</strong>
  </Typography.Title>
);

export default SegmentExampleSegment;
