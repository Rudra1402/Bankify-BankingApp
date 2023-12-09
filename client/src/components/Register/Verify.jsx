import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { verifyToken } from '../../apis/apis';

function Verify() {

    const [isTokenVerified, setIsTokenVerified] = useState(false)
    const [message, setMessage] = useState('')

    useEffect(() => {
        let checkToken = null;
        checkToken = window.location.pathname.split('/').pop();
        verifyToken(checkToken, setMessage, setIsTokenVerified)
    }, [])

    return (
        <div className='w-full h-full flex flex-col gap-4 justify-center items-center'>
            {isTokenVerified && message}
            <p className='text-sm'>Continue to <Link to={'/'} className='text-red-400'>Login</Link></p>
        </div>
    )
}

export default Verify