import React, { useState, useEffect, useContext, useRef } from 'react'
import { historyByUserId } from '../../apis/apis';
import AppContext from '../../context/AppContext';
import CustomCard from '../../custom/CustomCard'
import CustomLoader from '../../custom/CustomLoader';
import CustomButton from '../../custom/CustomButton';
import { RxCross2 } from 'react-icons/rx'
import { formattedNumber } from '../../utils/formatCardNumber';
import { CSVLink } from 'react-csv'

function PrintStatement({ setIsPrintStatementOpen }) {

    const { user } = useContext(AppContext);
    const scrollableRef = useRef(null);

    const [transactions, setTransactions] = useState(null);
    const [loading, setLoading] = useState(true);
    const [csvData, setCsvData] = useState(null);

    useEffect(() => {
        if (user)
            historyByUserId(user?.id, setTransactions, setLoading)
    }, [user])

    let mainTotalSent = 0, mainTotalReceived = 0;

    useEffect(() => {
        if (loading || !transactions)
            return;
        let csvArr = []
        let tempMainSent = 0, tempMainReceived = 0;
        transactions?.map(t => {
            let totalSentAcc = 0, totalReceivedAcc = 0;
            let tempObj = { 'Account_Number': formattedNumber(t[0]) };
            t[1]?.map(row => {
                row?.fromAccount?.user?._id == user?.id
                    ? totalSentAcc += row?.amount
                    : totalReceivedAcc += row?.amount

                row?.fromAccount?.user?._id == user?.id
                    ? tempMainSent += row?.amount
                    : tempMainReceived += row?.amount
            })
            tempObj = {
                ...tempObj,
                'Money_Sent': totalSentAcc,
                'Money_Received': totalReceivedAcc
            }
            csvArr.push(tempObj);
        })
        csvArr.push({
            'User_Total_Sent': tempMainSent,
            'User_Total_Received': tempMainReceived
        })
        setCsvData(csvArr);
    }, [loading, transactions])

    return (
        <CustomCard
            className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-full w-full rounded-md bg-[#000d] z-10'
        >
            <CustomCard
                className='absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 h-5/6 w-4/5 bg-gray-100 rounded-md !shadow-md'
            >
                <RxCross2
                    className='bg-red-500 h-7 w-7 text-white cursor-pointer absolute -top-3 -right-3 font-bold rounded'
                    onClick={() => setIsPrintStatementOpen(false)}
                />
                {loading
                    ? <CustomLoader
                        rows={1}
                        rowClass="!bg-gray-100 flex items-center justify-center"
                        text='Loading...'
                        height={"100%"}
                        width={"100%"}
                    />
                    : <div className='h-full w-full p-3 flex flex-col gap-2'>
                        <div
                            ref={scrollableRef}
                            className='h-full w-full flex flex-col gap-3 overflow-auto pt-2 pb-4 px-3 border-b border-b-gray-400'
                            id='statement_container'
                        >
                            <div className='text-xl leading-none pb-2 underline underline-offset-4'>Bankify Statement</div>
                            {transactions?.map((t, index) => {
                                let totalSent = 0, totalReceived = 0;
                                return (
                                    <div
                                        key={index}
                                        className='flex flex-col items-start gap-3'
                                    >
                                        <div className='text-lg leading-none'>
                                            {index + 1}. Account Number: {formattedNumber(t[0])}
                                        </div>
                                        <div className='flex flex-col items-start gap-1 w-full'>
                                            {t[1]?.map((row, ix) => {
                                                const isFromUser = row?.fromAccount?.user?._id == user?.id
                                                    ? 'You'
                                                    : row?.fromAccount?.user?.firstName + " " + row?.fromAccount?.user?.lastName
                                                const isToUser = row?.toAccount?.user?._id == user?.id
                                                    ? 'you'
                                                    : row?.toAccount?.user?.firstName + " " + row?.toAccount?.user?.lastName

                                                row?.fromAccount?.user?._id == user?.id
                                                    ? totalSent += row?.amount
                                                    : totalReceived += row?.amount

                                                row?.fromAccount?.user?._id == user?.id
                                                    ? mainTotalSent += row?.amount
                                                    : mainTotalReceived += row?.amount

                                                return (
                                                    <div
                                                        key={ix}
                                                        className='flex items-center justify-between gap-3 w-full'
                                                    >
                                                        <div className='text-gray-700 text-base'>
                                                            {isFromUser} transferred ${row?.amount} to {isToUser}
                                                        </div>
                                                        <p className='m-0 text-xs leading-none'>
                                                            {row?.date?.split("T")[0]}, {new Date(row?.date).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className='text-sm flex items-center py-1 px-2 rounded bg-green-400'>
                                            Sent: ${totalSent}, Received: {totalReceived}
                                        </div>
                                    </div>
                                )
                            })}
                            <div className='mt-1 flex items-center py-1.5 px-2 rounded bg-blue-300'>
                                Total Sent: ${mainTotalSent}, Total Received: ${mainTotalReceived}
                            </div>
                        </div>
                        <div className='flex items-center justify-between gap-3'>
                            <CustomButton
                                text='Close'
                                size='small'
                                className='!text-sm !w-24'
                                onClick={() => setIsPrintStatementOpen(false)}
                            />
                            <CSVLink
                                data={csvData !== null ? csvData : []}
                                filename='Transactions'
                            >
                                <CustomButton
                                    text='Download CSV'
                                    size='small'
                                    className='!text-sm !bg-blue-600'
                                />
                            </CSVLink>
                        </div>
                    </div>
                }
            </CustomCard>
        </CustomCard>
    )
}

export default PrintStatement