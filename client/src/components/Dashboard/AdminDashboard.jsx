import React, { useEffect, useState, useContext } from 'react'
import { getAdminDashboardData } from '../../apis/apis';
import AppContext from '../../context/AppContext';
import CustomCard from '../../custom/CustomCard';
import CustomLoader from '../../custom/CustomLoader';
import AdminDashboardLayout from '../../Layouts/AdminDashboardLayout'

function AdminDashboard() {

    const { user } = useContext(AppContext);

    const [adminDashData, setAdminDashData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        document.title = "Bankify | Admin"
        if (user) {
            getAdminDashboardData(user?.isAdmin, setAdminDashData, setLoading)
        }
    }, [])

    return (
        <AdminDashboardLayout>
            {loading
                ? <CustomLoader
                    rows={1}
                    rowClass="!bg-gray-100 flex items-center justify-center"
                    text='Loading...'
                    height={"100%"}
                    width={"100%"}
                />
                : <div className='w-full h-fit p-4 text-gray-800 flex flex-wrap gap-6 relative'>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Accounts</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                            {adminDashData?.totalUsers}
                        </div>
                    </CustomCard>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Accounts</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                            {adminDashData?.totalAccounts}
                        </div>
                    </CustomCard>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Accounts</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                            {adminDashData?.totalTransactions}
                        </div>
                    </CustomCard>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Accounts</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                            ${adminDashData?.totalAmount}
                        </div>
                    </CustomCard>
                </div>
            }
        </AdminDashboardLayout>
    )
}

export default AdminDashboard