import SearchForm from '@/components/SearchForm/SearchForm';
import Head from 'next/head';

export default function PreLoan() {
  return (
    <div>
      <Head>
        <title>提前还款计算器</title>
        <meta name="description" content="提前还房贷" />
      </Head>
      <SearchForm />
    </div>
  );
}
