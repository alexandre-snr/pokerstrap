import { DynamoDB } from 'aws-sdk';

interface Event {
  requestContext: {
    eventType: 'CONNECT' | 'DISCONNECT' | 'MESSAGE'
    domainName: string
    stage: string
    connectionId: string
  },
  body: string
}

const dynamo = new DynamoDB.DocumentClient({ region: process.env.REGION });

export const connectionHandler = async (event: Event) => {
  const {
    domainName, stage, connectionId, eventType,
  } = event.requestContext;

  if (eventType === 'CONNECT') {
    await dynamo.put({
      TableName: process.env.CONNECTIONS_TABLE!,
      Item: {
        ConnectionId: connectionId,
        DomainName: domainName,
        Stage: stage,
      },
      ReturnValues: 'ALL_OLD',
    }).promise();
  } else if (eventType === 'DISCONNECT') {
    await dynamo.delete({
      TableName: process.env.CONNECTIONS_TABLE!,
      Key: {
        ConnectionId: connectionId,
      },
    }).promise();
  }

  return {
    statusCode: 200,
  };
};

export const defaultHandler = async (event: any) => {
  console.log(event);
  return {
    isBase64Encoded: false,
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: 'Message received',
    }),
  };
};
