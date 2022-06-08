import * as jwkToPem from 'jwk-to-pem';
import * as Axios from 'axios';
import * as jsonwebtoken from 'jsonwebtoken';
import { promisify } from 'util';
import { env } from '../lib/env';

const verifyPromised = promisify(jsonwebtoken.verify.bind(jsonwebtoken));

export interface Claims {
  token_use: string;
  iss: string;
  exp: number;
  auth_time: number;
  sub: string;
}

export class Token {
  private static cognitoIssuer = `https://cognito-idp.${env.REGION}.amazonaws.com/${env.COGNITO_USERPOOL_ID}`;

  private readonly token: string;

  private isVerified: boolean;

  private claims: Claims | undefined;

  constructor(token: string) {
    this.token = token;
    this.isVerified = false;
    this.claims = undefined;
  }

  private static async getPublicKeys() {
    const url = `${Token.cognitoIssuer}/.well-known/jwks.json`;

    const publicKeys = await Axios.default.get<any>(url);
    return publicKeys.data.keys.reduce((agg, current) => {
      const pem = jwkToPem(current);
      return {
        ...agg,
        [current.kid]: { instance: current, pem },
      };
    }, {} as { [key: string]: any });
  }

  public async verifyToken() {
    const tokenSections = (this.token).split('.');
    console.log({ tokenSections });
    if (tokenSections.length < 2) {
      return false;
    }
    const headerJSON = Buffer.from(tokenSections[0], 'base64').toString('utf8');
    const header = JSON.parse(headerJSON);
    const keys = await Token.getPublicKeys();
    console.log({ keys });
    const key = keys[header.kid];
    if (key === undefined) {
      return false;
    }
    console.log({ key });
    const claim = await verifyPromised(this.token, key.pem) as Claims;
    console.log({ claim });
    const currentSeconds = Math.floor((new Date()).valueOf() / 1000);
    if (currentSeconds > claim.exp || currentSeconds < claim.auth_time) {
      return false;
    }
    if (claim.iss !== Token.cognitoIssuer) {
      return false;
    }
    if (claim.token_use !== 'id') {
      return false;
    }

    this.isVerified = true;
    this.claims = claim;
    return true;
  }

  public getClaims(): Claims | undefined {
    if (!this.isVerified || !this.claims) {
      return undefined;
    }
    return this.claims;
  }
}
