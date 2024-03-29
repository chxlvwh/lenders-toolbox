import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  FloatButton,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  Tooltip,
  FormListOperation,
  message
} from 'antd';
import {
  getAfterPreRepayTableData,
  getBeforePreRepayTableData,
  getPreRepayTableData,
  LoanTableColumns,
  loanTermOptions,
  LoanType,
  loanTypes,
  preLoanTypes,
  RepayPlan,
  repayPlans
} from '@/contants';
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
import { getInitialValues } from '@/contants/initialState';
import { formValuesToQueryString, queryToFormValues, RouterQueryProps } from '@/utils/utils';
import queryString from 'query-string';

export type PreRepayProps = {
  prepayDate: dayjs.Dayjs;
  prepayAmount: number;
  newRates: number;
  newRepayType?: number;
  repayPlan: RepayPlan;
  newMonthlyAmount?: number;
  preRepayType: number;
};

export interface IFormProps {
  loanAmount: number;
  loanYearTerm?: number;
  loanMonthTerm: number;
  loanType: LoanType;
  rates: number;
  firstRepayDate: dayjs.Dayjs;
  preRepayList: PreRepayProps[];
}
const SearchForm: React.FC = () => {
  const [form] = Form.useForm<IFormProps>();
  const router = useRouter();
  const initialValues: IFormProps = getInitialValues();
  const [formValues, setFormValues] = useState<IFormProps>(initialValues);
  const [disableTerm, setDisableTerm] = useState<boolean>(false);
  const [beforePreRepayTableData, setBeforePreRepayTableData] = useState<LoanTableColumns[]>([]);
  const [afterPreRepayTableData, setAfterPreRepayTableData] = useState<LoanTableColumns[][]>([]);
  const [preRepayTableData, setPreRepayTableData] = useState<LoanTableColumns[][]>([]);
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
      try {
        setBeforePreRepayTableData(getBeforePreRepayTableData(values));
        const nextAfterData: LoanTableColumns[][] = [];
        const nextPreData: LoanTableColumns[][] = [];
        values.preRepayList.forEach((item, index) => {
          nextAfterData.push(getAfterPreRepayTableData(values, index));
          nextPreData.push(getPreRepayTableData(values, index));
        });
        setAfterPreRepayTableData(nextAfterData);
        setPreRepayTableData(nextPreData);
      } catch (e) {
        console.log(e);
        message.error('日期填写不正确或者贷款还清后还有多余的还款计划');
      }
    } catch (errorInfo) {
      console.log('Failed:', errorInfo);
    }
  };
  // eslint-disable-next-line no-undef
  const handleTermChange = useCallback(async () => {
    const loanYearTerm = await form.getFieldValue('loanYearTerm');
    setDisableTerm(loanYearTerm !== 0);
    if (loanYearTerm !== 0) {
      form.setFieldValue('loanMonthTerm', loanYearTerm * 12);
      console.log(loanYearTerm * 12);
    }
  }, [form]);

  const handleAddProject = (add: FormListOperation['add']) => {
    const preRepayList = form.getFieldValue('preRepayList');
    const currentProjectLength = preRepayList.length;
    const lastProject = preRepayList[currentProjectLength - 1];
    add({ ...lastProject, prepayDate: lastProject.prepayDate.add(1, 'year') });
  };

  const getRepayList = () => {
    return formValues.preRepayList.map((val, index) => {
      return (
        <div key={index}>
          <Divider />
          <PreRepayTable tableData={preRepayTableData[index]} formValues={formValues} index={index} />
          <Divider />
          <AfterPreRepayTable tableData={afterPreRepayTableData[index]} index={index} />
        </div>
      );
    });
  };

  useEffect(() => {
    if (router.query.prepayDate) {
      const query = queryString.parse(queryString.stringify(router.query)) as RouterQueryProps;
      // 计算数据
      // setFormValues(queryToFormValues(query));
      // 控制页面中form值的显示
      form.setFieldsValue(queryToFormValues(query));
    }
    handleTermChange();
  }, [form, handleTermChange, router.query]);
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
          <InputNumber addonAfter="元" controls={false} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="贷款期限：" name="loanYearTerm">
          <Select options={loanTermOptions} onChange={handleTermChange} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="贷款月数：" name="loanMonthTerm">
          <InputNumber disabled={disableTerm} addonAfter="月" controls={false} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="还款方式：" name="loanType">
          <Select options={loanTypes} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="贷款利率：" name="rates">
          <InputNumber addonAfter="%" controls={false} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item className={styles['custom-form-item']} label="首次还款日期：" name="firstRepayDate">
          <DatePicker style={{ width: '100%' }} picker="month" />
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
                  <Card
                    title={`第${index + 1}次还款计划`}
                    size="small"
                    headStyle={{ background: 'rgba(25, 150, 100, 0.1)' }}>
                    <Form.Item
                      className={styles['custom-form-item']}
                      label="提前还款日期："
                      name={[field.name, 'prepayDate']}>
                      <DatePicker picker="month" className={styles['custom-card-field']} />
                    </Form.Item>
                    <Form.Item
                      className={styles['custom-form-item']}
                      label="提前还款方式："
                      name={[field.name, 'preRepayType']}>
                      <Select options={preLoanTypes} className={styles['custom-card-field']} />
                    </Form.Item>
                    <Form.Item
                      className={styles['custom-form-item']}
                      label="提前还款金额："
                      name={[field.name, 'prepayAmount']}>
                      <Input suffix="元" className={styles['custom-card-field']} />
                    </Form.Item>
                    <Form.Item
                      className={styles['custom-form-item']}
                      label="新的贷款利率："
                      name={[field.name, 'newRates']}>
                      <Input suffix="%" className={styles['custom-card-field']} />
                    </Form.Item>
                    <Form.Item
                      className={styles['custom-form-item']}
                      label="新的还款方式："
                      name={[field.name, 'newRepayType']}>
                      <Select options={loanTypes} className={styles['custom-card-field']} />
                    </Form.Item>
                    <Form.Item
                      className={styles['custom-form-item']}
                      label="调整还款方案："
                      name={[field.name, 'repayPlan']}>
                      <Select options={repayPlans} className={styles['custom-card-field']} />
                    </Form.Item>
                    {/*<Form.Item*/}
                    {/*  className={styles['custom-form-item']}*/}
                    {/*  label="新的月供金额："*/}
                    {/*  name={[field.name, 'newMonthlyAmount']}>*/}
                    {/*  <Input suffix="元" />*/}
                    {/*</Form.Item>*/}
                  </Card>

                  <MinusCircleOutlined
                    onClick={() => {
                      return index === 0 ? null : remove(field.name);
                    }}
                  />
                </Space>
              ))}

              <Form.Item wrapperCol={{ offset: 0 }}>
                <Row gutter={24}>
                  <Col className="gutter-row" span={12}>
                    <Button size="large" type="primary" onClick={onCheck} block>
                      计算
                    </Button>
                  </Col>

                  <Col className="gutter-row" span={12}>
                    {afterPreRepayTableData.length ? (
                      <Link href={`/pre-repay/detail?${queryString.stringify(router.query)}`} target="_blank">
                        <Button size="large" type="primary" block danger>
                          查看每月还款明细
                        </Button>
                      </Link>
                    ) : (
                      <Button size="large" type="primary" block danger disabled>
                        查看每月还款明细
                      </Button>
                    )}
                  </Col>
                </Row>
              </Form.Item>

              <Tooltip title="添加提前还款计划">
                <FloatButton
                  shape="circle"
                  type="primary"
                  className={styles['float-btn-circle']}
                  onClick={() => handleAddProject(add)}
                  icon={<PlusOutlined />}
                />
              </Tooltip>
            </>
          )}
        </Form.List>
      </Form>
      {beforePreRepayTableData.length ? <BeforePreRepayTable tableData={beforePreRepayTableData} /> : null}
      {afterPreRepayTableData.length ? getRepayList() : null}
    </>
  );
};

export default SearchForm;
