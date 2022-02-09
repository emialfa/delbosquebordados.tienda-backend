import { NextFunction, Request, Response } from "express";

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        console.error(err)
        return res.status(401).json({message: "The user is not authorized"})
    }

    if (err.name === 'ValidationError') {
        //  validation error
        console.error(err)
        return res.status(401).json({message: err})
    }

    // default to 500 server error
    console.error(err)
    return res.status(500).json(err);
}

module.exports = errorHandler;