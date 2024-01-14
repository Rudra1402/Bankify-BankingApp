import React, { useEffect, useState, useContext } from 'react'
import DashboardLayout from '../../Layouts/DashboardLayout'
import { BsFillCaretRightFill } from 'react-icons/bs'
import { BiReceipt } from 'react-icons/bi'
import { AiOutlineHistory } from 'react-icons/ai'
import { MdAccountBalance } from 'react-icons/md'
import CustomCard from '../../custom/CustomCard'
import classNames from 'classnames';
import AppContext from '../../context/AppContext'
import { dashboardData, historyByUserId } from '../../apis/apis'
import CustomLoader from '../../custom/CustomLoader'
import { Link } from 'react-router-dom'
import PrintStatement from './PrintStatement'

function Dashboard() {

    const { user } = useContext(AppContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [first, setfirst] = useState(null)

    const [isPrintStatementOpen, setIsPrintStatementOpen] = useState(false);

    useEffect(() => {
        setLoading(true)
        document.title = "Bankify | Dashboard"
        if (user) {
            dashboardData(user?.id, setData, setLoading)
            historyByUserId(user?.id, setfirst, setLoading)
        }
    }, [user])

    return (
        <DashboardLayout>
            {loading
                ? <CustomLoader
                    rows={1}
                    rowClass="!bg-gray-100 flex items-center justify-center"
                    text='Loading...'
                    height={"100%"}
                    width={"100%"}
                />
                : <div className='w-full h-fit p-4 text-gray-800 flex flex-wrap gap-6 relative'>
                    {isPrintStatementOpen
                        ? <PrintStatement
                            setIsPrintStatementOpen={setIsPrintStatementOpen}
                        />
                        : null
                    }
                    {/* <div className='flex flex-wrap gap-6 lg:gap-x-8'> */}
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Accounts</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>{data?.totalAccounts}</div>
                    </CustomCard>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Transfers</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>{data?.totalTransfers}</div>
                    </CustomCard>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Sent</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>${data?.sentAmount}</div>
                    </CustomCard>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Total Received</div>
                        <div className='flex-1 text-4xl leading-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>${data?.receivedAmount}</div>
                    </CustomCard>
                    {/* </div> */}
                    {/* <div className='flex flex-wrap gap-6 lg:gap-x-8 pb-8'> */}
                    <CustomCard
                        className='bg-gray-100 !shadow-md w-[48%] md:w-[31%] lg:w-[22.5%] h-40 p-4 rounded-md flex flex-col gap-3 hover:scale-105 transition-all'
                    >
                        <div className='text-lg leading-none'>Your contacts ({data?.contacts?.length})</div>
                        <div className='flex gap-2 items-center relative h-12 overflow-auto'>
                            {data?.contacts?.length > 0
                                ? data?.contacts?.map((contact, index) => {
                                    const leftValue = `${index * 2}rem`;
                                    return (
                                        <div
                                            key={index}
                                            className={classNames(
                                                'bg-blue-300 h-12 w-12 rounded-full flex items-center justify-center shadow-md border border-blue-400 absolute top-0'
                                            )}
                                            style={{ left: leftValue }}
                                        >
                                            {contact?.email?.substring(0, 2).toUpperCase()}
                                        </div>
                                    )
                                })
                                : <div className='text-gray-500 text-center px-1'>0 Contacts!</div>
                            }
                        </div>
                        <Link
                            to={'/dashboard/contacts'}
                            className='text-base cursor-pointer px-1 py-2 hover:bg-gray-200 rounded w-fit leading-none font-normal flex items-center gap-1 text-center'
                        >
                            View Contacts <BsFillCaretRightFill />
                        </Link>
                    </CustomCard>
                    <Link
                        to={'/dashboard/accounts'}
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all'
                    >
                        <MdAccountBalance className='text-3xl leading-none' />
                        <div className='text-xl leading-none text-center'>Check Balance</div>
                    </Link>
                    <Link
                        to={'/dashboard/transfers'}
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all'
                    >
                        <AiOutlineHistory className='text-3xl leading-none' />
                        <div className='text-xl leading-none text-center'>View Recent History</div>
                    </Link>
                    <CustomCard
                        className='bg-gray-100 !shadow-md rounded-md h-40 w-[48%] md:w-[31%] lg:w-[22.5%] relative p-2 cursor-pointer flex flex-col items-center justify-center gap-2 hover:scale-105 transition-all'
                        onClick={() => setIsPrintStatementOpen(true)}
                    >
                        <BiReceipt className='text-3xl leading-none' />
                        <div className='text-xl leading-none text-center'>Print Statement</div>
                    </CustomCard>
                    {/* </div> */}
                </div>}
        </DashboardLayout>
    )
}

export default Dashboard