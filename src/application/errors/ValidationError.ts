/**
 * @description Used when a validation problem has occurred.
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    this.message = message;
    console.error(message);

    // @ts-ignore
    this.cause = {
      statusCode: 400
    };
  }
}
