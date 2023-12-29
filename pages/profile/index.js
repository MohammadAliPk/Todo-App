import ProfilePage from "@/components/templates/ProfilePage"
import { getSession } from "next-auth/react";

function Index() {
    return (
        <ProfilePage />
    )
}

export default Index;

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
        props: {

        }
    }
} 