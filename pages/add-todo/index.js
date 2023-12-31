import AddTodoPage from '@/components/templates/AddTodoPage'
import { getSession, useSession } from 'next-auth/react';

function Index() {
    const { status } = useSession();
    console.log(status)
    return (
        <AddTodoPage />
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
            session
        }
    }
} 