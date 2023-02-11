import React, { useEffect, useState } from 'react';
import { Button, Card, DatePicker, Divider, FloatButton, Form, Input, InputNumber, Select, Space, Tooltip } from 'antd';
import { loanTermOptions, loanTypes, preLoanTypes, repayPlans } from '@/contants';
import dayjs from 'dayjs';
import BeforePreRepayTable from '../PreRepay/BeforePreRepayTable';
import PreRepayTable from '../PreRepay/PreRepayTable';
import AfterPreRepayTable from '../PreRepay/AfterPreRepayTable';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import HeaderPage from '../Header/HeaderPage';
import HeaderDesc from '../Header/HeaderDesc';
import Link from 'next/link';
import styles from '@/styles/index.module.sass';
import { useRouter } from 'next/router';
import { getInitialValues } from '@/contants/initial-state';
import { formValuesToQueryString, queryToFormValues, RouterQueryProps } from '@/utils/utils';
import queryString from 'query-string';

export type PreRepayProps = {
  prepayDate: dayjs.Dayjs;
  prepayAmount: number;
  newRates: number;
  newRepayType?: number;
  repayPlan?: number;
  newMonthlyAmount?: number;
  preRepayType: number;
};

export interface IFormProps {
  loanAmount: number;
  loanYearTerm?: number;
  loanMonthTerm: number;
  loanType?: number;
  rates: number;
  firstRepayDate: dayjs.Dayjs;
  preRepayList: PreRepayProps[];
}
const SearchForm: React.FC = () => {
  const [form] = Form.useForm<IFormProps>();
  const router = useRouter();
  const initialValues: IFormProps = getInitialValues();
  const [formValues, setFormValues] = useState<IFormProps>(initialValues);
  const onCheck = async () => {
    try {
      const values = await form.validateFields();
      if (
        !values.loanAmount ||
        values.loanAmount === 0 ||
        !values.loanMonthTerm ||
        values.loanMonthTerm === 0 ||
        !values.rates ||
        values.rates === 0
      )
        return;
      await router.push(`${router.pathname}?${formValuesToQueryString(values)}`);
      setFormValues(values);
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };

  useEffect(() => {
    if (router.query.prepayDate) {
      const query = queryString.parse(queryString.stringify(router.query)) as RouterQueryProps;
      // 计算数据
      setFormValues(queryToFormValues(query));
      // 控制页面中form值的显示
      form.setFieldsValue(queryToFormValues(query));
    }
  }, [form, router.query]);
  return (
    <>
      <HeaderPage />
      <HeaderDesc />
      <Form
        form={form}
        className={styles['search-form-wrapper']}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
        layout="horizontal"
        initialValues={initialValues}>
        <Form.Item className={styles['custom-form-item']} label="贷款金额：" name="loanAmount">
          <InputNumber addonAfter="元" controls={false} style={{ width: '400px' }} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="贷款期限：" name="loanYearTerm">
          <Select options={loanTermOptions} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="贷款月数：" name="loanMonthTerm">
          <InputNumber addonAfter="月" controls={false} style={{ width: '400px' }} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="还款方式：" name="loanType">
          <Select options={loanTypes} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="贷款利率：" name="rates">
          <InputNumber addonAfter="%" controls={false} style={{ width: '400px' }} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="首次还款日期：" name="firstRepayDate">
          <DatePicker style={{ width: '400px' }} picker="month" />
        </Form.Item>
        <Form.List name="preRepayList">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Space
                  key={field.key}
                  align="baseline"
                  style={{ textAlign: 'left' }}
                  className={styles['custom-space']}>
                  <Card title={`第${index + 1}次还款计划`} size="small">
                    <Form.Item label="提前还款日期：" name={[field.name, 'prepayDate']}>
                      <DatePicker picker="month" />
                    </Form.Item>
                    <Form.Item label="提前还款方式：" name={[field.name, 'preRepayType']}>
                      <Select options={preLoanTypes} />
                    </Form.Item>
                    <Form.Item label="提前还款金额：" name={[field.name, 'prepayAmount']}>
                      <Input suffix="元" />
                    </Form.Item>
                    <Form.Item label="新的贷款利率：" name={[field.name, 'newRates']}>
                      <Input suffix="%" />
                    </Form.Item>
                    <Form.Item label="新的还款方式：" name={[field.name, 'newRepayType']}>
                      <Select options={loanTypes} />
                    </Form.Item>
                    <Form.Item label="调整还款方案：" name={[field.name, 'repayPlan']}>
                      <Select options={repayPlans} />
                    </Form.Item>
                    <Form.Item label="新的月供金额：" name={[field.name, 'newMonthlyAmount']}>
                      <Input suffix="元" />
                    </Form.Item>
                  </Card>

                  <MinusCircleOutlined
                    onClick={() => {
                      return index === 0 ? null : remove(field.name);
                    }}
                  />
                </Space>
              ))}

              <Form.Item wrapperCol={{ offset: 0 }}>
                <Button size="large" type="primary" onClick={onCheck} block style={{ width: '400px' }}>
                  计算
                </Button>

                <Link href={`/pre-repay/detail?${queryString.stringify(router.query)}`} target="_blank">
                  <Button
                    size="large"
                    type="primary"
                    block
                    danger
                    style={{
                      width: '400px',
                      margin: '20px'
                    }}>
                    查看每月还款明细
                  </Button>
                </Link>
              </Form.Item>

              <Tooltip title="添加提前还款计划">
                <FloatButton
                  shape="circle"
                  type="primary"
                  className={styles['float-btn-circle']}
                  onClick={() => add(form.getFieldValue('preRepayList')[0])}
                  style={{ top: 100, right: 94 }}
                  icon={<PlusOutlined />}
                />
              </Tooltip>
            </>
          )}
        </Form.List>
      </Form>
      {formValues.loanAmount !== 0 && <BeforePreRepayTable formValues={formValues} />}
      {formValues.loanAmount !== 0 &&
        formValues.preRepayList.map((val, index) => {
          return (
            <div key={index}>
              <Divider />
              <PreRepayTable formValues={formValues} index={index} />
              <Divider />
              <AfterPreRepayTable formValues={formValues} index={index} />
            </div>
          );
        })}
    </>
  );
};

export default SearchForm;
