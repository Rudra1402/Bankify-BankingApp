import React, { useEffect, useContext, useState } from 'react'
import DashboardLayout from '../../Layouts/DashboardLayout'
import CustomInput from '../../custom/CustomInput'
import CustomButton from '../../custom/CustomButton'
import AppContext from '../../context/AppContext'
import dummyuser from '../../assets/dummyuser.jpg'
import { storage } from '../../utils/firebaseStorage'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import Toast from '../../custom/CustomToast'
import { userById, updateUrl, changePassword, updateUserApi } from '../../apis/apis'
import CustomLoader from '../../custom/CustomLoader'
import classNames from 'classnames'
import CustomCard from '../../custom/CustomCard'
import { IoMdEye, IoMdEyeOff } from 'react-icons/io'

function Profile() {

    const { user, setUser, openSidebar } = useContext(AppContext);
    const [profileCompletionPct, setProfileCompletionPct] = useState(0);

    const [profile, setProfile] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [storedPath, setStoredPath] = useState(null);
    const [isImgUploaded, setIsImgUploaded] = useState(false);
    const [loading, setLoading] = useState(true)

    const [currPassword, setCurrPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [updateUser, setUpdateUser] = useState({
        firstName: profile?.firstName,
        lastName: profile?.lastName,
        email: profile?.email,
        username: profile?.username
    });
    const [reRender, setReRender] = useState(new Date().getTime());
    const [viewCurrPass, setViewCurrPass] = useState(false);
    const [viewNewPass, setViewNewPass] = useState(false);

    useEffect(() => {
        document.title = "Bankify | Profile"
        let userItem = JSON.parse(localStorage.getItem('user'))
        if (userItem?.token || isImgUploaded) {
            userById(userItem?.id, setProfile, setLoading)
        }
    }, [user, isImgUploaded, reRender])

    useEffect(() => {
        if (profile) {
            let tempPct = 0;
            setUpdateUser({
                firstName: profile?.firstName,
                lastName: profile?.lastName,
                email: profile?.email,
                username: profile?.username
            });
            if (profile?.firstName?.length > 0)
                tempPct += 20;
            if (profile?.lastName?.length > 0)
                tempPct += 20;
            if (profile?.email?.length > 0)
                tempPct += 20;
            if (profile?.username?.length > 0)
                tempPct += 20;
            if (profile?.profileImageUrl?.length > 0)
                tempPct += 20;
            setProfileCompletionPct(tempPct);
        }
    }, [profile])

    const handleUpdateUser = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        setUpdateUser({ ...updateUser, [name]: value });
    }

    const handleImageUpload = () => {
        if (profileImg) {
            const storageRef = ref(storage, `profileImages/${user?.username}`);
            uploadBytes(storageRef, profileImg).then((snapshot) => {
                setStoredPath(snapshot?.metadata?.fullPath);
                Toast.success('Image uploaded successfully!');
                setIsImgUploaded(true);
            }).catch((error) => {
                console.log(error);
                Toast.error('Error uploading image!');
            });
        } else {
            Toast.warn('Please select a file to upload.');
        }
    };

    const getURL = async (storedPath) => {
        if (storedPath) {
            const storageRef = ref(storage, storedPath);
            const downloadURL = await getDownloadURL(storageRef);
            updateUrl(user?.id, downloadURL, setIsImgUploaded);
            setUser({ ...user, profileImageUrl: downloadURL, isProfileImageUpdated: true });
            localStorage.setItem(
                "user", JSON.stringify(
                    { ...user, profileImageUrl: downloadURL, isProfileImageUpdated: true }
                )
            );
        }
    };

    useEffect(() => {
        if (storedPath) {
            getURL(storedPath)
            setIsImgUploaded(false);
        }
    }, [storedPath])

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
                : <div className='w-full h-full py-2 px-4 text-white flex flex-col-reverse xl:flex-row justify-start items-center gap-6 xl:gap-0 xl:justify-between'>
                    <CustomCard className={classNames(
                        'flex flex-col items-center gap-6 overflow-auto px-4 py-2',
                        openSidebar ? 'w-full xl:w-[70%]' : 'w-full xl:w-[60%]'
                    )}>
                        <div className='text-xl text-gray-700 leading-none mt-2 flex gap-1'>
                            <div className='underline underline-offset-4'>Profile</div>
                            <div className=''>({profileCompletionPct}% completed)</div>
                        </div>
                        <div className='flex items-center gap-8'>
                            <CustomInput
                                label={"First Name"}
                                placeholder="First name"
                                name="firstName"
                                size='large'
                                value={updateUser?.firstName}
                                onChange={handleUpdateUser}
                            />
                            <CustomInput
                                label={"Last Name"}
                                placeholder="Last name"
                                name="lastName"
                                size='large'
                                value={updateUser?.lastName}
                                onChange={handleUpdateUser}
                            />
                        </div>
                        <div className='flex items-center gap-8'>
                            <CustomInput
                                label={"Email"}
                                placeholder="Email"
                                size='large'
                                name="email"
                                value={updateUser?.email}
                                type='email'
                                onChange={handleUpdateUser}
                            />
                            <CustomInput
                                label={"Username"}
                                placeholder="Username"
                                size='large'
                                name="username"
                                value={updateUser?.username}
                                onChange={handleUpdateUser}
                            />
                        </div>
                        <CustomButton
                            text='Save'
                            size='none'
                            className='!py-1 !px-6 !w-fit !text-base'
                            onClick={() => updateUserApi(user?.id, updateUser, setUser, setReRender)}
                        />
                        <hr className='my-1' />
                        <div className='text-xl leading-none mt-2 text-gray-700 underline underline-offset-4'>Change Password</div>
                        <div className='flex items-center gap-8'>
                            <div className='relative'>
                                <CustomInput
                                    label={"Current Password"}
                                    placeholder="Current password"
                                    value={currPassword}
                                    onChange={(e) => setCurrPassword(e.target.value)}
                                    size='large'
                                    type={viewCurrPass ? 'text' : 'password'}
                                />
                                {viewCurrPass == false
                                    ? <IoMdEye
                                        className='text-xl leading-none cursor-pointer absolute top-10 right-3 text-gray-600'
                                        onClick={() => setViewCurrPass(true)}
                                    />
                                    : null
                                }
                                {viewCurrPass == true
                                    ? <IoMdEyeOff
                                        className='text-xl leading-none cursor-pointer absolute top-10 right-3 text-gray-600'
                                        onClick={() => setViewCurrPass(false)}
                                    />
                                    : null
                                }
                            </div>
                            <div className='relative'>
                                <CustomInput
                                    label={"New Password"}
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    size='large'
                                    type={viewNewPass ? 'text' : 'password'}
                                />
                                {viewNewPass == false
                                    ? <IoMdEye
                                        className='text-xl leading-none cursor-pointer absolute top-10 right-3 text-gray-600'
                                        onClick={() => setViewNewPass(true)}
                                    />
                                    : null
                                }
                                {viewNewPass == true
                                    ? <IoMdEyeOff
                                        className='text-xl leading-none cursor-pointer absolute top-10 right-3 text-gray-600'
                                        onClick={() => setViewNewPass(false)}
                                    />
                                    : null
                                }
                            </div>
                        </div>
                        <CustomButton
                            text='Update Password'
                            size='none'
                            className='!py-1 !px-6 !w-fit !text-base'
                            onClick={() => changePassword(user?.id, currPassword, newPassword)}
                        />
                    </CustomCard>
                    <div
                        className={classNames(
                            'm-auto flex flex-col justify-start items-center gap-6 overflow-auto',
                            openSidebar ? 'w-full xl:w-[30%]' : 'w-full xl:w-[40%]'
                        )}
                    >
                        <div className='hidden xl:block text-gray-600'>You can upload 1 image per login!</div>
                        <div className='!h-40 !w-40 rounded-full bg-gray-400 flex items-center justify-center overflow-hidden'>
                            <img
                                src={profile?.profileImageUrl ? profile?.profileImageUrl : dummyuser}
                                alt={profile?.username}
                                className='h-full w-full'
                            />
                        </div>
                        <CustomInput
                            name="image"
                            text='Upload image'
                            accept="image/*"
                            type='file'
                            onChange={e => {
                                setProfileImg(e.target.files[0])
                                console.log(e.target.files[0])
                            }}
                            extraClass='!h-fit'
                            disabled={user?.isProfileImageUpdated ? true : false}
                        />
                        <CustomButton
                            type='submit'
                            text='Upload'
                            size='small'
                            className='!text-base !h-8'
                            onClick={handleImageUpload}
                        />
                    </div>
                </div>}
        </DashboardLayout>
    )
}

export default Profile