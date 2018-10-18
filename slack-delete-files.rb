require 'net/http'
require 'json'
require 'uri'

@ts_to = ARGV[0];
@token = ARGV[1];

if !@ts_to
  p "Could not continue without Timestamp"
  p "$ ruby ./slack-delete-files.rb 1532189991"
  exit
end

def list_files
  params = {
    token: @token,
    ts_to: @ts_to,
    count: 1000
  }
  uri = URI.parse('https://slack.com/api/files.list')
  uri.query = URI.encode_www_form(params)
  response = Net::HTTP.get_response(uri)
  JSON.parse(response.body)['files'] || []
end

def delete_files(file_ids)
  file_ids.each do |file_id|
    params = {
      token: @token,
      file: file_id
    }
    uri = URI.parse('https://slack.com/api/files.delete')
    uri.query = URI.encode_www_form(params)
    response = Net::HTTP.get_response(uri)
    p "#{file_id}: #{JSON.parse(response.body)['ok']}"
  end
end

files = list_files
p "Timestamp: #{@ts_to}"
p "Deleting #{files.length} files..."
file_ids = files.map { |f| f['id'] }
delete_files(file_ids)
p 'Done!'
