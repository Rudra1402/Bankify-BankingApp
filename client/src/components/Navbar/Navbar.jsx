import React from 'react'
import { TbLogout } from 'react-icons/tb'
import { Link } from 'react-router-dom'
import dummyuser from '../../assets/dummyuser.jpg'

function Navbar({ user, setUser }) {
    return (
        <div className='bg-gray-100 flex items-center justify-end h-16 w-full py-2 px-8 border-b border-b-gray-200'>
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