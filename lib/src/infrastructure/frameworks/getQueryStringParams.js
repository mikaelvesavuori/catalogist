export function getQueryStringParams(queryStringParameters) {
    return {
        repo: queryStringParameters?.['repo'] || '',
        service: queryStringParameters?.['service'] || ''
    };
}
//# sourceMappingURL=getQueryStringParams.js.map