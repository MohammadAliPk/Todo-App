
import DetailsPage from '@/components/templates/DetailsPage';
import User from '@/models/User';
import connectDB from '@/utils/connectDB';
import { getSession } from 'next-auth/react';

const Index = ({ todo }) => {


    return (
        <DetailsPage data={todo} />
    );
};

export default Index;


export async function getServerSideProps(context) {
    try {
        await connectDB();
    } catch (err) {
        console.log(err);
    }

    const { params: { id } } = context;

    const session = await getSession(context);

    if (!session) {
        return {
            redirect: {
                destination: "/login",
                permanent: false
            }
        }
    }

    const user = await User.findOne({ email: session.user.email });
    const todos = await user.todos;
    const todo = JSON.parse(JSON.stringify(todos.find(i => String(i._id) === id)));

    return {
        props: {
            todo
        },
    };
};