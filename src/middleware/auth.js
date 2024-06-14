// Middleware för att kontrollera att en användare är inloggad.
// Används för att visa orderhistoriken.
const authenticate = (req, res, next) => {
  if (global.currentUser) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'You need to be logged in to view the order history',
      status: 401
    });
  }
};

// Check if logged-in user has admin-role, which gives access to update menu.
const checkAdmin = (req, res, next) => {
  console.log("Checking admin access for:", global.currentUser);
  if (global.currentUser && global.currentUser.role === 'admin') {
    console.log("Admin access granted:", global.currentUser);
    next();
  } else {
    console.log("Admin access denied:", global.currentUser);
    res.status(401).json({
      success: false,
      message: 'You need to be an admin to perform this action',
      status: 401
    });
  }
};

export { authenticate, checkAdmin };
