import React, { useState } from 'react'
import CustomCard from '../../custom/CustomCard'
import { MdKeyboardBackspace } from 'react-icons/md'
import { Link, useNavigate } from 'react-router-dom'
import CustomInput from '../../custom/CustomInput'
import CustomButton from '../../custom/CustomButton'
import { resetPassword } from '../../apis/apis'

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
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
            <div className='flex flex-col gap-3'>
                <CustomInput
                    name={"email"}
                    required={true}
                    type='email'
                    label='Enter your email...'
                    labelClass='!text-gray-300'
                    size='large'
                    placeholder="Email"
                    extraClass='!border-gray-300'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <CustomButton
                    text='Send link'
                    size='small'
                    className='!bg-red-500 !text-base !w-full'
                    onClick={() => resetPassword(email)}
                />
            </div>
        </CustomCard>
    )
}

export default ForgotPassword