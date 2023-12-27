import axios from "axios";
import { useEffect, useState } from "react"
import Tasks from "../modules/Tasks";

function HomePage() {

    const [todos, setTodos] = useState([]);

    const fetchTodos = async () => {
        const res = await axios.get("/api/todos");
        const data = res.data;
        if (data.status === "Success") {
            setTodos(data.data.todos);
        }
    }

    useEffect(() => {
        fetchTodos();
    }, [])


    return (
        <div className="home-page">
            <div className="home-page--todo">
                <p>
                    Todo
                </p>
                <Tasks data={todos.todo} />
            </div>
            <div className="home-page--inProgress">
                <p>
                    In progress
                </p>
                <Tasks data={todos.inProgress} />
            </div>
            <div className="home-page--review">
                <p>
                    Review
                </p>
                <Tasks data={todos.review} />

            </div>
            <div className="home-page--done">
                <p>
                    Done
                </p>
                <Tasks data={todos.done} />

            </div>
        </div>
    )
}

export default HomePage;