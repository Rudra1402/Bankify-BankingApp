import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MdOutlineManageAccounts } from 'react-icons/md'
import { TbLogout } from 'react-icons/tb'
import classNames from 'classnames';

function AdminSidebar({ setUser, openSidebar }) {
    const [activePath, setActivePath] = useState("/dashboard");
    useEffect(() => {
        let urlPath = window.location.pathname;
        setActivePath(urlPath);
    }, [activePath])
    return (
        <div className='flex flex-col justify-between h-full w-full overflow-y-auto'>
            <div className='flex flex-col justify-start'>
                {openSidebar
                    ? <Link to={'/dashboard-admin'} className='h-12 text-xl leading-none flex items-center justify-center bg-red-500 text-gray-100 rounded-md'>
                        Bankify
                    </Link>
                    : <Link to={'/dashboard-admin'} className='h-12 text-xl leading-none flex items-center justify-center bg-red-500 text-gray-100 rounded-md'>
                        B
                    </Link>
                }
                {openSidebar
                    ? <div className='flex flex-col gap-y-4 py-8 px-4'>
                        <Link
                            to={'/dashboard-admin/users'}
                            className={classNames(
                                'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                                activePath == '/dashboard-admin/users' ? 'bg-green-300' : ''
                            )}
                        >
                            <MdOutlineManageAccounts
                                className='text-2xl leading-none'
                                title='Users'
                            />Users
                        </Link>
                    </div>
                    : <div className='flex flex-col gap-y-8 py-10 px-1'>
                        <Link
                            to={'/dashboard-admin/users'}
                            className='flex items-center justify-center gap-3 text-xl leading-none px-3'
                        >
                            <MdOutlineManageAccounts
                                className='text-2xl leading-none'
                                title='Users'
                            />
                        </Link>
                    </div>
                }
            </div>
        </div>
    )
}

export default AdminSidebar