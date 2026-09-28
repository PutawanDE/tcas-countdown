import * as dotenv from "dotenv";

dotenv.config();

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const config = {
  consumer_key: requireEnv("CONSUMER_KEY"),
  consumer_secret: requireEnv("CONSUMER_SECRET"),
  access_token: requireEnv("ACCESS_TOKEN"),
  access_token_secret: requireEnv("ACCESS_TOKEN_SECRET"),
};

export default config;
