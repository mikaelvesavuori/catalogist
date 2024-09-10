import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';
import { QueryStringParams } from '../../interfaces/QueryStringParams';
export declare function getQueryStringParams(queryStringParameters: APIGatewayProxyEventQueryStringParameters | Record<string, unknown>): QueryStringParams;
