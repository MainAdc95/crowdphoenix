import { Request, Response, NextFunction } from "express"


export default (err: any, req: Request, res: Response, next: NextFunction) => {
    return res.status(err.status || 500).json({
        status: err.status || 500,
        message: err.message || "something went wrong on the server!"
    })
}