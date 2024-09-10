export class SizeError extends Error {
    constructor(message) {
        super(message);
        this.name = 'SizeError';
        this.message = message;
        console.error(message);
        this.cause = {
            statusCode: 400
        };
    }
}
//# sourceMappingURL=SizeError.js.map