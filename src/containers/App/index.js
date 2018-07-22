import React, { PureComponent } from 'react'
import { hot } from 'react-hot-loader'
import queryString from 'query-string'
import api from 'utils/api'
import Field from 'components/Field/Field'

import styles from './styles.css'

class App extends PureComponent {
  static propTypes = {}

  constructor(props, ...args) {
    super(props, ...args)

    const { playerName, shard } = queryString.parse(window.location.search)
    const afterAt = new Date()

    this.state = {
      playerName,
      shard,
      afterAt: afterAt.toISOString(),
      stats: {
        count: 0,
        kills: 0,
        deaths: 0,
        wins: 0,
        top10: 0,
      },
    }
  }

  componentDidMount() {
    const { playerName, shard } = this.state

    if (playerName && shard) {
      this.handleUpdateStats()
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }

  handleUpdateStats = async () => {
    const { playerName, shard, afterAt } = this.state

    try {
      const stats = await api(`stats/${playerName}`, shard, {
        method: 'GET',
        params: {
          afterAt,
        },
      })

      this.setState({
        stats,
      })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error)
    }

    this.timeout = setTimeout(this.handleUpdateStats, 10000)
  }

  render() {
    const { stats } = this.state

    if (!stats) {
      return null
    }

    return (
      <div className={styles.root}>
        <div className={styles.stats}>
          <Field label='Matches' color='rgb(116, 185, 255)'>
            {stats.count}
          </Field>
          <Field label='Kills' color='rgb(199, 147, 255)'>
            <span>{stats.kills}</span>
            <span>
              ({stats.count > 0
                ? (stats.kills / stats.deaths).toFixed(1)
                : 'n/a'}{' '}
              KD)
            </span>
          </Field>
          <Field label='Wins' color='rgb(234, 147, 55)'>
            {stats.wins}
          </Field>
          <Field label='Top 10' color='rgb(116, 185, 255)'>
            {stats.top10}
          </Field>
        </div>
      </div>
    )
  }
}

export default hot(module)(App)
