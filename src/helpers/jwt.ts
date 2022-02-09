const jwt = require('jsonwebtoken');
import { Request, Response, NextFunction } from "express";

interface IPayload {
    userEmail: string;
}

const authJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('authtoken')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.secret) as IPayload;
        req.email = verified.userEmail;
        next() 
    } catch (error) {
        res.status(400).json({error: 'Acceso denegado'})
    }
}

const authAdminJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('authtoken')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.secret)
        if (!verified.isAdmin) return res.status(401).json({error: 'Acceso denegado'})
        req.email = verified.userEmail
        next()
    } catch (error) {
        res.status(400).json({error: 'Acceso denegado'})
    }
}

const authTestJwt = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('authtoken')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.secret)
        if (verified.userEmail !== 'test@test.com') return res.status(401).json({error: 'Acceso denegado'})
        req.email = verified.userEmail
        next()
    } catch (error) {
        res.status(400).json({error: 'Acceso denegado'})
    }
}

module.exports = {authJwt, authAdminJwt} ;