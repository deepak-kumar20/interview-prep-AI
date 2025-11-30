// Middleware to check if user has required role
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
        requiredRole: allowedRoles,
        userRole: req.user.role,
      });
    }

    next();
  };
};

// Specific role checkers
const isStudent = checkRole("student", "admin");
const isTeacher = checkRole("teacher", "admin");
const isAdmin = checkRole("admin");
const isTeacherOrAdmin = checkRole("teacher", "admin");

module.exports = {
  checkRole,
  isStudent,
  isTeacher,
  isAdmin,
  isTeacherOrAdmin,
};
