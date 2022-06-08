export const env = {
  REGION: process.env.REGION!,
  CONNECTIONS_TABLE: process.env.CONNECTIONS_TABLE!,
  COGNITO_USERPOOL_ID: process.env.COGNITO_USERPOOL_ID!,
};

export const verifyEnv = () => Object.keys(env)
  .every((variableName: string) => process.env[variableName]);
