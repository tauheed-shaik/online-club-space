import jwt from 'jsonwebtoken'

//custom middlewares

//1) TO VERIFY TOKEN
export const verifyToken = (req, res, next) => {

    // Support both cookie and Authorization header (Bearer token)
    let token = req.cookies.accessToken
    if (!token && req.headers.authorization) {
        const parts = req.headers.authorization.split(' ')
        if (parts.length === 2 && parts[0] === 'Bearer') {
            token = parts[1]
        }
    }

    if (!token) {
        return res.status(401).json({ status: "failed", success: "false", 
                         message: "You are not authorized. Please login." })
    }

    //if token exists then verifying it
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(401).json({ status: "failed", success: "false", 
                                         message: "Token is invalid or expired. Please login again." })
        }
        req.user = user
        next()
    })
}

//2) TO VERIFY USER (user themselves OR admin)
export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.role === 'admin') {
            next()
        } else {
            return res.status(403).json({ status: "failed", success: "false", 
                                         message: "You are not authorized to perform this action" })
        }
    })
}

//3) TO VERIFY ADMIN
export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next()
        } else {
            return res.status(403).json({ status: "failed", success: "false", 
                                         message: "You are not authorized. Admin access required." })
        }
    })
}
