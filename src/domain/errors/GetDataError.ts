/**
 * @description Used when error occurs while getting data.
 */
export class GetDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GetDataError';
    console.error(message);
  }
}
