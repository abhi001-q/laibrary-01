import ROLES from '../config/roles.js';

const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied. Insufficient permissions.' });
    }
    
    if (req.user.role === ROLES.LIBRARIAN && !req.user.isApproved) {
      return res.status(403).json({ message: 'Your librarian account is pending approval.' });
    }
    
    next();
  };
};

export default roleMiddleware;