import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { env } from './env';

export const ddbClient = new DynamoDBClient(env.REGION);
export const documentClient = DynamoDBDocumentClient.from(ddbClient, {});

export class Repository {
  private readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  public async put(item: any) {
    try {
      return await documentClient.send(new PutCommand({
        TableName: this.tableName,
        Item: item,
        ReturnValues: 'ALL_OLD',
      }));
    } catch (e) {
      console.log(`Repository "${this.tableName}" failed - put.`, item, e);
      throw e;
    }
  }

  public async delete(key: any) {
    try {
      return await documentClient.send(new DeleteCommand({
        TableName: this.tableName,
        Key: key,
      }));
    } catch (e) {
      console.log(`Repository "${this.tableName}" failed - delete.`, key, e);
      throw e;
    }
  }
}
