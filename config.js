import * as dotenv from "dotenv";
dotenv.config();

const consumer_key = process.env.CONSUMER_KEY;
const consumer_secret = process.env.CONSUMER_SECRET;
const access_token = process.env.ACCESS_TOKEN;
const access_token_secret = process.env.ACCESS_TOKEN_SECRET;

export default {
  consumer_key,
  consumer_secret,
  access_token,
  access_token_secret,
};
