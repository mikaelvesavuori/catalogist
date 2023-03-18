/**
 * @description Used when a required key in the `spec` block is missing.
 */
export class MissingSpecKeysError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingSpecKeysError';
    this.message = message;
    console.error(message);

    // @ts-ignore
    this.cause = {
      statusCode: 400
    };
  }
}
