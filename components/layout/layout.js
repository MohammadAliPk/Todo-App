import React from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

// Icons
import { VscListSelection } from "react-icons/vsc"
import { RxDashboard } from "react-icons/rx"
import { BiMessageSquareAdd } from "react-icons/bi"
import { FiLogOut, FiLogIn } from 'react-icons/fi'

function Layout({ children }) {

    const { status } = useSession();

    const logOutHandler = () => {
        signOut();
    }

    return (
        <div className='container'>
            <header>
                Todo App
            </header>
            <div className='container--main'>
                <aside>
                    <p>Welcome</p>
                    {status === "authenticated" ?
                        <ul>
                            <li>
                                <VscListSelection />
                                <Link href="/">Todos</Link>
                            </li>
                            <li>
                                <BiMessageSquareAdd />
                                <Link href="/add-todo">Add Todo</Link>
                            </li>
                            <li>
                                <RxDashboard />
                                <Link href="/profile">Profile</Link>
                            </li>
                            <li>
                                <button onClick={logOutHandler}><FiLogOut /></button>
                            </li>
                        </ul> : null
                    }
                    {status === "unauthenticated" ? <ul>
                        <li>
                            <FiLogIn />
                            <Link href="/login">Login</Link>
                        </li>
                        <li>
                            <BiMessageSquareAdd />
                            <Link href="/signup">Sign Up</Link>
                        </li>
                    </ul> : null}

                </aside>
                <section>
                    {children}
                </section>
            </div>

        </div>
    )
}

export default Layout