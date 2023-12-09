export const getUserId = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user.id) {
        return user.id
    }
    return false
}

export const getUserToken = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user.token) {
        return user.token
    }
    return false
}

export const getUsername = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user.username) {
        return user.username
    }
    return false
}

export const checkAdmin = () => {
    let user = JSON.parse(localStorage.getItem('user'))
    if (user.isAdmin) {
        return true
    }
    return false
}