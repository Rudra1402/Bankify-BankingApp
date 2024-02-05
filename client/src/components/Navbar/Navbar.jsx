import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import dummyuser from '../../assets/dummyuser.jpg'
import { IoIosNotifications } from "react-icons/io";
import { formatTimeSince } from '../../utils/timesince';
import { useContext } from 'react';
import AppContext from '../../context/AppContext';
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import classNames from 'classnames';

function Navbar({ user, setUser }) {
    const { notifications, setNotifications } = useContext(AppContext);
    const [viewNotifs, setViewNotifs] = useState(false);
    const viewNotificationsRef = useRef(null);

    const handleDocumentClick = (event) => {
        if (viewNotificationsRef.current && !viewNotificationsRef.current.contains(event.target)) {
            setViewNotifs(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleDocumentClick);
        return () => {
            document.removeEventListener('click', handleDocumentClick);
        };
    }, []);

    const [activePath, setActivePath] = useState("/dashboard");
    const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
    useEffect(() => {
        let urlPath = window.location.pathname;
        setActivePath(urlPath);
    }, [activePath])

    const viewNotifications = (
        <div
            ref={viewNotificationsRef}
            className='absolute top-8 -right-16 sm2:right-0 bg-gray-200 text-gray-700 rounded-md w-80 sm2:w-96 h-fit max-h-[400px] overflow-y-auto flex flex-col gap-y-1 z-40 shadow-md border border-gray-400'
        >
            <div className='text-lg leading-none px-2 py-3 text-gray-100 bg-green-500 rounded shadow-md'>
                Notifications ({notifications?.length})
            </div>
            <div className='px-2 pt-2 pb-3 flex flex-col gap-y-2'>
                {notifications?.length > 0
                    ? notifications?.map((notif, index) => {
                        let notifMessage;
                        if (notif?.notificationType == 1)
                            notifMessage = " added you as a contact!";
                        if (notif?.notificationType == 2)
                            notifMessage = " transferred you money!";
                        if (notif?.notificationType == 3)
                            notifMessage = " requested you for money!";
                        return (
                            <div
                                className='w-full h-16 flex items-center justify-between rounded gap-2 bg-gray-50 px-2 py-1 cursor-pointer shadow-md'
                                key={index}
                            >
                                <div>{notif?.from?.firstName || notif?.from?.lastName ? (notif?.from?.firstName + " " + notif?.from?.lastName) : (notif?.from?.username)}{notifMessage}</div>
                                <div className='text-sm leading-none whitespace-nowrap'>
                                    {formatTimeSince(notif?.date)}
                                </div>
                            </div>
                        )
                    })
                    : <div className='text-center'>No notifications</div>
                }
            </div>
        </div>
    );

    const hamburgerSidebar = (
        <div className='w-4/5 px-4 py-12 flex flex-col items-center gap-y-2.5 absolute top-0 bottom-0 left-0 bg-white shadow-lg text-gray-700 z-40'>
            <RxCross2
                className='text-2xl leading-none absolute top-5 left-6 cursor-pointer'
                onClick={() => setIsHamburgerOpen(false)}
            />
            <Link
                to={'/dashboard'}
                className={classNames(
                    'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                    activePath == '/dashboard' ? 'bg-green-300' : ''
                )}
            >
                Dashboard
            </Link>
            <Link
                to={'/dashboard/accounts'}
                className={classNames(
                    'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                    activePath == '/dashboard/accounts' ? 'bg-green-300' : ''
                )}
            >
                Accounts
            </Link>
            <Link
                to={'/dashboard/transfers'}
                className={classNames(
                    'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                    activePath == '/dashboard/transfers' ? 'bg-green-300' : ''
                )}
            >
                Transfers
            </Link>
            <Link
                to={'/dashboard/contacts'}
                className={classNames(
                    'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                    activePath == '/dashboard/contacts' ? 'bg-green-300' : ''
                )}
            >
                Contacts
            </Link>
            <Link
                to={'/dashboard/profile'}
                className={classNames(
                    'flex items-center gap-3 text-xl leading-none px-6 py-2 rounded-md',
                    activePath == '/dashboard/profile' ? 'bg-green-300' : ''
                )}
            >
                Profile
            </Link>
            <div
                className='flex gap-2 cursor-pointer items-center text-xl'
                onClick={() => {
                    setUser(null)
                    localStorage.removeItem("user")
                }}
            >
                Logout
            </div>
            <div
                className='absolute bottom-0 py-2 border-t border-t-gray-300 w-full text-center'
            >
                Bankify
            </div>
        </div>
    )

    return (
        <div className='bg-gray-100 flex items-center justify-between gap-x-6 h-16 w-full py-2 px-6 sm2:px-8 border-b border-b-gray-200'>
            {isHamburgerOpen ? hamburgerSidebar : null}
            <div className='sm2:hidden flex items-center gap-x-6'>
                <GiHamburgerMenu
                    className='text-2xl leading-none cursor-pointer'
                    onClick={() => setIsHamburgerOpen(true)}
                />
            </div>
            <div className='flex items-center gap-x-4 sm2:gap-x-6 flex-1 justify-end'>
                {user?.isAdmin
                    ? <Link
                        to={'/dashboard-admin'}
                        className='p-2 rounded bg-blue-500 text-white text-sm leading-none'
                    >
                        Admin
                    </Link>
                    : null
                }
                <div className='relative'>
                    {viewNotifs ? viewNotifications : null}
                    <IoIosNotifications
                        className='text-red-500 text-3xl leading-none cursor-pointer'
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!viewNotifs)
                                setViewNotifs(true);
                            else
                                setViewNotifs(false);
                        }}
                    />
                    <div
                        className='absolute -top-1.5 -right-1.5 text-xs leading-none h-5 w-5 flex items-center justify-center rounded-md bg-blue-500 text-white cursor-pointer'
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!viewNotifs)
                                setViewNotifs(true);
                            else
                                setViewNotifs(false);
                        }}
                    >
                        {notifications?.length}
                    </div>
                </div>
                <Link
                    to={'/dashboard/profile'}
                    className='h-11 w-11 rounded-full overflow-hidden flex justify-center border border-gray-700'
                >
                    <img
                        src={user?.profileImageUrl ? user?.profileImageUrl : dummyuser}
                        alt={user?.username}
                        className='h-full cursor-pointer w-auto'
                    />
                </Link>
            </div>
        </div>
    )
}

export default Navbar