import React, { useEffect, useState, useContext } from 'react'
import { addCardApi, deleteAccountt, findAccountsById, findTotalBalance, verifyCardNumber } from '../../apis/apis'
import { RxCross1 } from 'react-icons/rx'
import CustomCard from '../../custom/CustomCard'
import CustomInput from '../../custom/CustomInput'
import CustomButton from '../../custom/CustomInput'
import DashboardLayout from '../../Layouts/DashboardLayout'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import AppContext from '../../context/AppContext'
import { CiSquareRemove } from 'react-icons/ci'
import CustomLoader from '../../custom/CustomLoader'
import { formattedNumber } from '../../utils/formatCardNumber'
import classNames from 'classnames'
import { MdDelete } from 'react-icons/md'
import CustomDialog from '../../custom/CustomDialog'
import { FaCopy } from 'react-icons/fa'
import Toast from '../../custom/CustomToast'

function Accounts() {

    const { user } = useContext(AppContext);

    const [accounts, setAccounts] = useState(null)
    const [accountInfo, setAccountInfo] = useState({
        accountNumber: '',
        accountType: '',
    });
    const [openAddCard, setOpenAddCard] = useState(false)
    const [deleteAccountDialog, setDeleteAccountDialog] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [isCardValidated, setIsCardValidated] = useState(false)
    const [reRender, setReRender] = useState(new Date().getTime())
    const [totalBalance, setTotalBalance] = useState(null)
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const [loading, setLoading] = useState(true)

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setAccountInfo({ ...accountInfo, [name]: value });
    };

    const handleCopyClick = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            Toast.success('Copied!', 750);
        } catch (err) {
            Toast.error('Unable to copy text!', 750);
        }
    };

    const addCardDialog = (
        <div className='h-full w-full bg-[#000b] absolute top-0 left-0 right-0 bottom-0 rounded-md z-30'>
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-fit w-fit p-6 rounded-md bg-gray-100 flex flex-col gap-4'>
                <RxCross1
                    className='absolute -top-3 -right-3 cursor-pointer text-3xl leading-none bg-red-500 rounded-full p-1'
                    onClick={() => setOpenAddCard(false)}
                />
                <CustomInput
                    labelClass='!text-gray-600'
                    label='Card Number'
                    name="accountNumber"
                    placeholder="Card number"
                    type='text'
                    extraClass='!border-gray-400 !bg-white'
                    value={accountInfo.accountNumber}
                    onChange={handleAccountChange}
                />
                <button
                    className={classNames(
                        'border border-none p-2 rounded',
                        isCardValidated ? 'bg-blue-600' : 'bg-green-500'
                    )}
                    onClick={() => {
                        if (isCardValidated) {
                            addCardApi({
                                ...accountInfo, userId: user.id
                            }, setAccountInfo, setOpenAddCard, setReRender, setIsCardValidated)
                        } else {
                            verifyCardNumber(accountInfo, setAccountInfo, setIsCardValidated)
                        }
                    }}
                >{isCardValidated ? 'Add Card' : 'Validate Card'}</button>
            </div>
        </div>
    )

    useEffect(() => {
        document.title = "Bankify | Accounts"
        if (user) {
            findAccountsById(user?.id, setAccounts)
            findTotalBalance(user?.id, setTotalBalance)
        }
    }, [user, reRender])

    useEffect(() => {
        setLoading(true)
        if (accounts && totalBalance != null)
            setLoading(false)
    }, [accounts, totalBalance])

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
                : <div className='w-full h-full py-4 px-8 text-gray-100 flex flex-col gap-8 relative'>
                    {openAddCard ? addCardDialog : null}
                    {deleteAccountDialog
                        ? <div className='h-full w-full bg-[#000b] absolute top-0 left-0 right-0 bottom-0 rounded-md z-30'>
                            <CustomDialog
                                setDialog={setDeleteAccountDialog}
                                title='Delete Account'
                                message={`Are you sure want to delete ${formattedNumber(selectedAccount?.accountNumber)} as your account?`}
                                yesTitle='Delete'
                                noTitle='Cancel'
                                onYes={() => deleteAccountt(selectedAccount?._id, setReRender, setDeleteAccountDialog)}
                                onNo={() => setDeleteAccountDialog(false)}
                            />
                        </div>
                        : null
                    }
                    <div className='flex flex-col lg:flex-row items-center justify-between gap-4'>
                        <div className='text-xl lg:text-2xl leading-none text-gray-700'>Your Accounts & Cards</div>
                        <div className='flex flex-col w-[95%] sm:w-[75%] md:w-fit md:flex-row md:items-center gap-2 md:gap-4'>
                            <div className='bg-gray-100 py-1.5 px-3 rounded text-gray-800 h-9 text-center'>
                                Total Balance: ${totalBalance}
                            </div>
                            <div
                                className='flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded bg-gray-100 text-gray-800 justify-center'
                                onClick={() => setOpenAddCard(true)}
                            >
                                <AiOutlinePlusCircle className='text-xl leading-none' />Add Card
                            </div>
                        </div>
                    </div>
                    <div className='flex gap-6 justify-center md:justify-start flex-wrap pb-6'>
                        {accounts?.length > 0
                            ? accounts?.map((acc, index) => (
                                <CustomCard
                                    className='h-fit w-[95%] sm:w-[75%] md:w-[45%] lg2:w-[31%] p-4 rounded-md bg-gray-100 flex flex-col gap-2 cursor-pointer relative'
                                    key={index}
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {hoveredIndex == index
                                        ? <div
                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[#000c] rounded flex items-center justify-center gap-x-2'
                                        >
                                            <FaCopy
                                                title='Account Number'
                                                className='text-blue-300 text-xl leading-none shadow-md'
                                                onClick={() => {
                                                    handleCopyClick(acc?.accountNumber)
                                                }}
                                            />
                                            <MdDelete
                                                title='Delete'
                                                className='text-red-300 text-2xl leading-none shadow-md'
                                                onClick={() => {
                                                    setDeleteAccountDialog(true)
                                                    setSelectedAccount(acc)
                                                }}
                                            />
                                        </div>
                                        : null
                                    }
                                    <div className='text-base lg:text-lg leading-none font-medium text-gray-700 tracking-wide mb-2 flex justify-between gap-x-6 items-center'>
                                        {acc.accountType}
                                        <p className='m-0'>${acc.balance}</p>
                                    </div>
                                    <CustomInput
                                        labelClass='!text-sm !text-gray-400'
                                        label='Card Number'
                                        extraClass='text-base lg:text-lg leading-none font-medium !border-gray-300 !max-w-full'
                                        type='text'
                                        disabled={true}
                                        value={formattedNumber(acc.accountNumber)}
                                    />
                                </CustomCard>
                            ))
                            : <div className='text-xl text-gray-700 text-center w-full pt-4'>No Accounts Added!</div>
                        }
                    </div>
                </div>}
        </DashboardLayout >
    )
}

export default Accounts