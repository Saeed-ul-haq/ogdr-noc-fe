import React from 'react'
import PropTypes from 'prop-types'
import { SVGIcon } from 'react-md'

import './styles.scss'

const Suggestions = (props) => {
  const { suggestions = [], onSuggestionClick } = props
  return (
    <div className="suggestions">
      {suggestions.map(suggestion => {
        const { text = '' } = suggestion
        return (
          <div className="suggestion-item" key={text} onClick={() => {
            onSuggestionClick && onSuggestionClick({ text })
          }}>
            <SVGIcon size={16}>
              <path
                fill="#ddd"
                d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z"
              />
            </SVGIcon>{' '}
            <span>{text}</span>
          </div>
        )
      })}
    </div>
  )
}

export default Suggestions
Suggestions.propTypes = {
  onSuggestionClick: PropTypes.func,
  suggestions: PropTypes.array,
}
