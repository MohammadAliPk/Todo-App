import { RiMastodonLine } from "react-icons/ri"
import { BiRightArrow, BiLeftArrow } from "react-icons/bi"
import axios from "axios"

function Tasks({ data, next, back, fetchTodos }) {
    const changeStatus = async (id, status) => {
        const res = await axios.patch("/api/todos", { id, status })

        if (res.data.status === "Success") fetchTodos();
    }

    return (
        <div className='tasks'>
            {data?.map(i => (
                <div key={i._id} className='tasks__card'>
                    <span className={i.status}></span>
                    <RiMastodonLine />
                    <h4>{i.title}</h4>
                    <div>
                        {back ? <button className="button-back" onClick={() => changeStatus(i._id, back)}><BiLeftArrow /> Back</button> : null}
                        {next ? <button className="button-next" onClick={() => changeStatus(i._id, next)}>Next <BiRightArrow /></button> : null}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Tasks