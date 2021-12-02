import React, { Component } from 'react'
import { filter as filterHOC } from 'libs/hoc/filter'
import { defaultColors } from 'libs/consts'
import PropTypes from 'prop-types'
import { getPublicUrl } from 'libs/hoc/sharedFunction.js'
import { getAccessToken } from 'libs/utils/helpers.js'

const theme = WrappedComponent => {
  @filterHOC('trove')
  class ThemeHOC extends Component {
    state = {
      loading: true,
    }

    componentDidMount () {
      const { mutations, updateFilter } = this.props

      const token = getAccessToken()
      if (token) {
        mutations.getAllThemes().then(res => {
          const activeTheme = res.data.data.find(el => el.active)
          let activeColor = ''
          if (activeTheme) {
            activeColor = defaultColors.find(
              el => el.id === activeTheme.linkColor,
            )
          }
          updateFilter('updateThemes', {
            id: activeColor && activeColor.id,
            color: activeColor && activeColor.color,
            favicon: activeTheme.favicon,
            logoImage: activeTheme.logoImage,
            name: activeTheme.name,
            pageTitle: activeTheme.pageTitle,
            description: activeTheme.description,
          })

          this.setState({ loading: false })
        })
      }
    }

    componentDidUpdate (prevProps) {
      const {
        filters: { updateThemes },
      } = this.props
      if (
        prevProps.filters.updateThemes &&
        prevProps.filters.updateThemes.favicon
      ) {
        if (updateThemes.favicon !== prevProps.filters.updateThemes.favicon) {
          const favicon = document.getElementById('favicon')
          favicon.href =
            updateThemes && updateThemes.favicon
              ? getPublicUrl(updateThemes.favicon)
              : '/static/favicon.png'
        }
      }

      if (
        prevProps.filters.updateThemes &&
        prevProps.filters.updateThemes.title
      ) {
        if (updateThemes.title !== prevProps.filters.updateThemes.title) {
          document.title =
            updateThemes && updateThemes.pageTitle
              ? updateThemes.pageTitle
              : 'Trove'
        }
      }

      if (
        prevProps.filters.updateThemes &&
        prevProps.filters.updateThemes.description
      ) {
        if (
          updateThemes.description !==
          prevProps.filters.updateThemes.description
        ) {
          const metaDescription = document.getElementById('meta-description')
          metaDescription.content =
            updateThemes && updateThemes.description
              ? updateThemes.description
              : 'Trove'
        }
      }
    }

    render () {
      const {
        filters: { updateThemes },
      } = this.props
      document.title =
        updateThemes && updateThemes.pageTitle
          ? updateThemes.pageTitle
          : 'Trove'
      const metaDescription = document.getElementById('meta-description')
      metaDescription.content =
        updateThemes && updateThemes.description
          ? updateThemes.description
          : 'Trove'
      const favicon = document.getElementById('favicon')
      favicon.href = updateThemes && getPublicUrl(updateThemes.favicon)
      return <WrappedComponent {...this.props} />
    }
  }
  ThemeHOC.propTypes = {
    mutations: PropTypes.object,
    filters: PropTypes.object,
    updateFilter: PropTypes.func,
  }
  return ThemeHOC
}

export default theme
