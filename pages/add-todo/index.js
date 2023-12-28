import AddTodoPage from '@/components/templates/AddTodoPage'
import { getSession } from 'next-auth/react';

function Index() {
    return (
        <AddTodoPage />
    )
}

export default Index;

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