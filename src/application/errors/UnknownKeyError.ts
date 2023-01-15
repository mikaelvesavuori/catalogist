/**
 * @description Used when an unknown key is encountered in the payload.
 */
export class UnknownKeyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownKeyError';
    console.error(message);
  }
}
