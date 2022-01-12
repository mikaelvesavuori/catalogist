/**
 * @description Used when a problem occurred while updating a database record.
 */
export class UpdateItemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UpdateItemError';
    console.error(message);
  }
}
