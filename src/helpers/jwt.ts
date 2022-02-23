const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from "express";

const authAdminJwt = (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.isAdmin === true) {
        next()
    } else {
        res.status(400).json({error: 'Acceso denegado'});
    }
}

const authTestJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('authtoken')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.secret)
        if (verified.userEmail !== 'test@test.com') return res.status(401).json({error: 'Acceso denegado'})
        req.body.email = verified.userEmail
        next()
    } catch (error) {
        res.status(400).json({error: 'Acceso denegado'})
    }
}

module.exports = {authAdminJwt} ;