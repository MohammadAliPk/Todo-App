import Link from 'next/link';
import { VscListSelection, VscDashboard, VscSettingsGear } from 'react-icons/vsc';
import { BiLogOut } from 'react-icons/bi';
import { signOut, useSession } from 'next-auth/react';

function Layout({ children }) {
    const { status } = useSession();

    const logoutHandler = () => {
        signOut();
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col justify-between p-6 fixed h-full z-10">
                <div>
                    <h1 className="text-2xl font-bold text-blue-600 mb-10 flex items-center gap-2">
                        <VscListSelection /> Todo App
                    </h1>
                    <nav className="space-y-4">
                        <Link href="/" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                            <VscDashboard className="text-xl" /> Dashboard
                        </Link>
                        <Link href="/profile" className="flex items-center gap-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors">
                            <VscSettingsGear className="text-xl" /> Settings
                        </Link>
                    </nav>
                </div>
                {status === "authenticated" && (
                    <button onClick={logoutHandler} className="flex items-center gap-2 text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors w-full">
                        <BiLogOut className="text-xl" /> Logout
                    </button>
                )}
            </aside>
            <main className="flex-1 md:ml-64 p-8">
                {children}
            </main>
        </div>
    );
}

export default Layout;