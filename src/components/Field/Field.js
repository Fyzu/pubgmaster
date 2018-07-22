import React, { PureComponent, Children } from 'react'
import { string, node } from 'prop-types'

import styles from './Field.css'

export default class Field extends PureComponent {
  static propTypes = {
    label: string,
    children: node,
    color: string,
  }

  static defaultProps = {
    color: 'rgb(116, 185, 255)',
  }

  renderValue = value => <div className={styles.value}>{value}</div>

  render() {
    const { label, children, color } = this.props

    return (
      <div className={styles.root}>
        <div className={styles.label} style={{ color }}>
          {label}
        </div>
        {Children.map(children, this.renderValue, this)}
      </div>
    )
  }
}
