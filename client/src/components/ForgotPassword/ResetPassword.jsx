import React, { useEffect, useState } from 'react'
import CustomCard from '../../custom/CustomCard'
import { Link, useNavigate } from 'react-router-dom'
import CustomLoader from '../../custom/CustomLoader';
import CustomInput from '../../custom/CustomInput';
import CustomButton from '../../custom/CustomButton';
import { verifyPassResetToken } from '../../apis/apis';
import { MdKeyboardBackspace } from 'react-icons/md';

function ResetPassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(true);
    const [isPassReset, setIsPassReset] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        setLoading(true)
        let checkToken = null;
        checkToken = window.location.pathname.split('/').pop();
        setToken(checkToken);
        setLoading(false)
    }, [])

    useEffect(() => {
        if (isPassReset) {
            navigate('/');
        }
    }, [isPassReset])

    return (
        <CustomCard
            className='flex flex-col items-center gap-8 h-full w-full'
        >
            <div className='flex items-center justify-between w-full h-16 py-1 px-8 bg-gray-100 text-blue-700'>
                <MdKeyboardBackspace
                    className="text-2xl leading-none cursor-pointer"
                    onClick={() => navigate(-1)}
                />
                <Link to={'/'} className='text-lg'>Login</Link>
            </div>
            {loading
                ? <CustomLoader
                    rows={1}
                    rowClass="!bg-gray-100 flex items-center justify-center"
                    text='Loading...'
                    height={"100%"}
                    width={"100%"}
                />
                : <div className='flex flex-col gap-3'>
                    <CustomInput
                        name={"password"}
                        required={true}
                        type='password'
                        label='Password'
                        labelClass='!text-gray-300'
                        size='large'
                        placeholder="Password..."
                        extraClass='!border-gray-300'
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                    <CustomInput
                        name={"password"}
                        required={true}
                        type='password'
                        label='Password'
                        labelClass='!text-gray-300'
                        size='large'
                        placeholder="Password..."
                        extraClass='!border-gray-300'
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                    />
                    <CustomButton
                        text='Reset password'
                        size='small'
                        className='!bg-red-500 !text-base !w-full'
                        onClick={() => verifyPassResetToken(token, password, confirmPassword, setIsPassReset)}
                    />
                </div>
            }
        </CustomCard>
    )
}

export default ResetPassword