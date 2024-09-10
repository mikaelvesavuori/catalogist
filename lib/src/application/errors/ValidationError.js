export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.message = message;
        console.error(message);
        this.cause = {
            statusCode: 400
        };
    }
}
//# sourceMappingURL=ValidationError.js.map