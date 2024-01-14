import React, { useState, useEffect, useContext } from 'react'
import { FaCaretUp, FaCaretDown } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { getAdminUsers } from '../../apis/apis';
import AppContext from '../../context/AppContext';
import CustomCard from '../../custom/CustomCard'
import CustomLoader from '../../custom/CustomLoader';
import AdminDashboardLayout from '../../Layouts/AdminDashboardLayout';

function UsersList() {

    const { user } = useContext(AppContext);

    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState(null);
    const [isAdmin, setIsAdmin] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userItem = JSON.parse(localStorage.getItem("user"));
        if (userItem?.token) {
            if (userItem?.isAdmin)
                setIsAdmin(true)
            else
                setIsAdmin(false)
        }
    }, [])

    useEffect(() => {
        setLoading(true)
        if (isAdmin !== null) {
            if (isAdmin) {
                getAdminUsers(isAdmin, setUsers, setLoading);
            } else {
                navigate('/dashboard');
            }
        }
    }, [isAdmin])

    return (
        <AdminDashboardLayout>
            {loading
                ? <CustomLoader
                    rows={1}
                    rowClass="!bg-gray-100 flex items-center justify-center"
                    text='Loading...'
                    height={"100%"}
                    width={"100%"}
                />
                : <CustomCard
                    className='w-full h-full py-4 px-6 text-gray-700 flex flex-col gap-y-4 relative'
                >
                    <div className='flex items-center w-full min-h-[60px] rounded overflow-hidden'>
                        <div
                            className='w-[30%] h-full flex items-center gap-x-2.5 justify-start p-3 bg-blue-200'
                        >
                            Full Name
                            <div className='flex flex-col gap-0 items-center'>
                                <FaCaretUp size={12} className='text-xs leading-none hover:bg-gray-400 rounded-sm' />
                                <FaCaretDown size={12} className='text-xs leading-none hover:bg-gray-400 rounded-sm' />
                            </div>
                        </div>
                        <div
                            className='w-[30%] h-full flex items-center gap-x-2.5 justify-start p-3 bg-blue-200'
                        >
                            Username
                            <div className='flex flex-col gap-0 items-center'>
                                <FaCaretUp size={12} className='text-xs leading-none hover:bg-gray-400 rounded-sm' />
                                <FaCaretDown size={12} className='text-xs leading-none hover:bg-gray-400 rounded-sm' />
                            </div>
                        </div>
                        <div
                            className='w-[30%] h-full flex items-center gap-x-2.5 justify-start p-3 bg-blue-200'
                        >
                            Email
                            <div className='flex flex-col gap-0 items-center'>
                                <FaCaretUp size={12} className='text-xs leading-none hover:bg-gray-400 rounded-sm' />
                                <FaCaretDown size={12} className='text-xs leading-none hover:bg-gray-400 rounded-sm' />
                            </div>
                        </div>
                        <div className='w-[10%] h-full flex items-center justify-start p-3 bg-blue-200'></div>
                    </div>
                    <div className='flex flex-col gap-y-2 w-full h-full overflow-y-auto'>
                        {users?.map((user, index) => (
                            <div
                                className='flex items-center w-full min-h-[50px] rounded overflow-hidden'
                                key={index}
                            >
                                <div className='w-[30%] h-full flex items-center justify-start p-3 bg-gray-200'>
                                    {
                                        user?.firstName ? `${user?.firstName} ` : ''
                                    }
                                    {
                                        user?.lastName ? user?.lastName : ''
                                    }
                                    {!user?.firstName && !user?.lastName ? 'Not Updated' : ''}
                                </div>
                                <div className='w-[30%] h-full flex items-center justify-start p-3 bg-gray-200'>
                                    {user?.username}
                                </div>
                                <div className='w-[30%] h-full flex items-center justify-start p-3 bg-gray-200'>
                                    {user?.email}
                                </div>
                                <div className='w-[10%] h-full p-3 flex items-center justify-end bg-gray-200'>
                                </div>
                            </div>
                        ))}
                    </div>
                </CustomCard>
            }
        </AdminDashboardLayout>
    )
}

export default UsersList