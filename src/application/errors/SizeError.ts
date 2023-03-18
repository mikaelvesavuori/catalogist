/**
 * @description Used when a payload is too large.
 */
export class SizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SizeError';
    this.message = message;
    console.error(message);

    // @ts-ignore
    this.cause = {
      statusCode: 400
    };
  }
}
