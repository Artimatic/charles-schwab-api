const charlesSchwabApi = require('../dist/charles-schwab-api/src');



const test1 = () => {
    charlesSchwabApi.authorize('', 'http://127.0.0.1:9000/');

};
test1();