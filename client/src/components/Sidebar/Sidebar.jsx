import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineManageAccounts } from 'react-icons/md'
import { IoIosContacts } from 'react-icons/io'
import { BiTransfer } from 'react-icons/bi'
import { TbLogout } from 'react-icons/tb'
import classNames from 'classnames';

function Sidebar({ setUser, openSidebar }) {
    const [activePath, setActivePath] = useState("/dashboard");
    useEffect(() => {
        let urlPath = window.location.pathname;
        setActivePath(urlPath);
    }, [activePath])
    return (
        <div className='flex flex-col justify-between h-full w-full overflow-y-auto'>
            <div className='flex flex-col justify-start'>
                {openSidebar
                    ? <Link to={'/dashboard'} className='h-12 text-xl leading-none flex items-center justify-center bg-red-500 text-gray-100 rounded-md'>
                        Bankify
                    </Link>
                    : <Link to={'/dashboard'} className='h-12 text-xl leading-none flex items-center justify-center bg-red-500 text-gray-100 rounded-md'>
                        B
                    </Link>
                }
                {openSidebar
                    ? <div className='flex flex-col gap-y-4 py-8 px-4'>
                        <Link
                            to={'/dashboard/accounts'}
                            className={classNames(
                                'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                                activePath == '/dashboard/accounts' ? 'bg-green-300' : ''
                            )}
                        >
                            <MdOutlineManageAccounts
                                className='text-2xl leading-none'
                                title='Accounts'
                            />Accounts
                        </Link>
                        <Link
                            to={'/dashboard/transfers'}
                            className={classNames(
                                'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                                activePath == '/dashboard/transfers' ? 'bg-green-300' : ''
                            )}
                        >
                            <BiTransfer
                                className='text-2xl leading-none'
                                title='Transfers'
                            />Transfers
                        </Link>
                        <Link
                            to={'/dashboard/contacts'}
                            className={classNames(
                                'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                                activePath == '/dashboard/contacts' ? 'bg-green-300' : ''
                            )}
                        >
                            <IoIosContacts
                                className='text-2xl leading-none'
                                title='Contacts'
                            />Contacts
                        </Link>
                        <Link
                            to={'/dashboard/profile'}
                            className={classNames(
                                'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                                activePath == '/dashboard/profile' ? 'bg-green-300' : ''
                            )}
                        >
                            <CgProfile
                                className='text-2xl leading-none'
                                title='Profile'
                            />Profile
                        </Link>
                    </div>
                    : <div className='flex flex-col gap-y-8 py-10 px-1'>
                        <Link
                            to={'/dashboard/accounts'}
                            className='flex items-center justify-center gap-3 text-xl leading-none px-3'
                        >
                            <MdOutlineManageAccounts
                                className='text-2xl leading-none'
                                title='Accounts'
                            />
                        </Link>
                        <Link
                            to={'/dashboard/transfers'}
                            className='flex items-center justify-center gap-3 text-xl leading-none px-3'
                        >
                            <BiTransfer
                                className='text-2xl leading-none'
                                title='Transfers'
                            />
                        </Link>
                        <Link
                            to={'/dashboard/contacts'}
                            className='flex items-center justify-center gap-3 text-xl leading-none px-3'
                        >
                            <IoIosContacts
                                className='text-2xl leading-none'
                                title='Contacts'
                            />
                        </Link>
                        <Link
                            to={'/dashboard/profile'}
                            className='flex items-center justify-center gap-3 text-xl leading-none px-3'
                        >
                            <CgProfile
                                className='text-2xl leading-none'
                                title='Profile'
                            />
                        </Link>
                    </div>
                }
            </div>
            {openSidebar
                ?
                <div className='flex px-10 py-3'>
                    <div
                        className='flex gap-2 cursor-pointer items-center text-xl'
                        onClick={() => {
                            setUser(null)
                            localStorage.removeItem("user")
                        }}
                    >
                        <TbLogout
                            className='text-2xl leading-none'
                            title='Logout'
                        />
                        Logout
                    </div>
                </div>
                : <div className='flex px-4 py-3'>
                    <div
                        className='w-full flex gap-2 cursor-pointer items-center justify-center'
                        onClick={() => {
                            setUser(null)
                            localStorage.removeItem("user")
                        }}
                    >
                        <TbLogout
                            className='text-2xl leading-none'
                            title='Logout'
                        />
                    </div>
                </div>
            }
        </div>
    )
}

export default Sidebar