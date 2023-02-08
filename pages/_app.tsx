import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import React from 'react';
import '@/styles/index.module.sass';
import 'antd/dist/reset.css';
import '@/dist/index.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="app">
      <Component {...pageProps} />
    </div>
  );
}
