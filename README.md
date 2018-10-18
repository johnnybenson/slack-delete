#  Slack Delete 🗑 🔥

Not sure where I found these separate scripts

Delete your slack history and uploads to manage your free account limits

## How to?

```sh
$ touch slack-delete-conf.json
```

```json
{
    "token" : "your slack api token",
    "days" : 7,
    "channel" : "your slack channel token"
}
```

Days is the number of days old, so delete everything older than 7 days

```sh
$ ruby slack-delete.rb
```