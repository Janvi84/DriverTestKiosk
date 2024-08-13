const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/login');
    }
};

const isDriver = (req, res, next) => {
    if (req.session.user && req.session.user.userType === 'Driver') {
        return next();
    } else {
        req.flash('error_msg', 'Access denied');
        res.redirect('/login');
    }
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.userType === 'Admin') {
        return next();
    } else {
        req.flash('error_msg', 'Access denied');
        res.redirect('/login');
    }
};

const isExaminer = (req, res, next) => {
    if (req.session.user && req.session.user.userType === 'Examiner') {
        return next();
    } else {
        req.flash('error_msg', 'Access denied');
        res.redirect('/login');
    }
};

module.exports = {
    isAuthenticated,
    isDriver,
    isAdmin,
    isExaminer
};
