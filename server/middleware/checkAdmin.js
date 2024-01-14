const checkIsAdmin = (req, res, next) => {
    const isadmin = req.headers['isadmin'];
    if (isadmin) {
        console.log('isAdmin');
        next();
    }
    else {
        return res.status(401).json({ message: 'Unauthorized to access this page!' });
    }
}

module.exports = checkIsAdmin;