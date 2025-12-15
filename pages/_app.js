import Layout from '@/components/layout/Layout'
import '@/styles/globals.css'
import { ToastConfig } from '@/utils/toastConfig'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Layout>
        <Component {...pageProps} />
        <ToastConfig />
      </Layout>
    </SessionProvider>
  )
}
