/**
 * @description Used when a required key in the `spec` block is missing.
 */
export class MissingSpecKeysError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'MissingSpecKeysError';
    console.error(message);
  }
}
