import { useState } from "react";
import RadioButton from "../elements/RadioButton";
import axios from "axios";

// icons
import { GrAddCircle } from "react-icons/gr";
import { BsAlignStart } from "react-icons/bs";
import { FiSettings } from "react-icons/fi";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdDoneAll } from "react-icons/md";
import { toast } from "react-toastify";


function AddTodoPage() {

    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("todo");
    const [description, setDescription] = useState("");


    const addHandler = async () => {
        try {
            const res = await axios.post("/api/todos", {
                title: title,
                status: status,
                description: description
            })
            toast.success(res.data.message);
        } catch (err) {
            const errMsg = err.response.data.message;
            toast.error(errMsg);
        }
    }

    return (
        <div className="add-form">
            <h2><GrAddCircle /> Add New Todo</h2>
            <div className="add-form__input">
                <div className="add-form__input--first">
                    <label htmlFor="title">Title:</label>
                    <input type="text" value={title} id="title" onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div className="add-form__input--first">
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" onChange={(e) => setDescription(e.target.value)} />
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
                <button onClick={addHandler}>Add</button>
            </div>
        </div >
    )
}

export default AddTodoPage;