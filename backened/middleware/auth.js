const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];

            // Verify token and attach user data (id, email, role) to the request
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Token verification error:', error);
            // 401: Unauthorized
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    }

    if (!token) {
        // 401: Unauthorized
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    // This runs AFTER 'protect', so req.user exists
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // 403: Forbidden
        res.status(403).json({ message: 'Not authorized as an admin' });
    }
};

module.exports = { protect, admin };