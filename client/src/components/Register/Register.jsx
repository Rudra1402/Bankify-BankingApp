import React from 'react'
import CustomButton from '../../custom/CustomButton'
import CustomForm from '../../custom/CustomForm'
import CustomInput from '../../custom/CustomInput'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { userRegister } from '../../apis/apis'
import { Link } from 'react-router-dom'

const validationSchema = Yup.object({
    username: Yup.string().required('Username is required!'),
    email: Yup.string().email().required('Email is required!'),
    password: Yup.string().required('Password is required!')
})

function Register({ setPage }) {

    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit(values) {
            userRegister(values)
            formik.resetForm()
        }
    })

    return (
        <div className='h-full w-full flex flex-col justify-center items-center gap-6'>
            <div className='text-3xl font-semibold mb-2 underline underline-offset-[16px] tracking-wide text-gray-700'>Register</div>
            <CustomForm
                className='gap-4 items-center'
                onSubmit={formik.handleSubmit}
            >
                <CustomInput
                    name={"username"}
                    required={true}
                    type='text'
                    size='large'
                    placeholder="Username"
                    extraClass='!border-gray-300'
                    value={formik.values.username}
                    onChange={e => formik.setFieldValue("username", e.target.value)}
                />
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
                <CustomButton
                    text="Register"
                    size='small'
                    type="submit"
                />
            </CustomForm>
            <div className='flex items-center gap-1 text-lg text-gray-500'>
                Already have an account?
                <div
                    onClick={() => setPage("login")}
                    className='text-green-600 cursor-pointer'
                >Login</div>
            </div>
        </div>
    )
}

export default Register