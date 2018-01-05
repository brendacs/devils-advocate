import { auth } from '../../../auth.js';

const ACCESS_TOKEN = auth.access_token;
const API_KEY = auth.api_key;

export const settings = {
  "async": true,
  "crossDomain": true,
  "url": `https://api.typeform.com/forms/xqCi7y/responses?key=${API_KEY}`,
  "method": "GET",
  "headers": {
    "Authorization": `bearer ${ACCESS_TOKEN}`
  }
}
