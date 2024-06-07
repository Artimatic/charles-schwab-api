# charles-schwab-api

Unofficial API wrapper for Charles Schwab Accounts and Trading, Market Data APIs

## Installation

```
npm install charles-schwab-api
```

## Usage

### CommonJS
```
const charlesSchwabApi = require('charles-schwab-api'); 
```
### ES6
```
import * as charlesSchwabApi from 'charles-schwab-api';
```

Authorize
```
charlesSchwabApi.authorize(appKey, callbackUrl);
```

Get token
```
charlesSchwabApi.getAccessToken(appKey,
      secret,
      'authorization_code',
      callbackUrl);
```

Refresh token
```
charlesSchwabApi.refreshAccessToken(appKey,
      secret,
      refreshToken);
```

Get account numbers
```
charlesSchwabApi.getAccountNumbersHashValues(appKey, secret);
```