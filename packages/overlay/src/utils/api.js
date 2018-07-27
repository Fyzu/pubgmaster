import queryString from 'query-string'

const handleResponse = response => response.json()

export default function api(url, shard, options = {}) {
  const { params } = options
  const query = params ? `?${queryString.stringify(params)}` : ''

  return fetch(`/api/${shard}/${url}${query}`, options).then(handleResponse)
}
