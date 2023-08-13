import crypto from "crypto";

import config from "./config";

function encodeParameters(parameters = {}) {
  const encodedParameters = Object.keys(parameters).sort().map((key) => {
    return `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key as keyof typeof parameters]!)}`;
  }).join('&');
  return encodedParameters;
}

function calculateSignature(signatureBaseString: string) {
  const signingKey = `${encodeURIComponent(config.consumer_secret!)}&${encodeURIComponent(config.access_token_secret!)}`;
  const signature = crypto.createHmac('sha1', signingKey).update(signatureBaseString).digest('base64').toString();
  console.log("Raw Signature: ", signature);
  return signature;
}

// Oauth 1.0a
// https://developer.twitter.com/en/docs/authentication/oauth-1-0a/creating-a-signature
// https://pandeysoni.medium.com/how-to-create-oauth-1-0a-signature-in-node-js-7d477dead170
export default function createAuthorizationHeader(queryParameters: {},
  httpMethod: "GET" | "PUT" | "POST" | "DELETE", url: string) {

  const oauth_timestamp = Math.floor(Date.now() / 1000).toString();
  const oauth_nonce = crypto.randomBytes(32).toString('hex');

  const parameters = {
    ...queryParameters,
    oauth_consumer_key: config.consumer_key,
    oauth_nonce,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp,
    oauth_token: config.access_token,
    oauth_version: "1.0",
  };

  const encodedParameters = encodeParameters(parameters);
  const signatureBaseString = `${httpMethod}&${encodeURIComponent(url)}&${encodeURIComponent(encodedParameters)}`;
  const encodedSignature = encodeURIComponent(calculateSignature(signatureBaseString));

  console.log("Encoded Parameters: ", encodedParameters);
  console.log("Signature Base String: ", signatureBaseString);
  console.log("Encoded Signature: ", encodedSignature);

  const authorizationHeader = `OAuth oauth_consumer_key="${config.consumer_key}",oauth_token="${config.access_token}",oauth_signature_method="HMAC-SHA1",oauth_timestamp="${oauth_timestamp}",oauth_nonce="${oauth_nonce}",oauth_version="1.0",oauth_signature="${encodedSignature}"`;
  console.log("Authorization Header: ", authorizationHeader);
  return authorizationHeader;
}