// src/middleware/error.middleware.ts
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { ServerError } from '../utils/server.error.ts';

// ErrorRequestHandler forces Express to recognize this as a global error-handling catch block
export const errorHandler: ErrorRequestHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  
  // 1. Establish structural fallbacks
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // 2. Type Guard: Safely check if the error was created by your custom class
  if (err instanceof ServerError) {
    statusCode = err.statusCode; // TypeScript now safely unlocks .statusCode here!
    message = err.message;
  } 

  // 3. Handle other Mongoose or JWT dynamic error structural formats...
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map((val: any) => val.message).join(', ');
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid format for field: ${err.path}`;
  }

  // 4. Catch MongoDB Duplicate Key Errors (e.g. unique email violation)
  if (err.code === 11000) {
    statusCode = 409;
    const duplicateField = Object.keys(err.keyValue)[0];
    message = `A record with that ${duplicateField} already exists.`;
  }

  // 5. Catch Expired or Invalid JSON Web Tokens
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Your login session is invalid. Please sign in again.';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your login session has expired. Please sign in again.';
  }

  // 6. Send uniform error structure to client
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    // Provide stack trace for debug execution, but mask it away during production
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
