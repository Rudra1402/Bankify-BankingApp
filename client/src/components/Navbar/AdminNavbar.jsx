import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

function AdminNavbar({ user, setUser }) {
    return (
        <div className='bg-gray-100 flex items-center justify-end gap-x-6 h-16 w-full py-2 px-8 border-b border-b-gray-200'>
            <Link
                to={'/dashboard'}
                className='rounded bg-blue-500 text-white text-sm leading-none p-2'
            >
                Go back
            </Link>
        </div>
    )
}

export default AdminNavbar