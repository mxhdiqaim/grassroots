import {  status } from 'elysia';
import { getEnvVariable } from "./index";

export const handleError = (
    message: string,
    statusCode: number = 500,
    originalError?: Error
) => {
    const NODE_ENV = getEnvVariable("NODE_ENV");

    // Logging Logic (Development only)
    if (NODE_ENV === "development") {
        console.error(`[Error ${statusCode}]: ${message}`);
        if (originalError) {
            console.error("Stack:", originalError.stack);
        }
    }

    //  Production Masking
    const errorMessage = (statusCode === 500 && NODE_ENV === "production")
        ? "Internal Server Error"
        : message;
    
    return status(statusCode, {
        type: statusCode,
        message: errorMessage,
    });
};