const fetch = require('node-fetch')
const queryString = require('query-string')

const handleResponse = response => response.json()

const BASE_URL = 'https://api.pubg.com/shards/'

function api(url, shard = 'pc-eu', options = {}) {
  const { params } = options
  const query = params ? `?${queryString.stringify(params)}` : ''

  const finalOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${process.env.API_KEY}`,
      'Accept': 'application/vnd.api+json',
    },
  }

  return fetch(`${BASE_URL}${shard}/${url}${query}`, finalOptions)
    .then(handleResponse)
}

module.exports = api
