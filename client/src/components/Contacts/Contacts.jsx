import React, { useState, useContext, useEffect } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
import { MdDelete } from 'react-icons/md'
import { RxCross1 } from 'react-icons/rx'
import { addContact, deleteContact, findContactsById } from '../../apis/apis'
import AppContext from '../../context/AppContext'
import CustomCard from '../../custom/CustomCard'
import CustomDialog from '../../custom/CustomDialog'
import CustomInput from '../../custom/CustomInput'
import CustomLoader from '../../custom/CustomLoader'
import DashboardLayout from '../../Layouts/DashboardLayout'
import { FaCopy } from "react-icons/fa";
import Toast from '../../custom/CustomToast'

function Contacts() {

    const { user } = useContext(AppContext);

    const [openAddContact, setOpenAddContact] = useState(false);
    const [deleteContactDialog, setDeleteContactDialog] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);
    const [contactInfo, setContactInfo] = useState({
        name: '',
        email: '',
    });
    const [reRender, setReRender] = useState(new Date().getTime());
    const [contacts, setContacts] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const [loading, setLoading] = useState(true);

    const handleAccountChange = (e) => {
        const { name, value } = e.target;
        setContactInfo({ ...contactInfo, [name]: value });
    };

    const handleCopyClick = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            Toast.success('Copied!', 750);
        } catch (err) {
            Toast.error('Unable to copy text!', 750);
        }
    };

    const addContactDialog = (
        <div className='h-full w-full bg-[#000b] absolute top-0 left-0 right-0 bottom-0 rounded-md z-30'>
            <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-fit w-fit p-4 rounded-md bg-gray-100 flex flex-col gap-3'>
                <RxCross1
                    className='absolute -top-3 -right-3 cursor-pointer text-3xl leading-none bg-red-400 rounded-full p-1 text-white'
                    onClick={() => setOpenAddContact(false)}
                />
                <CustomInput
                    labelClass='!text-gray-600'
                    label='Contact Name'
                    name="name"
                    placeholder="Contact name"
                    extraClass='!bg-white !border !border-gray-400'
                    type='text'
                    value={contactInfo.name}
                    onChange={handleAccountChange}
                />
                <CustomInput
                    labelClass='!text-gray-600'
                    label='Email'
                    name="email"
                    extraClass='!bg-white !border !border-gray-400'
                    placeholder="Email"
                    type='email'
                    value={contactInfo.email}
                    onChange={handleAccountChange}
                />
                <button
                    className='border border-none p-2 bg-blue-500 text-white rounded mt-2'
                    onClick={() => addContact({ ...contactInfo, owner: user?.id }, setReRender, setOpenAddContact, setContactInfo, user?.email)}
                >Save</button>
            </div>
        </div>
    )

    useEffect(() => {
        document.title = "Bankify | Contacts"
        setLoading(true)
        if (user) {
            findContactsById(user?.id, setContacts, setLoading)
        }
    }, [user, reRender])

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
                : <div className='w-full h-full p-4 flex flex-col gap-6 relative'>
                    {openAddContact ? addContactDialog : null}
                    {deleteContactDialog
                        ? <div className='h-full w-full bg-[#000b] absolute top-0 left-0 right-0 bottom-0 rounded-md z-30'>
                            <CustomDialog
                                setDialog={setDeleteContactDialog}
                                title='Delete Contact'
                                message={`Are you sure want to delete ${selectedContact?.name} as your contact?`}
                                yesTitle='Delete'
                                noTitle='Cancel'
                                onYes={() => deleteContact(selectedContact?._id, setReRender, setDeleteContactDialog)}
                                onNo={() => setDeleteContactDialog(false)}
                            />
                        </div>
                        : null
                    }
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center gap-6'>
                            <div className='text-2xl leading-none'>Your Contacts</div>
                        </div>
                        <div
                            className='flex items-center gap-2 cursor-pointer py-1.5 px-3 rounded bg-gray-100 text-gray-800'
                            onClick={() => setOpenAddContact(true)}
                        >
                            <AiOutlinePlusCircle className='text-xl leading-none' />Add Contact
                        </div>
                    </div>
                    <div className='flex gap-4 flex-wrap'>
                        {contacts?.length > 0
                            ? contacts?.map((contact, index) => (
                                <CustomCard
                                    key={index}
                                    className='py-3 px-6 rounded bg-gray-100 text-gray-700 cursor-pointer w-[calc(33%-10px)] relative'
                                    onMouseEnter={() => setHoveredIndex(index)}
                                    onMouseLeave={() => setHoveredIndex(null)}
                                >
                                    {hoveredIndex == index
                                        ? <div
                                            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-[#000c] rounded flex items-center justify-center gap-x-2'
                                        >
                                            <FaCopy
                                                title='Email'
                                                className='text-blue-300 text-xl leading-none shadow-md'
                                                onClick={() => {
                                                    handleCopyClick(contact?.email)
                                                }}
                                            />
                                            <MdDelete
                                                title='Delete'
                                                className='text-red-400 text-2xl leading-none shadow-md'
                                                onClick={() => {
                                                    setDeleteContactDialog(true)
                                                    setSelectedContact(contact)
                                                }}
                                            />
                                        </div>
                                        : null
                                    }
                                    <div className='text-xl'>{contact?.name}</div>
                                    <div className='text-sm'>{contact?.email}</div>
                                </CustomCard>
                            ))
                            : <div className='text-xl text-gray-700 text-center w-full pt-4'>No Contacts Added!</div>
                        }
                    </div>
                </div>}
        </DashboardLayout>
    )
}

export default Contacts