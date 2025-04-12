import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import logger from "../config/logger";
import { CustomError } from "../types";


export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction) => {

    logger.error(error);

    if (error instanceof z.ZodError) {
        console.log("ZodError");
        res.status(400).json({
            status: "error",
            message: 'Invalid input',
            errors: error.errors,
        });
        return;
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    const status = error.status || "error";

    if (process.env.NODE_ENV != "production") {
        logger.error({
            message,
            stack: error.stack,
            path: req.path,
            method: req.method,
            body: req.body,
            query: req.query,

        });

    }



    // Log the error
    console.log({
        message,
        statusCode,
        status,
    })
    res.status(statusCode).json({
        status,
        message,
    });

}
