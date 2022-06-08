import { Repository } from '../lib/database';
import { env, verifyEnv } from '../lib/env';

interface Event {
  requestContext: {
    eventType: 'CONNECT' | 'DISCONNECT' | 'MESSAGE'
    domainName: string
    stage: string
    connectionId: string
    authorizer: {
      principalId: string
    }
  },
  body: string
}

export const connectionHandler = async (event: Event) => {
  if (!verifyEnv()) {
    throw new Error('missing environment variables');
  }

  const {
    domainName, stage, connectionId, eventType, authorizer,
  } = event.requestContext;
  const connectionsRepository = new Repository(env.CONNECTIONS_TABLE);

  if (eventType === 'CONNECT') {
    await connectionsRepository.put({
      ConnectionId: connectionId,
      DomainName: domainName,
      Stage: stage,
      Subject: authorizer.principalId,
    });
  } else if (eventType === 'DISCONNECT') {
    await connectionsRepository.delete({
      ConnectionId: connectionId,
    });
  }

  return {
    statusCode: 200,
  };
};

export const defaultHandler = async (event: any) => {
  if (!verifyEnv()) {
    throw new Error('missing environment variables');
  }

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
