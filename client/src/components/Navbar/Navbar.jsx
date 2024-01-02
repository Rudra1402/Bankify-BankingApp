import React, { useEffect, useState } from 'react'
import { TbLogout } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import dummyuser from '../../assets/dummyuser.jpg'
import { IoIosNotifications } from "react-icons/io";
import { getNotifications } from '../../apis/apis';
import { formatTimeSince } from '../../utils/timesince';

function Navbar({ user, setUser }) {
    const [notifs, setNotifs] = useState(null);
    const [viewNotifs, setViewNotifs] = useState(false);
    useEffect(() => {
        if (user) {
            getNotifications(user?.id, setNotifs);
        }
    }, [user]);
    const viewNotifications = (
        <div
            className='absolute top-8 right-0 bg-gray-200 text-gray-700 rounded-md p-2 w-96 h-fit max-h-[476px] overflow-y-auto flex flex-col gap-y-2 z-40 shadow-md border border-gray-300'
        >
            <div className='text-lg leading-none p-1 text-gray-800'>
                Notifications ({notifs?.length})
            </div>
            {notifs?.length > 0
                ? notifs?.map((notif, index) => {
                    let notifMessage;
                    if (notif?.notificationType == 1)
                        notifMessage = " added you as a contact!";
                    if (notif?.notificationType == 2)
                        notifMessage = " transferred you money!";
                    if (notif?.notificationType == 3)
                        notifMessage = " requested you for money!";
                    return (
                        <div
                            className='w-full h-16 flex items-center justify-between rounded gap-2 bg-gray-50 px-2 py-1'
                            key={index}
                        >
                            <div>{notif?.from?.firstName + " " + notif?.from?.lastName}{notifMessage}</div>
                            <div className='text-sm leading-none whitespace-nowrap'>
                                {formatTimeSince(notif?.date)}
                            </div>
                        </div>
                    )
                })
                : <div>No notifications</div>
            }

        </div>
    );
    return (
        <div className='bg-gray-100 flex items-center justify-end gap-x-6 h-16 w-full py-2 px-8 border-b border-b-gray-200'>
            <div className='relative'>
                {viewNotifs ? viewNotifications : null}
                <IoIosNotifications
                    className='text-red-500 text-3xl leading-none cursor-pointer'
                    onClick={() => {
                        if (!viewNotifs)
                            setViewNotifs(true);
                        else
                            setViewNotifs(false);
                    }}
                />
                <div
                    className='absolute -top-1.5 -right-1.5 text-xs leading-none h-5 w-5 flex items-center justify-center rounded-md bg-blue-500 text-white'
                    onClick={() => {
                        if (!viewNotifs)
                            setViewNotifs(true);
                        else
                            setViewNotifs(false);
                    }}
                >
                    {notifs?.length}
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
    )
}

export default Navbar