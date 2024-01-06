import React, { useEffect, useState } from 'react'
import Login from '../Login/Login'
import Register from '../Register/Register';
import homepage from '../../assets/homepage.jpg';
import { RxCross2 } from 'react-icons/rx'

function Homepage() {

    const [page, setPage] = useState("login");
    const [view, setView] = useState(true);

    useEffect(() => {
        if (page === "login")
            document.title = "Bankify | Login"
        else
            document.title = "Bankify | Register"
    }, [page])

    return (
        <div className='w-full h-full flex items-center justify-center gap-6'>
            <div className='hidden md:flex flex-col justify-center items-center gap-3 w-1/2 h-full overflow-y-auto'>
                <img
                    src={homepage}
                    alt='Image'
                    className='rounded-md h-64 w-64 mb-3 shadow-md'
                />
                <div className='text-4xl leading-none font-semibold'>Bankify</div>
                <div className='text-lg leading-none font-medium'>Banking made simple.</div>
            </div>
            <div className='flex items-center gap-4 w-full md:w-1/2 h-full bg-white overflow-y-auto relative'>
                {view
                    ? <div className='absolute top-0 right-0 left-0 p-4 text-white text-xl leading-none m-3 bg-green-500 rounded-md flex justify-between items-center'>
                        Welcome to Bankify!
                        <RxCross2
                            onClick={() => setView(false)}
                            className='cursor-pointer'
                        />
                    </div>
                    : null
                }
                {page == "login" ? <Login setPage={setPage} /> : <Register setPage={setPage} />}
            </div>
        </div>
    )
}

export default Homepage