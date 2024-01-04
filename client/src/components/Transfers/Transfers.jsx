import React, { useState, useEffect, useContext } from 'react'
import { createRequest, findAccountsByEmail, findAccountsById, findContactsById, historyByAccountId, paymentTransfer } from '../../apis/apis';
import AppContext from '../../context/AppContext'
import CustomInput from '../../custom/CustomInput'
import DashboardLayout from '../../Layouts/DashboardLayout'
import { BiSolidErrorCircle } from 'react-icons/bi'
import { formatTimeSince } from '../../utils/timesince';
import CustomLoader from '../../custom/CustomLoader';
import dummyuser from '../../assets/dummyuser.jpg'
import { Link } from 'react-router-dom';
import CustomButton from '../../custom/CustomButton';
import classNames from 'classnames';
import Requests from './Requests';

function Transfers() {

    const { user } = useContext(AppContext);

    const [reRender, setReRender] = useState(new Date().getTime())

    const [fromAccounts, setFromAccounts] = useState(null)
    const [fromContacts, setFromContacts] = useState(null)

    const [accountOptions, setAccountOptions] = useState(null)
    const [accIds, setAccIds] = useState(null)
    const [contactOptions, setContactOptions] = useState(null)
    const [contIds, setContIds] = useState(null)

    const [selectedContact, setSelectedContact] = useState(null)
    const [selContactAccounts, setSelContactAccounts] = useState(null)
    const [selContAccOptions, setSelContAccOptions] = useState(null)
    const [selContAccIds, setSelContAccIds] = useState(null)

    const [transferAmt, setTransferAmt] = useState("");
    const [fromAccId, setFromAccId] = useState(null);
    const [toAccId, setToAccId] = useState(null);

    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [historyLoading, setHistoryLoading] = useState(true);

    const [createPayment, setCreatePayment] = useState(false);
    const [requestMoney, setRequestMoney] = useState(false);
    const [historyAccId, setHistoryAccId] = useState(null);
    const [tab, setTab] = useState(1);

    useEffect(() => {
        if (user) {
            findAccountsById(user?.id, setFromAccounts)
            findContactsById(user?.id, setFromContacts, setLoading)
        }
    }, [user, reRender])

    useEffect(() => {
        if (fromAccounts && fromContacts) {
            let formattedAccounts = [];
            let accountIds = [];
            let formattedContacts = [];
            let contactIds = [];
            fromAccounts?.map(acc => {
                formattedAccounts.push("**** **** **** " + acc?.accountNumber?.substring(12) + " (" + acc?.accountType + ") $" + acc?.balance)
                accountIds.push(acc?._id)
            })
            fromContacts?.map(c => {
                formattedContacts.push(c.name)
                contactIds.push(c?.email)
            })
            setAccountOptions(formattedAccounts)
            setAccIds(accountIds)
            setContactOptions(formattedContacts)
            setContIds(contactIds)
            if (accountIds.length > 0) {
                setFromAccId(accountIds[0])
                setHistoryAccId(accountIds[0])
            }
            if (contactIds.length > 0) {
                setSelectedContact(contactIds[0])
            }
        }
    }, [fromAccounts, fromContacts])

    useEffect(() => {
        if (selectedContact) {
            findAccountsByEmail(selectedContact, setSelContactAccounts)
        }
    }, [selectedContact])

    useEffect(() => {
        if (selContactAccounts) {
            let formattedAccounts = [], accIds = [];
            selContactAccounts?.map(acc => {
                formattedAccounts.push("**** **** **** " + acc?.accountNumber?.substring(12) + " (" + acc?.accountType + ")")
                accIds.push(acc?._id)
            })
            setSelContAccOptions(formattedAccounts)
            setSelContAccIds(accIds)
            if (accIds.length > 0) {
                setToAccId(accIds[0])
            }
        }
    }, [selContactAccounts])

    useEffect(() => {
        if (historyAccId) {
            historyByAccountId(historyAccId, setHistory)
        }
    }, [reRender, historyAccId])

    useEffect(() => {
        setLoading(true)
        if (fromAccounts && fromContacts)
            setLoading(false)
    }, [fromContacts, fromAccounts])

    useEffect(() => {
        setHistoryLoading(true)
        if (history) {
            setHistoryLoading(false)
        }
    }, [history])

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
                : <div className='h-full w-full p-4 flex gap-6'>
                    {createPayment
                        ? <div className='rounded-md w-1/2 h-full bg-white p-5 flex flex-col gap-4 overflow-y-auto'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="fromAccount" className='text-gray-400'>From Account</label>
                                <select
                                    name="fromAccount"
                                    id="fromAccount"
                                    className='bg-gray-100 p-2 rounded h-12 w-full text-gray-600'
                                    onChange={e => {
                                        setFromAccId(e.target.value)
                                    }}
                                >
                                    {accountOptions?.map((acc, index) => (
                                        <option value={accIds[index]} key={index}>{acc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="contact" className='text-gray-400'>Select Contact</label>
                                <select
                                    name="contact"
                                    id="contact"
                                    className='bg-gray-100 p-2 rounded h-12 w-full text-gray-600'
                                    onChange={e => {
                                        setSelectedContact(e.target.value)
                                    }}
                                >
                                    {contactOptions?.map((c, index) => (
                                        <option
                                            value={contIds[index]}
                                            key={index}
                                        >{c}</option>
                                    ))}
                                </select>
                            </div>
                            {selContAccOptions && selContAccIds
                                ? selContactAccounts?.length == 0
                                    ? <div className='text-red-500 flex items-center gap-1'>
                                        <BiSolidErrorCircle className='text-xl leading-none text-red-500' />
                                        Selected user has not added any accounts!
                                    </div>
                                    : <div className='flex flex-col gap-1'>
                                        <label htmlFor="toAccount" className='text-gray-400'>To Account</label>
                                        <select
                                            name="toAccount"
                                            id="toAccount"
                                            className='bg-gray-100 text-gray-600 p-2 rounded h-12 w-full'
                                            onChange={e => {
                                                setToAccId(e.target.value)
                                            }}
                                        >
                                            {selContAccOptions?.map((acc, index) => (
                                                <option
                                                    value={selContAccIds[index]}
                                                    key={index}
                                                >
                                                    {acc}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                : null
                            }
                            <CustomInput
                                label='Enter Amount'
                                name='amount'
                                extraClass='!w-full'
                                type='number'
                                placeholder="0"
                                value={transferAmt}
                                disabled={selContactAccounts?.length == 0 ? true : false}
                                onChange={e => setTransferAmt(e.target.value)}
                            />
                            <div className='flex flex-row-reverse gap-2'>
                                <button
                                    className='bg-gray-100 border border-gray-300 text-gray-600 text-sm h-10 py-2 w-full rounded hover:bg-gray-50 cursor-pointer'
                                    onClick={() => {
                                        transferAmt != null || transferAmt != ""
                                            ? paymentTransfer(fromAccId, toAccId, transferAmt, setCreatePayment, setReRender)
                                            : null
                                    }}
                                    disabled={transferAmt == null || transferAmt == "" ? true : false}
                                >
                                    Proceed with payment
                                </button>
                                <button
                                    className='bg-gray-100 border border-gray-300 text-gray-600 text-sm h-10 py-2 w-full rounded hover:bg-gray-50 cursor-pointer'
                                    onClick={() => setCreatePayment(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        : null
                    }
                    {requestMoney
                        ? <div className='rounded-md w-1/2 h-full bg-white p-5 flex flex-col gap-4 overflow-y-auto'>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="fromAccount" className='text-gray-400'>From Account</label>
                                <select
                                    name="fromAccount"
                                    id="fromAccount"
                                    className='bg-gray-100 p-2 rounded h-12 w-full text-gray-600'
                                    onChange={e => {
                                        setFromAccId(e.target.value)
                                    }}
                                >
                                    {accountOptions?.map((acc, index) => (
                                        <option value={accIds[index]} key={index}>{acc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className='flex flex-col gap-1'>
                                <label htmlFor="contact" className='text-gray-400'>Select Contact</label>
                                <select
                                    name="contact"
                                    id="contact"
                                    className='bg-gray-100 p-2 rounded h-12 w-full text-gray-600'
                                    onChange={e => {
                                        setSelectedContact(e.target.value)
                                    }}
                                >
                                    {contactOptions?.map((c, index) => (
                                        <option
                                            value={contIds[index]}
                                            key={index}
                                        >{c}</option>
                                    ))}
                                </select>
                            </div>
                            <CustomInput
                                label='Enter Amount'
                                name='amount'
                                extraClass='!w-full'
                                type='number'
                                placeholder="0"
                                value={transferAmt}
                                disabled={fromAccounts && fromContacts ? false : true}
                                onChange={e => setTransferAmt(e.target.value)}
                            />
                            <div className='flex flex-row-reverse gap-2'>
                                <button
                                    className='bg-gray-100 border border-gray-300 text-gray-600 text-sm h-10 py-2 w-full rounded hover:bg-gray-50 cursor-pointer'
                                    onClick={() => {
                                        transferAmt != null || transferAmt != ""
                                            ? createRequest({
                                                account: fromAccId,
                                                contact: selectedContact,
                                                amount: parseInt(transferAmt)
                                            }, setRequestMoney, setReRender)
                                            : null
                                    }}
                                    disabled={transferAmt == null || transferAmt == "" ? true : false}
                                >
                                    Send request
                                </button>
                                <button
                                    className='bg-gray-100 border border-gray-300 text-gray-600 text-sm h-10 py-2 w-full rounded hover:bg-gray-50 cursor-pointer'
                                    onClick={() => setRequestMoney(false)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                        : null
                    }
                    {requestMoney || createPayment
                        ? null
                        : <div className='rounded-md w-1/2 h-full bg-white p-5 flex flex-col justify-center items-center gap-4 overflow-y-auto'>
                            <div className='text-center underline underline-offset-4 text-2xl leading-none mb-4'>Transactions</div>
                            <div className='w-full text-lg leading-6 bg-slate-100 p-2 rounded'>&#8226; Send money to your friends, family or business related purposes.</div>
                            <div className='w-full text-lg leading-6 bg-slate-100 p-2 rounded'>&#8226; You can also monitor your transaction history.</div>
                            <div className='w-full text-lg leading-6 bg-slate-100 p-2 rounded'>&#8226; Add accounts and track your history.</div>
                            <div className='flex items-center gap-x-3'>
                                <CustomButton
                                    text="Send money"
                                    className='mt-4 !text-sm !w-36 py-2'
                                    size='none'
                                    onClick={() => setCreatePayment(true)}
                                />
                                <CustomButton
                                    text="Request money"
                                    className='mt-4 !text-sm !w-36 py-2'
                                    size='none'
                                    onClick={() => setRequestMoney(true)}
                                />
                            </div>
                        </div>
                    }
                    <div className='w-1/2 h-full bg-white p-5 flex flex-col gap-3 overflow-y-auto border-l border-l-gray-200'>
                        <div className='flex items-center w-full'>
                            <div
                                className={classNames(
                                    'w-1/2 py-1 text-center rounded-md cursor-pointer',
                                    tab == 1 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                                )}
                                onClick={() => setTab(1)}
                            >
                                Transfers
                            </div>
                            <div
                                className={classNames(
                                    'w-1/2 py-1 rounded-md text-center cursor-pointer',
                                    tab == 2 ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'
                                )}
                                onClick={() => setTab(2)}
                            >
                                Requests
                            </div>
                        </div>
                        {tab == 1
                            ? fromAccounts?.length > 0
                                ? historyLoading
                                    ? <CustomLoader
                                        rows={1}
                                        rowClass="!bg-gray-100 flex items-center justify-center"
                                        text='Loading history...'
                                        height={"100%"}
                                        width={"100%"}
                                    />
                                    : <>
                                        <div className='flex items-center justify-between gap-2'>
                                            <div className='text-gray-600 underline underline-offset-4'>
                                                Transfer history
                                            </div>
                                            {selContAccOptions && selContAccIds
                                                ? selContactAccounts?.length == 0
                                                    ? <div className='text-red-500 flex items-center gap-1'>
                                                        <BiSolidErrorCircle className='text-xl leading-none text-red-500' />
                                                        No Accounts!
                                                    </div>
                                                    : <select
                                                        name="toAccount"
                                                        id="toAccount"
                                                        className='bg-gray-100 text-gray-600 text-sm leading-none p-2 rounded h-10 w-fit cursor-pointer'
                                                        onChange={e => {
                                                            setHistoryAccId(e.target.value)
                                                        }}
                                                    >
                                                        {accountOptions?.map((acc, index) => (
                                                            <option value={accIds[index]} key={index}>{acc}</option>
                                                        ))}
                                                    </select>
                                                : null
                                            }
                                        </div>
                                        {history?.length > 0
                                            ? history?.map((row, index) => {
                                                const isFromUser = row?.fromAccount?.user?._id == user?.id
                                                    ? 'You'
                                                    : row?.fromAccount?.user?.firstName
                                                const isToUser = row?.toAccount?.user?._id == user?.id
                                                    ? 'you'
                                                    : row?.toAccount?.user?.firstName
                                                return (
                                                    <div
                                                        className='p-2 rounded bg-gray-100 text-gray-600 flex items-center justify-between gap-2'
                                                        key={index}
                                                    >
                                                        <div className='flex-1 flex items-center justify-start gap-8 overflow-hidden text-ellipsis line-clamp-1'>
                                                            <div className='flex flex-col items-center gap-1'>
                                                                <div className='h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center'>
                                                                    <img
                                                                        src={row?.fromAccount?.user?.profileImageUrl ? row?.fromAccount?.user?.profileImageUrl : dummyuser}
                                                                        alt='fromImage'
                                                                        className='h-10 w-auto rounded-full'
                                                                    />
                                                                </div>
                                                                <p>{isFromUser}</p>
                                                            </div>
                                                            <div className='flex flex-col gap-0'>
                                                                ${row?.amount}
                                                                <div className='text-2xl leading-none'>&rarr;</div>
                                                            </div>
                                                            <div className='flex flex-col items-center gap-1'>
                                                                <div className='h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center'>
                                                                    <img
                                                                        src={row?.toAccount?.user?.profileImageUrl ? row?.toAccount?.user?.profileImageUrl : dummyuser}
                                                                        alt='fromImage'
                                                                        className='h-10 w-auto rounded-full'
                                                                    />
                                                                </div>
                                                                <p>{isToUser}</p>
                                                            </div>
                                                        </div>
                                                        <small>{formatTimeSince(row?.date)}</small>
                                                    </div>
                                                )
                                            })
                                            : <div className='text-gray-600'>No transactions involving this account!</div>
                                        }
                                    </>
                                : <div className='flex flex-col gap-4 items-center'>
                                    <div className='text-center underline underline-offset-4 text-lg'>No accounts found!</div>
                                    <div className='flex items-center gap-1 justify-center'>
                                        Go to
                                        <Link to={'/dashboard/accounts'} className='text-blue-500'>Accounts</Link>
                                    </div>
                                </div>
                            : <>
                                <Requests reRender={reRender} />
                            </>
                        }
                    </div>
                </div>
            }
        </DashboardLayout>
    )
}

export default Transfers