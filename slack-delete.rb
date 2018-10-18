require 'net/http'
require 'json'
require 'uri'
require 'date'

file = File.read "slack-delete-conf.json"
data = JSON.parse(file)

@token = data["token"]
@ts_to = (Time.now - 3600 * 24 * data["days"]).to_i # 7 days ago
@channel = data["channel"]

p Time.at(@ts_to).to_datetime.to_s

system "ruby ./slack-delete-files.rb #{@ts_to.to_i} #{@token}"
system "node ./slack-delete-history.js #{@ts_to.to_i} #{@token} #{@channel}"
