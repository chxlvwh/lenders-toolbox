import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import styles from '@/styles/index.module.sass';
import 'antd/dist/reset.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={styles.app}>
      <Component {...pageProps} />
    </div>
  );
}
