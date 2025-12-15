import HomePage from "@/components/templates/HomePage";
import Layout from "@/components/layout/Layout";
import { getSession } from "next-auth/react";

export default function Home() {
  return (
    <Layout>
      <HomePage />
    </Layout>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }

  return {
    props: {}
  }
}
