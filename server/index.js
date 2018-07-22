const R = require('ramda')
const moment = require('moment')
const api = require('./utils/api')

const getPlayer = async (shard, playerName) => {
  const { data: players } = await api('players', shard, {
    params: {
      'filter[playerNames]': playerName,
    },
  })

  const player = players.find(item => item.attributes.name === playerName)

  return player
}

const getMatch = async (shard, matchId) => {
  const match = await api(`matches/${matchId}`, shard)

  return match
}

const getPlayerMatchIds = R.compose(
  R.map(R.prop('id')),
  R.pathOr([], ['relationships', 'matches', 'data'])
)

const getPlayerStatsInMatch = (match, playerName) =>
  R.compose(
    R.pathOr({}, ['attributes', 'stats']),
    R.find(
      R.and(
        R.propEq('type', 'participant'),
        R.pathEq(['attributes', 'stats', 'name'], playerName)
      )
    ),
    R.propOr([], 'included')
  )(match)

const setupServer = app => {
  app.get('/api/:shard/player/:playerName', async (req, res) => {
    const { playerName, shard } = req.params

    const player = await getPlayer(shard, playerName)

    return res.send(player)
  })

  app.get('/api/:shard/match/:matchId', async (req, res) => {
    const { matchId, shard } = req.params

    const match = await getMatch(shard, matchId)

    return res.send(match)
  })

  app.get('/api/:shard/stats/:playerName', async (req, res) => {
    const { shard, playerName } = req.params
    const { afterAt } = req.query

    const player = await getPlayer(shard, playerName)
    const matchIds = getPlayerMatchIds(player)

    const matches = await Promise.all(matchIds.map(matchId => getMatch(shard, matchId)))
    const defaultStats = {
      count: 0,
      kills: 0,
      deaths: 0,
      wins: 0,
      top10: 0,
    }

    const stats = matches.reduce((result, match) => {
      const { createdAt } = match.data.attributes
      const playerStats = getPlayerStatsInMatch(match, playerName)

      if (playerStats && (!afterAt || moment(createdAt).isAfter(afterAt))) {
        const { kills, deaths, wins, top10, count } = result

        return {
          count: count + 1,
          kills: kills + playerStats.kills,
          deaths: deaths + (playerStats.deathType === 'alive' ? 0 : 1),
          wins: wins + (playerStats.winPlace === 1 ? 1 : 0),
          top10: top10 + (playerStats.winPlace <= 10 ? 1 : 0),
        }
      }

      return result
    }, defaultStats)

    return res.send(stats)
  })
}

module.exports = setupServer
