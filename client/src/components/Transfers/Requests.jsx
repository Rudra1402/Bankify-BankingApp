import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { getRequests } from '../../apis/apis';
import AppContext from '../../context/AppContext';
import CustomButton from '../../custom/CustomButton';
import CustomCard from '../../custom/CustomCard'
import CustomLoader from '../../custom/CustomLoader';
import { formatTimeSince } from '../../utils/timesince';

function Requests() {
    const { user } = useContext(AppContext);
    const [reqs, setReqs] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (user) {
            setLoading(true)
            getRequests(user.id, setReqs, setLoading)
        }
    }, [user])
    return (
        <CustomCard className='h-full w-full flex items-center justify-between gap-2'>
            <div className='flex flex-col gap-y-2 w-full h-full'>
                {loading
                    ? <CustomLoader
                        rows={1}
                        rowClass="!bg-gray-100 flex items-center justify-center"
                        text='Loading...'
                        height={"100%"}
                        width={"100%"}
                    />
                    : reqs?.length > 0
                        ? reqs?.map((req, index) => (
                            <div
                                key={index}
                                className='p-2 flex flex-col items-start bg-gray-100 gap-y-1 w-full rounded'
                            >
                                <div className='flex items-center justify-between gap-x-2 w-full'>
                                    <div>
                                        {req?.account?.user?.firstName + " " + req?.account?.user?.lastName + " requested $" + req?.amount + "!"}
                                    </div>
                                    <div className='text-sm leading-none whitespace-nowrap'>
                                        {formatTimeSince(req?.date)}
                                    </div>
                                </div>
                                {/* <hr className='w-full' /> */}
                                <div className='flex items-center justify-end w-full gap-x-2 pt-1'>
                                    <CustomButton
                                        text='Initiate request'
                                        size='small'
                                        className='!text-xs !w-fit !px-2 !py-1 !h-fit !bg-green-600'
                                    />
                                    <CustomButton
                                        text='Decline'
                                        size='small'
                                        className='!text-xs !w-fit !px-2 !py-1 !h-fit'
                                    />
                                </div>
                            </div>
                        ))
                        : <div className='text-center'>No new requests</div>
                }
            </div>
        </CustomCard>
    )
}

export default Requests