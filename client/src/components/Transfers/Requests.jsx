import classNames from 'classnames';
import React, { useEffect, useState } from 'react'
import { useContext } from 'react';
import { getIncomingRequests, getOutgoingRequests, requestAccept, requestDecline } from '../../apis/apis';
import AppContext from '../../context/AppContext';
import CustomButton from '../../custom/CustomButton';
import CustomCard from '../../custom/CustomCard'
import CustomLoader from '../../custom/CustomLoader';
import { formatTimeSince } from '../../utils/timesince';
import { GoDotFill } from "react-icons/go";

function Requests({ reRender, setReRender, accounts, accountIds }) {
    const { user } = useContext(AppContext);
    const [reqs, setReqs] = useState(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(1);
    const [initiateReq, setInitiateReq] = useState(false);
    const [selectedAcc, setSelectedAcc] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [internalReRender, setInternalReRender] = useState(new Date().getTime())
    useEffect(() => {
        if (user && tab == 1) {
            setLoading(true)
            getIncomingRequests(user.id, setReqs, setLoading)
        }
        if (user && tab == 2) {
            setLoading(true)
            getOutgoingRequests(user.id, setReqs, setLoading)
        }
    }, [user, tab, reRender, internalReRender])
    useEffect(() => {
        if (accountIds && accountIds?.length > 0) {
            setSelectedAcc(accountIds[0])
        }
    }, [accountIds])
    return (
        <CustomCard className='h-full w-full flex flex-col items-center justify-start gap-2'>
            <div className='flex items-center w-full pb-1'>
                <div
                    className={classNames(
                        'cursor-pointer rounded w-full text-center py-1',
                        tab == 1 ? 'bg-green-600 text-gray-100' : 'bg-gray-100 text-gray-700'
                    )}
                    onClick={() => setTab(1)}
                >Incoming</div>
                <div
                    className={classNames(
                        'cursor-pointer rounded w-full text-center py-1',
                        tab == 2 ? 'bg-green-600 text-gray-100' : 'bg-gray-100 text-gray-700'
                    )}
                    onClick={() => setTab(2)}
                >Outgoing</div>
            </div>
            {tab == 1
                ? <div className='flex flex-col gap-y-2 w-full h-full'>
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
                                    {req?.pending
                                        ? initiateReq
                                            ? selectedIndex == index
                                                ? <div
                                                    className='flex flex-col w-full gap-y-2 pt-1'
                                                >
                                                    <select
                                                        name="fromAccount"
                                                        id="fromAccount"
                                                        className='bg-gray-200 p-2 rounded h-12 w-full text-gray-600'
                                                        onChange={e => {
                                                            setSelectedAcc(e.target.value)
                                                        }}
                                                    >
                                                        {accounts?.map((acc, index) => (
                                                            <option
                                                                value={accountIds[index]}
                                                                key={index}
                                                            >
                                                                {acc}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    <div
                                                        className='flex items-center gap-x-2'
                                                    >
                                                        <CustomButton
                                                            text="Cancel"
                                                            size='small'
                                                            className='!text-sm leading-none w-full !h-fit !py-1'
                                                            onClick={() => setInitiateReq(false)}
                                                        />
                                                        <CustomButton
                                                            text="Confirm"
                                                            size='small'
                                                            className='!text-sm leading-none w-full !h-fit !py-1 !bg-blue-600'
                                                            onClick={() => requestAccept(req?._id, req?.account?._id, selectedAcc, req?.amount, setInitiateReq, setInternalReRender, setReRender)}
                                                        />
                                                    </div>
                                                </div>
                                                : null
                                            : <div className='flex items-center justify-end w-full gap-x-2 pt-1'>
                                                <CustomButton
                                                    text='Initiate request'
                                                    size='small'
                                                    className='!text-xs !w-fit !px-2 !py-1 !h-fit !bg-green-600'
                                                    onClick={() => {
                                                        setInitiateReq(true)
                                                        setSelectedIndex(index)
                                                    }}
                                                />
                                                <CustomButton
                                                    text='Decline'
                                                    size='small'
                                                    className='!text-xs !w-fit !px-2 !py-1 !h-fit'
                                                    onClick={() => requestDecline(req?._id, setInternalReRender)}
                                                />
                                            </div>
                                        : <div
                                            className='text-sm leading-none text-gray-600'
                                        >
                                            {req?.isReqAccepted
                                                ? "You accepted the request!"
                                                : "You declined the request!"}
                                        </div>
                                    }
                                </div>
                            ))
                            : <div className='text-center'>No new requests</div>
                    }
                </div>
                : null
            }
            {tab == 2
                ? <div className='flex flex-col gap-y-2 w-full h-full'>
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
                                            {"You requested $" + req?.amount + " from " + req?.toUser?.firstName + " " + req?.toUser?.lastName + "!"}
                                        </div>
                                        <div className='text-sm leading-none whitespace-nowrap'>
                                            {formatTimeSince(req?.date)}
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-0.5 text-xs leading-none'>
                                        {req?.pending
                                            ? "Pending"
                                            : req?.isReqAccepted
                                                ? "Accepted"
                                                : "Declined"
                                        }
                                        <GoDotFill className={classNames(
                                            req?.pending
                                                ? 'text-gray-500'
                                                : req?.isReqAccepted
                                                    ? 'text-green-500'
                                                    : 'text-red-500'
                                        )} />
                                    </div>
                                </div>
                            ))
                            : <div className='text-center'>No new requests</div>
                    }
                </div>
                : null
            }
        </CustomCard>
    )
}

export default Requests