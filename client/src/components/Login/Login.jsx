import React, { useEffect, useContext } from 'react'
import CustomForm from '../../custom/CustomForm'
import CustomInput from '../../custom/CustomInput'
import CustomButton from '../../custom/CustomButton'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { userLogin } from '../../apis/apis'
import AppContext from '../../context/AppContext'
import Toast from '../../custom/CustomToast'

const validationSchema = Yup.object({
    email: Yup.string().email().required('Email is required!'),
    password: Yup.string().required('Password is required!')
})

function Login({ setPage }) {

    const { user, setUser } = useContext(AppContext);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit(values) {
            userLogin(values, setUser)
            formik.resetForm()
        }
    })

    useEffect(() => {
        let userItem = JSON.parse(localStorage.getItem('user'))
        if (userItem?.token) {
            navigate('/dashboard')
            Toast.success(`Welcome ${userItem?.username}!`)
        }
    }, [user])

    return (
        <div className='h-full w-full flex flex-col justify-center items-center gap-6'>
            <div
                className='text-3xl text-gray-700 font-semibold mb-2 underline underline-offset-[16px] tracking-wide'
            >
                Login
            </div>
            <CustomForm
                className='gap-4 items-center'
                onSubmit={formik.handleSubmit}
            >
                <CustomInput
                    name={"email"}
                    required={true}
                    type='email'
                    size='large'
                    placeholder="Email"
                    extraClass='!border-gray-300'
                    value={formik.values.email}
                    onChange={e => formik.setFieldValue("email", e.target.value)}
                />
                <div className='flex flex-col gap-1'>
                    <CustomInput
                        name={"password"}
                        type='password'
                        required={true}
                        size='large'
                        placeholder="Password"
                        extraClass='!border-gray-300'
                        value={formik.values.password}
                        onChange={e => formik.setFieldValue("password", e.target.value)}
                    />
                    <Link
                        className='text-blue-500 w-full flex justify-end text-sm'
                        to={'/forgot-password'}
                    >Forgot password?</Link>
                </div>
                <CustomButton
                    text="Login"
                    size='small'
                    type="submit"
                />
            </CustomForm>
            <div className='flex items-center gap-1 text-lg text-gray-500'>
                Create an account?
                <div
                    onClick={() => setPage("register")}
                    className='cursor-pointer text-green-600'
                >Register</div>
            </div>
        </div>
    )
}

export default Login