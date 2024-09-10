export class UpdateItemError extends Error {
    constructor(message) {
        super(message);
        this.name = 'UpdateItemError';
        this.message = message;
        console.error(message);
        this.cause = {
            statusCode: 500
        };
    }
}
//# sourceMappingURL=UpdateItemError.js.map