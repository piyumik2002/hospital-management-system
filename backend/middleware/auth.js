const jwt = require('jsonwebtoken');

// Middleware to verify if the user is authenticated via JWT
exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided, access denied.' });
    }

    try {
        // Remove 'Bearer ' prefix if sent in the authorization header
        const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
        const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET || 'your_jwt_secret_key');
        
        // Attach decoded user information (id, role, etc.) to the request object
        req.user = decoded; 
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

// Middleware to check specific allowed roles for role-based access control (RBAC)
exports.authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Access denied: Role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this resource.` 
            });
        }
        next();
    };
};

// Convenient helper middleware to restrict route access strictly to Admin role
exports.adminOnly = (req, res, next) => {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({ 
            message: `Access denied: Admin authorization required.` 
        });
    }
    next();
};