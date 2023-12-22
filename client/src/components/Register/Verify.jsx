import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { verifyToken } from '../../apis/apis';
import CustomButton from '../../custom/CustomButton';
import Toast from '../../custom/CustomToast';

function Verify() {

    const [isTokenVerified, setIsTokenVerified] = useState(false)
    const [message, setMessage] = useState('')
    const [token, setToken] = useState(null);

    useEffect(() => {
        let checkToken = null;
        checkToken = window.location.pathname.split('/').pop();
        setToken(checkToken);
    }, [])

    return (
        <div className='w-full h-full flex flex-col gap-6 justify-center items-center text-lg'>
            {isTokenVerified && message}
            {!isTokenVerified
                ? <CustomButton
                    text='Click to verify'
                    onClick={() => verifyToken(token, setMessage, setIsTokenVerified)}
                    size='small'
                    disabled={token ? false : true}
                    className='!text-base px-4 !w-fit'
                />
                : <p className='text-lg leading-none'>Continue to <Link to={'/'} className='text-gray-700 bg-green-500 p-1 rounded underline underline-offset-2'>Login</Link></p>
            }
        </div>
    )
}

export default Verify