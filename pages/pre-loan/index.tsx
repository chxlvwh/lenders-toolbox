import SearchForm from '@/components/SearchForm/SearchForm';
import Head from 'next/head';
export default function PreLoan() {
  return (
    <div className="pre-loan-container">
      <Head>
        <meta name="description" content="提前还房贷" />
      </Head>
      <SearchForm />
    </div>
  );
}
