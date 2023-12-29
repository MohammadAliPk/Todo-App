import HomePage from "@/components/templates/HomePage";
import { getSession } from "next-auth/react";


export default function Home({ session }) {
  console.log(session);
  return (
    <HomePage />
  )
}


export async function getServerSideProps(context) {

  const session = await getSession(context);


  // if (!session) {
  //   return {
  //     redirect: {
  //       destination: "/login",
  //       permanent: false
  //     }
  //   }
  // }

  return {
    props: {
      session
    }
  }
} 
