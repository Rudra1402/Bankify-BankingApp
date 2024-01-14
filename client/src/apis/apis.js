import api from '../axios/axios'
import Toast from '../custom/CustomToast'

export const userById = async (id, setUser, setLoading) => {
    await api.get(`/user/${id}`)
        .then(response => {
            setUser(response.data?.user)
            setLoading(false)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const updateUserApi = async (id, updateUser, setUser, setReRender) => {
    await api.put('/update/user', {
        id: id,
        firstName: updateUser?.firstName,
        lastName: updateUser?.lastName,
        email: updateUser?.email,
        username: updateUser?.username
    }).then(response => {
        Toast.success(response.data?.message);
        if (response.data?.isEmailUpdated) {
            setUser(null);
            localStorage.removeItem("user");
            Toast.warn('Verify your new email!');
        }
        setReRender(new Date().getTime());
    }).catch(err => {
        Toast.error(err?.response?.data?.message);
    })
}

export const updateUrl = async (id, url, setIsImgUploaded) => {
    await api.put(`/profileimage/${id}`, { url })
        .then(response => {
            Toast.success(response.data?.message)
            setIsImgUploaded(true)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const userLogin = async (payload, setUser) => {
    await api.post('/login', payload)
        .then(response => {
            if (response.data?.user?.token) {
                if (!response.data?.user?.isVerified) {
                    Toast.warn('Please verify your email!');
                } else {
                    localStorage.setItem("user", JSON.stringify(
                        { ...response.data?.user, isProfileImageUpdated: false }
                    ))
                    setUser({ ...response.data?.user, isProfileImageUpdated: false })
                }
            }
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const changePassword = async (id, currentPassword, newPassword) => {
    if (currentPassword == "" || newPassword == "") {
        Toast.error('Password cannot be empty!');
        return;
    }
    if (currentPassword == newPassword) {
        Toast.warn('Both passwords cannot be same!')
        return;
    }
    await api.put('/change-password', { id, currentPassword, newPassword })
        .then(response => {
            Toast.success(response.data?.message)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const resetPassword = (email) => {
    api.get('/forgot-password', { params: { email } })
        .then(response => {
            Toast.success(response.data?.message);
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const verifyPassResetToken = (token, pass, confirmPass, setIsPassReset) => {
    if (token == null) {
        Toast.error('Token is null. Try again or refresh the page!')
        return;
    }
    if (pass != confirmPass) {
        Toast.error('Both the passwords do not match!')
        return;
    }
    api.post('/reset-password', {
        token,
        newPassword: pass
    }).then(response => {
        Toast.success(response?.data?.message);
        setIsPassReset(true);
    }).catch(err => {
        Toast.error(err?.response?.data?.message);
    })
}

export const dashboardData = async (id, setData, setLoading) => {
    await api.get(`/dashboard/${id}`)
        .then(response => {
            setData(response.data?.obj)
            setLoading(false)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const userRegister = async (payload) => {
    await api.post('/register', payload)
        .then(response => {
            Toast.success(response.data?.message)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const verifyToken = (token, setMessage, setIsTokenVerified) => {
    api.get(`/verify/${token}`)
        .then(response => {
            setIsTokenVerified(true)
            setMessage(response.data?.message)
            Toast.success(response.data?.message)
        }).catch(err => {
            setIsTokenVerified(true)
            setMessage(err?.response?.data?.message)
            Toast.error(err?.response?.data?.message)
        })
}

export const verifyCardNumber = (cardNumber, setCardType, setIsCardValidated) => {
    api.post('/validatecard', { cardNumber: cardNumber.accountNumber })
        .then(response => {
            Toast.success(response.data?.message)
            setCardType({ ...cardNumber, accountType: response.data?.cardType })
            setIsCardValidated(true)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const addCardApi = (payload, setAccountInfo, setOpenAddCard, setReRender, setIsCardValidated) => {
    api.post('/addaccount', payload)
        .then(response => {
            Toast.success(response.data?.message)
            setAccountInfo({
                accountNumber: '',
                accountType: '',
            })
            setIsCardValidated(false)
            setOpenAddCard(false)
            setReRender(new Date().getTime())
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const findAccountsById = (id, setAccounts) => {
    api.get(`/accounts/${id}`)
        .then(response => {
            setAccounts(response.data?.accounts)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const findAccountsByEmail = (email, setAccounts) => {
    api.get(`/account-email/${email}`)
        .then(response => {
            setAccounts(response.data?.accounts)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const findTotalBalance = (userId, setBalance) => {
    api.get(`/balance/${userId}`)
        .then(response => {
            setBalance(response.data?.balance)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const addContact = (payload, setReRender, setOpenAddContact, setContactInfo, currentUserEmail) => {
    if (currentUserEmail == payload?.email) {
        return Toast.error('Cannot add yourself!');
    }
    api.post('/contacts', payload)
        .then(response => {
            Toast.success(response.data?.message)
            setContactInfo({ name: '', email: '', owner: payload?.owner })
            setOpenAddContact(false)
            setReRender(new Date().getTime())
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const contactsBySearch = (search, setContacts) => {
    api.get(`/contacts/${search}`)
        .then(response => {
            setContacts(response.data?.contacts)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const findContactsById = (id, setContacts, setLoading) => {
    api.get(`/contacts/${id}`)
        .then(response => {
            setContacts(response.data?.user)
            setLoading(false)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
            setLoading(false)
        })
}

export const findContactsByEmail = (email, setContacts) => {
    api.get(`/contact-email/${email}`)
        .then(response => {
            setContacts(response.data?.user)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const paymentTransfer = (fromAccId, toAccId, amount, setCreatePayment, setReRender) => {
    if (amount <= 0) {
        Toast.error('Amount cannot be 0 or less!')
        return;
    }
    if (!amount) {
        Toast.error('Enter a valid amount!');
        return;
    }
    api.post('/transfer', {
        fromAccount: fromAccId,
        toAccount: toAccId,
        amount: parseInt(amount)
    }).then(response => {
        setReRender(new Date().getTime())
        setCreatePayment(false)
        Toast.success(response.data?.message)
    }).catch(err => {
        Toast.error(err?.response?.data?.message)
    })
}

export const historyByAccountId = (accId, setHistory) => {
    api.get(`/history/${accId}`)
        .then(response => {
            setHistory(response.data?.transactionHistory)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const uploadFile = (file) => {

    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('image', file);

    api.post('/uploadImage', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    }).then((response) => {
        Toast.success('File uploaded successfully.');
    }).catch((error) => {
        Toast.error('File upload failed. Please try again.');
    });
};

export const historyByUserId = async (id, setHistory, setLoading) => {
    await api.get(`/transaction/${id}`)
        .then(response => {
            setHistory(response.data?.history)
            setLoading(false)
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
            setLoading(false)
        })
}

export const createRequest = async (payload, setRequestMoney, setReRender) => {
    await api.post('/request', payload)
        .then(response => {
            Toast.success(response.data?.message);
            setRequestMoney(false);
            setReRender(new Date().getTime());
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const getIncomingRequests = async (userId, setRequests, setLoading) => {
    await api.get(`/requests/incoming/${userId}`)
        .then(response => {
            setRequests(response.data?.userRequests)
            setLoading(false);
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const getOutgoingRequests = async (userId, setRequests, setLoading) => {
    await api.get(`/requests/outgoing/${userId}`)
        .then(response => {
            setRequests(response.data?.userRequests)
            setLoading(false);
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const getNotifications = async (userid, setNotifs) => {
    await api.get(`/notifications/${userid}`)
        .then(response => {
            setNotifs(response.data?.notifications);
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const requestDecline = async (reqid, setReRender) => {
    await api.put(`/request-decline/${reqid}`)
        .then(response => {
            Toast.success(response.data?.message)
            setReRender(new Date().getTime())
        }).catch(err => {
            Toast.error(err?.response?.data?.message)
        })
}

export const requestAccept = async (reqid, toAccount, fromAccount, amount, setInitiateReq, setIntReRender, setReRender) => {
    await api.put(`/request-initiate/${reqid}`, {
        fromAccount,
        toAccount,
        amount
    }).then(response => {
        setIntReRender(new Date().getTime());
        setReRender(new Date().getTime());
        setInitiateReq(false);
        Toast.success(response.data?.message);
    }).catch(err => {
        Toast.error(err?.response?.data?.message);
    })
}

export const deleteContact = async (contactId, setReRender, setDeleteContactDialog) => {
    await api.delete(`/delete-contact/${contactId}`)
        .then(response => {
            Toast.success(response.data?.message);
            setDeleteContactDialog(false);
            setReRender(new Date().getTime());
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const deleteAccountt = async (accountId, setReRender, setDeleteAccountDialog) => {
    await api.delete(`/delete-account/${accountId}`)
        .then(response => {
            Toast.success(response.data?.message);
            setDeleteAccountDialog(false);
            setReRender(new Date().getTime());
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const getAdminDashboardData = async (isadmin, setAdminDashData, setLoading) => {
    await api.get('/admin-dashboard', { headers: { isadmin: isadmin } })
        .then(response => {
            setAdminDashData(response.data?.totalAmount)
            setLoading(false)
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}

export const getAdminUsers = async (isadmin, setUsers, setLoading) => {
    await api.get('/admin-users', { headers: { isadmin: isadmin } })
        .then(response => {
            setUsers(response.data?.users)
            setLoading(false)
        }).catch(err => {
            Toast.error(err?.response?.data?.message);
        })
}