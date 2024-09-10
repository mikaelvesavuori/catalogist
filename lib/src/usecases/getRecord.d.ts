import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { Repository } from '../interfaces/Repository';
export declare function getRecord(repo: Repository, event: APIGatewayProxyEventV2): Promise<any>;
