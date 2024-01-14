import React, { useEffect, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import AppContext from '../context/AppContext'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa'
import Toast from '../custom/CustomToast'
import classNames from 'classnames';
import AdminSidebar from '../components/Sidebar/AdminSidebar';
import AdminNavbar from '../components/Navbar/AdminNavbar';

function AdminDashboardLayout({ children }) {

    const { user, setUser, openSidebar, setOpenSidebar } = useContext(AppContext);
    const navigate = useNavigate();
    // const [openSidebar, setOpenSidebar] = useState(true);

    useEffect(() => {
        let userItem = JSON.parse(localStorage.getItem('user'))
        if (!userItem?.token) {
            navigate('/')
            Toast.warn(`Please login!`)
        } else {
            if (!userItem?.isAdmin) {
                navigate('/dashboard')
                Toast.error('Unauthorized!')
            }
        }
    }, [user])

    const handleSidebarClickOpen = () => {
        setOpenSidebar(true)
    }

    const handleSidebarClickClose = () => {
        setOpenSidebar(false)
    }

    return (
        <div className='flex items-start w-full h-full bg-gray-100 text-gray-800 relative'>
            <div className={classNames('h-full p-2 relative', openSidebar ? 'w-1/5 min-w-[20%]' : 'w-[7.5%]')}>
                <AdminSidebar setUser={setUser} openSidebar={openSidebar} />
            </div>
            <div
                className={classNames(
                    'absolute z-40 cursor-pointer top-16 bg-blue-500 text-white border border-white rounded-full p-1',
                    openSidebar ? 'left-[19%]' : 'left-[6.5%]'
                )}
                onClick={() => {
                    if (openSidebar)
                        handleSidebarClickClose()
                    else
                        handleSidebarClickOpen()
                }}
            >
                {openSidebar
                    ? <FaChevronLeft className='text-xs' />
                    : <FaChevronRight className='text-xs' />
                }
            </div>
            <div className={classNames('flex flex-col h-full bg-white', openSidebar ? 'w-4/5' : 'w-[92.5%]')}>
                <AdminNavbar user={user} setUser={setUser} />
                <div className='p-2 flex-1 border-l border-l-white border-t border-t-white overflow-y-auto'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboardLayout