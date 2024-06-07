import axios from 'axios';
import qs from 'qs';

const host = 'https://api.schwabapi.com/v1';
const charlesSchwabTraderUrl = 'https://api.schwabapi.com/trader/v1/';
const charlesSchwabMarketDataUrl = 'https://api.schwabapi.com/marketdata/v1/';

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

export enum OptionsStrategy {
  SINGLE,
  ANALYTICAL,
  COVERED,
  VERTICAL,
  CALENDAR,
  STRANGLE,
  STRADDLE,
  BUTTERFLY,
  CONDOR,
  DIAGONAL,
  COLLAR,
  ROLL
}

export enum ContractType {
  CALL,
  PUT,
  ALL
}

export function getAuthorization(appKey: string, appSecret: string) {
  return Buffer.from(`${appKey}:${appSecret}`).toString('base64');
}

export function authorize(appKey: string, appCallbackUrl: string): Promise<ApiResponse> {
  const path = '/oauth/authorize';
  const url = `${host}${path}?client_id=${appKey}&redirect_uri=${appCallbackUrl}`;
  return axios({
    method: 'get',
    url
  });
}

export function getAccessToken(appKey: string, appSecret: string, grant_type: string, code: string, redirect_uri: string): Promise<ApiResponse> {
  const path = '/oauth/token'
  const url = `${host}${path}`;
  const data = {
    grant_type,
    code,
    redirect_uri
  };

  const options = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${getAuthorization(appKey, appSecret)}`
    },
    data: qs.stringify(data),
    url
  };
  return axios(options);
}

export function refreshAccessToken(appKey: string, appSecret: string, refreshToken: string) {
  const path = '/oauth/token'
  const url = `${host}${path}`;

  const data = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  };
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${getAuthorization(appKey, appSecret)}`
    },
    data: qs.stringify(data),
    url
  };
  return axios(options);
}

export function getAccountNumbersHashValues(appKey: string, appSecret: string) {
  const url = `${host}accounts/accountNumbers`;

  const options = {
    method: 'GET',
    url,
    headers: {
      Authorization: `Bearer ${getAuthorization(appKey, appSecret)}`
    }
  };

  return axios(options);
}

export function getMarketData(appKey: string, appSecret: string, symbol: string, accountId: string) {

  const query = `${charlesSchwabMarketDataUrl}${symbol}/quotes`;
  const options = {
    url: query,
    params: {
      fields: 'quote'
    },
    headers: {
      Authorization: `Bearer ${getAuthorization(appKey, appSecret)}`
    }
  };
  return axios(options);
}

export function getPriceHistory(appKey: string, appSecret: string, symbol: string) {
  const query = `${charlesSchwabMarketDataUrl}pricehistory`;
  const options = {
    url: query,
    params: {
      symbol,
      periodType: 'day',
      period: 2,
      frequencyType: 'minute',
      frequency: 1,
      endDate: Date.now()
    },
    headers: {
      Authorization: `Bearer ${getAuthorization(appKey, appSecret)}`
    }
  };

  return axios(options);
}

export function placeOrder(appKey: string, appSecret: string, accountNumberHashValue: string, orderBody: any) {
  const headers = {
    'Accept': '*/*',
    'Accept-Encoding': 'gzip',
    'Accept-Language': 'en-US',
    Authorization: `Bearer ${getAuthorization(appKey, appSecret)}`,
    'Content-Type': 'application/json',
  };

  const options = {
    url: charlesSchwabTraderUrl + `accounts/${accountNumberHashValue}/orders`,
    headers: headers,
    json: true,
    gzip: true,
    body: orderBody
  };

  return axios(options);
}

export function getPositions(appKey: string, appSecret: string, accountNumberHashValue: string) {

  const query = `${charlesSchwabTraderUrl}accounts/${accountNumberHashValue}`;
  const options = {
    url: query,
    params: {
      fields: 'positions'
    },
    headers: {
      Authorization: `Bearer ${getAuthorization(appKey, appSecret)}`
    }
  };

  return axios(options);
}

export function createDefaultOptionsChainRequestParams(symbol: string, contractType: ContractType, includeUnderlyingQuote: boolean,
  strikeCount: number, strategy: OptionsStrategy, optionType = 'S') {
  return {
    symbol,
    strikeCount,
    strategy,
    range: 'SNK',
    optionType,
    contractType
  };
}

export function getOptionsChain(appKey: string, appSecret: string, params: any) {
  const query = `${charlesSchwabMarketDataUrl}chains`;

  const options = {
    url: query,
    params,
    headers: {
      Authorization: `Bearer ${getAuthorization(appKey, appSecret)}`
    }
  };
  return axios(options);
}

export function getEquityMarketHours(appKey: string, appSecret: string, date: string, markets = 'equity') {
  const query = `${charlesSchwabMarketDataUrl}markets`;
  const options = {
    url: query,
    params: {
      markets,
      date
    },
    headers: {
      Authorization: `Basic ${getAuthorization(appKey, appSecret)}`
    }
  };

  return axios(options);
}

export function getInstrument(appKey: string, appSecret: string, cusip: string, projection: string = 'fundamental') {
  const url = `${charlesSchwabMarketDataUrl}instruments?symbol=${cusip}&projection=${projection}`;

  const options = {
    url: url,
    headers: {
      Authorization: `Basic ${getAuthorization(appKey, appSecret)}`
    }
  };

  return axios(options);
}