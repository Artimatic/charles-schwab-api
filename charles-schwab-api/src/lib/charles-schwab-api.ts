import axios from 'axios';
import qs from 'qs';

const host = 'https://api.schwabapi.com/v1';

export interface ApiResponse {
  // `data` is the response that was provided by the server
  data: any;

  // `status` is the HTTP status code from the server response
  status: number;

  // `statusText` is the HTTP status message from the server response
  statusText: string;

  // `headers` the HTTP headers that the server responded with
  // All header names are lowercase and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: any;

  // `config` is the config that was provided to `axios` for the request
  config: any;

  // `request` is the request that generated this response
  // It is the last ClientRequest instance in node.js (in redirects)
  // and an XMLHttpRequest instance in the browser
  request: any;
  json: any;
}

export function authorize(consumerKey: string, appCallbackUrl: string): Promise<ApiResponse> {
  const path = '/oauth/authorize';
  const url = `${host}${path}?client_id=${consumerKey}&redirect_uri=${appCallbackUrl}`;
  return axios({
    method: 'get',
    url
  });
}

export function getAccessToken(appKey: string, clientSecret: string, grant_type: string, code: string, redirect_uri: string): Promise<ApiResponse> {
  const path = '/oauth/token'
  const url = `${host}${path}`;
  const data = {
    grant_type,
    code,
    redirect_uri
  };

  const auth = Buffer.from(`${appKey}:${clientSecret}`).toString('base64');

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${auth}`
    },
    data: qs.stringify(data),
    url
  };
  return axios(options);
}

export function  getAccountNumbers(token) {
  const url = `${host}accounts/accountNumbers`;

  const options = {
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  return axios(options);
}