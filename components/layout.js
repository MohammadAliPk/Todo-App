import React from 'react'
import Link from 'next/link'

// Icons
import { VscListSelection } from "react-icons/vsc"
import { RxDashboard } from "react-icons/rx"
import { BiMessageSquareAdd } from "react-icons/bi"

function Layout({ children }) {
    return (
        <div className='container'>
            <header>
                Todo App
            </header>
            <div className='container--main'>
                <aside>
                    <p>Welcome</p>
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
                    </ul>
                </aside>
                <section>
                    {children}
                </section>
            </div>

        </div>
    )
}

export default Layout