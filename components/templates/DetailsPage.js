import { useState } from "react";
import { LuPencilLine } from "react-icons/lu";
import RadioButton from "../elements/RadioButton";
import { BsAlignStart } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdDoneAll } from "react-icons/md";
import axios from "axios";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

function DetailsPage({ data }) {

    const [todo, setTodo] = useState(data);
    const [title, setTitle] = useState(data.title);
    const [description, setDescription] = useState(data.description);
    const [status, setStatus] = useState(data.status);

    const router = useRouter();
    const { query: { id } } = router;



    const editHandler = async () => {
        try {
            const res = await axios.post("/api/edit", {
                title: title,
                description: description,
                status: status,
                id: id
            })
            const data = res.data;
            toast.success(data.message);
        } catch (err) {
            const errMsg = err.response.data.message;
            toast.error(errMsg);
        }
    }


    return (

        < div className="details-container" >
            {
                todo ?
                    <>
                        < h4 > Title: {todo.title}</h4 >
                        <span className={todo.status}>{todo.status}</span>
                        <p>{todo.description}</p>
                        <button onClick={() => setTodo()}> Edit <LuPencilLine /> </button>
                    </>
                    :
                    <>
                        <div className="add-form__input">
                            <div className="add-form__input--first">
                                <label htmlFor="title">Title:</label>
                                <input type="text" value={title} id="title" onChange={(e) => setTitle(e.target.value)} />
                            </div>
                            <div className="add-form__input--first">
                                <label htmlFor="description">Description:</label>
                                <textarea value={description} id="description" onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="add-form__input--second">
                                <RadioButton
                                    title="Todo"
                                    status={status}
                                    setStatus={setStatus}
                                    value="todo">
                                    <BsAlignStart />
                                </RadioButton>
                                <RadioButton
                                    title="In Progress"
                                    status={status}
                                    setStatus={setStatus}
                                    value="inProgress">
                                    <FiSettings />
                                </RadioButton>
                                <RadioButton
                                    title="Review"
                                    status={status}
                                    setStatus={setStatus}
                                    value="review">
                                    <AiOutlineFileSearch />
                                </RadioButton>
                                <RadioButton
                                    title="Done"
                                    status={status}
                                    setStatus={setStatus}
                                    value="done">
                                    <MdDoneAll />
                                </RadioButton>
                            </div>
                            <button onClick={editHandler}>Edit</button>
                        </div>
                    </>
            }
        </div >
    )
}

export default DetailsPage;