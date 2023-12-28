import HomePage from "@/components/templates/HomePage";
import { getSession } from "next-auth/react";


export default function Home() {
  return (
    <HomePage />
  )
}


export async function getServerSideProps({ req }) {

  const session = await getSession({ req });


  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false
      }
    }
  }

  return {
    props: {

    }
  }
} 
