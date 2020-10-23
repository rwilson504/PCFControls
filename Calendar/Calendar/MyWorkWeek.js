import PropTypes from 'prop-types'
import React from 'react'

import Week from 'react-big-calendar/lib/Week'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'

function workWeekRange(date, options) {
  return Week.range(date, options).filter(    
    d => CustomWorkWeek.includedDays.indexOf(d.getDay()) > -1
  )
}

export class CustomWorkWeek extends React.Component {
  render() {
    let { date, ...props } = this.props
    let range = workWeekRange(date, this.props)

    return <TimeGrid {...props} range={range} eventOffset={15} />
  }
}

CustomWorkWeek.propTypes = {
  date: PropTypes.instanceOf(Date).isRequired,  
}

CustomWorkWeek.includedDays = [];

CustomWorkWeek.defaultProps = TimeGrid.defaultProps

CustomWorkWeek.range = workWeekRange

CustomWorkWeek.navigate = Week.navigate

CustomWorkWeek.title = (date, { localizer }) => {
  let [start, ...rest] = workWeekRange(date, { localizer })
  return localizer.format({ start, end: rest.pop() }, 'dayRangeHeaderFormat')
}

export default CustomWorkWeek