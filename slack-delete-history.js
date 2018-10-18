const https = require('https');
const args = process.argv.slice(2);

const ts_to = args[0];
const token = args[1];
const channel = args[2];

if (!ts_to || !token) {
    console.log("Must provide timestamp and token","\n","$ node ./slack-delete-history.js [timestamp] [token]");
    return;
}

const isPrivateChannel = false;
const delay         = 500; // Don't get Throttled! ;)
const channelApi    = isPrivateChannel ? 'groups' : 'channels';
const baseApiUrl    = 'https://slack.com/api/';
const historyApiUrl = baseApiUrl + channelApi + '.history?token=' + token + '&count=1000&channel=' + channel + '&latest=' + ts_to + '&oldest=' + 0;
const deleteApiUrl  = baseApiUrl + 'chat.delete?token=' + token + '&channel=' + channel + '&ts='
const messages      = [];

// ---------------------------------------------------------------------------------------------------------------------

function deleteMessage() {

    if (messages.length == 0) {
        return;
    }

    const ts = messages.pop();

    https.get(deleteApiUrl + ts, function (res) {

        let body = '';

        res.on('data', function (chunk) {
            body += chunk;
        });

        res.on('end', function(){
            const response = JSON.parse(body);

            if (response.ok === true) {
                console.log(ts + ' deleted!');
            } else if (response.ok === false) {
                console.log(response);
                messages.push(ts);
            }

            setTimeout(deleteMessage, delay);
        });
    }).on('error', function (e) {
        console.log("Got an error: ", e);
    });
}

// ---------------------------------------------------------------------------------------------------------------------

console.log("Beginning Bulk Delete", historyApiUrl);

https.get(historyApiUrl, function(res) {

    let body = '';

    res.on('data', function (chunk) {
        body += chunk;
    });

    res.on('end', function () {

        const response = JSON.parse(body);

        console.log(response);
        if (response.ok === false) {
            return;
        }

        if (!response.messages) {
            console.log(response);
            return;
        }

        for (let i = 0; i < response.messages.length; i++) {
            console.log(i, response.messages[i].ts);
            messages.push(response.messages[i].ts);
        }

        deleteMessage();
    });
}).on('error', function (e) {
      console.log("Got an error: ", e);
});
