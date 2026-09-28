import crypto from "crypto";
import OAuth from "oauth-1.0a";

import config from "./config";

const oauth = new OAuth({
  consumer: {
    key: config.consumer_key,
    secret: config.consumer_secret,
  },
  signature_method: "HMAC-SHA1",
  hash_function(baseString, key) {
    return crypto
      .createHmac("sha1", key)
      .update(baseString)
      .digest("base64");
  },
});

export default function createAuthorizationHeader(
  queryParameters: Record<string, string>,
  httpMethod: "GET" | "PUT" | "POST" | "DELETE",
  url: string,
): string {
  const requestData = {
    url,
    method: httpMethod,
    data: queryParameters,
  };

  const authorization = oauth.authorize(requestData, {
    key: config.access_token,
    secret: config.access_token_secret,
  });

  const header = oauth.toHeader(authorization);

  // Safe diagnostic logging.
  console.log("[OAuth 1.0a]", {
    method: httpMethod,
    url,
    parameterNames: Object.keys(queryParameters),
    signatureMethod: "HMAC-SHA1",
  });

  return header.Authorization;
}
