import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import styles from '@/styles/index.module.sass';
import 'antd/dist/reset.css';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    setView();
  }, []);
  const WIDTH = 1200; //如果是尺寸的设计稿在这里修改
  const setView = () => {
    //设置html标签的fontSize
    document.documentElement.style.fontSize = (100 * screen.width) / WIDTH + 'px';
  };
  return (
    <div className={styles.app}>
      <Component {...pageProps} />

      <footer className={styles['bei-an']}>
        <div>
          <p>Copyright © 2023 HXCao, All Rights Reserved</p>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            苏ICP备2023004702号
          </a>
        </div>
      </footer>
    </div>
  );
}
