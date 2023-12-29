import React, { useState } from 'react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'

// Icons
import { VscListSelection } from "react-icons/vsc"
import { RxDashboard } from "react-icons/rx"
import { BiMessageSquareAdd } from "react-icons/bi"
import { FiLogOut, FiLogIn } from 'react-icons/fi'

function Layout({ children }) {

    const [isOpen, setIsOpen] = useState(false)

    const { status } = useSession();

    const logOutHandler = () => {
        signOut();
    }

    return (
        <div className='container'>
            <header>
                Todo App
                <div className={isOpen ? "aside-close" : "menu-open__button"} onClick={() => setIsOpen(true)}>
                    <div className='menu-lines'></div>
                    <div className='menu-lines'></div>
                    <div className='menu-lines'></div>
                </div>
            </header>
            <div className='container--main'>
                <aside className={isOpen ? null : "aside-close"}>
                    <p>Welcome</p>
                    <div className='menu-close__button' onClick={() => setIsOpen(false)}>
                        <div className='menu-close-lines'></div>
                        <div className='menu-close-lines'></div>
                    </div>
                    {status === "authenticated" ?
                        <ul>
                            <li>
                                <VscListSelection />
                                <Link href="/" onClick={() => setIsOpen(false)}>Todos</Link>
                            </li>
                            <li>
                                <BiMessageSquareAdd />
                                <Link href="/add-todo" onClick={() => setIsOpen(false)}>Add Todo</Link>
                            </li>
                            <li>
                                <RxDashboard />
                                <Link href="/profile" onClick={() => setIsOpen(false)}>Profile</Link>
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