import React, { useState, useMemo } from 'react'
import Toolbar from 'components/toolbar'
import { SVGIcon } from 'react-md'
import { message, Empty } from 'antd'
import MapCard from 'components/map-card'
import { deleteEntity } from 'libs/utils/gis-apis'
import PropTypes from 'prop-types'
import { sortBy } from 'lodash'
import { useSelector, useDispatch } from 'react-redux'
import * as act from 'modules/app/actions'
import '@target-energysolutions/gis-map/styles.css'

import DetailsBar from 'components/common/right-side-bar/action-bar'
import { getAccessToken } from 'libs/utils/helpers'

import i18n from 'i18n-js'
import l from 'libs/langs/keys'

import './styles.scss'

const Maps = props => {
  const dispatch = useDispatch()
  const maps = useSelector(({ app }) => {
    return sortBy(app.allMaps || [], 'createdDate')
  })
  const activeMapId = useSelector(({ app }) => {
    return app.activeMap.id
  })

  const [mapDetailsVisible, setMapDetailsVisible] = useState(false)
  const [focusedMap, setFocusedMap] = useState(undefined)

  const toggleMapDetailBar = map => {
    if (map && mapDetailsVisible) {
      setFocusedMap(map)
    } else {
      setMapDetailsVisible(!mapDetailsVisible)
      setFocusedMap(map)
    }
  }

  const getMapImage = (map, count) => {
    if (map.label.toLowerCase().includes('ogdr')) {
      return require(`./images/ogdr.png`)
    }
    return map.icon
      ? map.icon + `?access_token=${getAccessToken()}`
      : require(`./images/Map${count}.png`)
  }

  const removeMapFromState = id => {
    let filteredMaps = maps.filter(map => map.id !== id)
    dispatch(act.setAllMaps(filteredMaps))
  }

  const handleMapDelete = id => {
    const delKey = 'delete'
    message.loading({ content: 'Deleting Map...', key: delKey })
    deleteEntity({ entityName: 'entity/Map', id: id })
      .then(async response => {
        const { message: resMsg, success } = response
        if (success) {
          message.success({
            content: 'Map Deleted Sucessfully',
            key: delKey,
          })
          removeMapFromState(id)
        } else {
          message.warning({ content: resMsg || 'Map Not Deleted' })
        }
      })
      .catch(e => {
        message.error({
          content: e.message || 'Something Went Wrong',
          key: delKey,
        })
      })
  }

  const renderMapsList = () => {
    const _maps = maps.map(m => {
      return {
        ...m,
        layers: (m.layers || [{ label: 'No Layers' }]).map(l => l.label),
      }
    })
    let newMapsList = [..._maps]

    return (newMapsList || []).map((map, index) => {
      const count = (index + 1) % 5
      return (
        <MapCard
          {...map}
          activeMap={map.id === activeMapId}
          type={map._type}
          mapTitle={map.name}
          creationDate={map.createdDate}
          mapImage={getMapImage(map, count)}
          key={index}
          className={'md-cell md-cell--3 md-map'}
          onViewDetails={() => toggleMapDetailBar(map)}
          history={props.history}
          onDelete={handleMapDelete}
        />
      )
    })
  }

  const toolbarRightActions = useMemo(() => {
    return [
      {
        key: 'createMap',
        svg: (
          <SVGIcon>
            <path
              fill="#fff"
              d="M15,19l-6-2.11V5l6,2.11 M20.5,3c-0.06,0-0.11,0-0.16,0L15,5.1L9,3L3.36,4.9C3.15,4.97,3,5.15,3,5.38V20.5
           C3,20.776,3.224,21,3.5,21c0.05,0,0.11,0,0.16-0.03L9,18.9l6,2.1l5.64-1.9C20.85,19,21,18.85,21,18.62V3.5
           C21,3.224,20.776,3,20.5,3z"
            />
          </SVGIcon>
        ),
        label: `${i18n.t(l.create_map)}`,
        primary: true,
        swapTheming: true,
        onClick: () => {
          props.history && props.history.push('/maps/add')
        },
      },
    ]
  }, [])
  return (
    <>
      <Toolbar {...props} rightActions={toolbarRightActions} />
      <div className="maps">
        {mapDetailsVisible && (
          <DetailsBar
            mapTitle={(focusedMap && focusedMap.name) || ''}
            creationDate={(focusedMap && focusedMap.createdDate) || ''}
            layersList={(focusedMap && focusedMap.layers) || []}
            hideDetails={() => toggleMapDetailBar()}
          />
        )}
        {maps.length > 0 ? (
          <div className="cards-wrapper">{renderMapsList()}</div>
        ) : (
          <div className="empty">
            <Empty description={`${i18n.t(l.fetching_maps)}`} />
          </div>
        )}
      </div>
    </>
  )
}

Maps.propTypes = {
  history: PropTypes.object,
  loadingMaps: PropTypes.bool,
}
export default Maps
