export class MissingSpecKeysError extends Error {
    constructor(message) {
        super(message);
        this.name = 'MissingSpecKeysError';
        this.message = message;
        console.error(message);
        this.cause = {
            statusCode: 400
        };
    }
}
//# sourceMappingURL=MissingSpecKeysError.js.map