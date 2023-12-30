import { RiMastodonLine } from "react-icons/ri"
import { BiRightArrow, BiLeftArrow } from "react-icons/bi"
import { LuPencilLine } from "react-icons/lu";
import axios from "axios"
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'
import { useState } from "react";

function Tasks({ data, next, back, fetchTodos }) {
    const changeStatus = async (id, status) => {
        const res = await axios.patch("/api/todos", { id, status })

        if (res.data.status === "Success") fetchTodos();
    }

    const [showSkeletons, setShowSkeletons] = useState(true);


    const timer = setTimeout(() => {
        setShowSkeletons(false);
    }, 3000);

    return (
        <div div className='tasks' >

            {data ? data?.map(i => (
                <div key={i._id} className='tasks__card'>
                    <div className="task-edit">
                        <Link href={`/todo-details/${i._id}`}>
                            <LuPencilLine />
                        </Link>
                    </div>
                    <span className={i.status}></span>
                    <RiMastodonLine />
                    <h4>{i.title}</h4>
                    <div className="description">
                        {i.description}
                    </div>
                    <div>
                        {back ? <button className="button-back" onClick={() => changeStatus(i._id, back)}><BiLeftArrow /> Back</button> : null}
                        {next ? <button className="button-next" onClick={() => changeStatus(i._id, next)}>Next <BiRightArrow /></button> : null}
                    </div>
                </div>
            ))
                : showSkeletons ? <div className='tasks__card'>
                    <div className="task-edit">
                        <Skeleton count={1} width={30} height={30} />
                    </div>
                    <Skeleton count={1} height={3} width={150} />
                    <Skeleton count={1} height={10} width={10} />
                    <Skeleton count={1} width={100} height={25} />
                    <div className="description">
                        <Skeleton width={300} height={5} count={3} />
                    </div>
                    <div>
                        {back ? <Skeleton height={35} /> : null}
                        {next ? <Skeleton height={35} width={70} style={{ position: "absolute", right: "10px" }} /> : null}
                    </div>
                </div> : null}
        </div >
    )
}

export default Tasks