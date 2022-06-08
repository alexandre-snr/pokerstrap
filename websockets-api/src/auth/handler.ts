import { Claims, Token } from './token';
import { verifyEnv } from '../lib/env';

interface AuthEvent {
  methodArn: string
  headers: {
    Auth?: string
  }
}

const buildResponse = (
  success: boolean,
  methodArn: string,
  claims: Claims | undefined = undefined,
) => ({
  principalId: claims ? claims.sub : '',
  policyDocument: {
    Version: '2012-10-17',
    Statement: [
      {
        Action: 'execute-api:Invoke',
        Effect: success ? 'Allow' : 'Deny',
        Resource: methodArn,
      },
    ],
  },
});

export const handler = async (event: AuthEvent) => {
  const { methodArn, headers } = event;
  const { Auth } = headers;

  if (!verifyEnv()) {
    throw new Error('missing environment variables');
  }

  if (!Auth || !Auth.startsWith('Bearer ')) {
    return buildResponse(false, methodArn);
  }

  const tokenStr = Auth.substring('Bearer '.length);
  const token = new Token(tokenStr);

  if (!await token.verifyToken()) {
    return buildResponse(false, methodArn);
  }

  const claims = token.getClaims();
  if (!claims) {
    return buildResponse(false, methodArn);
  }

  return buildResponse(true, methodArn, claims);
};
