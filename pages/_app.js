import Layout from '@/components/layout/layout'
import '@/styles/globals.css'
import { ToastConfig } from '@/utils/toastConfig'

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ToastConfig />
    </Layout>
  )
}
