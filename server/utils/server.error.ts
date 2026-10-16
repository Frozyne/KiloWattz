export class ServerError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // Call parent Error constructor
    this.statusCode = statusCode;
    
    // Ensures the prototype chain is correct in older JS environments
    Object.setPrototypeOf(this, ServerError.prototype); 
  }
}