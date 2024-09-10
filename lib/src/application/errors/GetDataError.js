export class GetDataError extends Error {
    constructor(message) {
        super(message);
        this.name = 'GetDataError';
        this.message = message;
        console.error(message);
        this.cause = {
            statusCode: 500
        };
    }
}
//# sourceMappingURL=GetDataError.js.map