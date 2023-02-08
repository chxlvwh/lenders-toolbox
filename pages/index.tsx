import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import customStyles from '@/styles/index.module.sass';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <Head>
        <title>提前还款计算器</title>
        <meta name="description" content="可以计算多次、分批提前还款，以及多少年还清" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>多计划提前还款计算器</h1>
        <p>此最大特点是可以添加多次还款计划一起计算，查看自己多久可以还清贷款，以及总共还多少利息。</p>
        <Link className={customStyles.clickable} href="pre-loan">
          点击体验 &gt;&gt;
        </Link>
      </main>
    </>
  );
}
