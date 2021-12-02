/* eslint-disable react/react-in-jsx-scope */
import { SVGIcon } from 'react-md'
import React from 'react'

export const getActionIcons = label => {
  switch (label) {
    case 'open':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z"
          />
        </SVGIcon>
      )
    case 'create_map':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"
          />
        </SVGIcon>
      )
    case 'add_to_map':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M9,3L3.36,4.9C3.16,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.6,21 3.66,20.97L9,18.9L13.16,20.36C13.06,19.92 13,19.46 13,19C13,18.77 13,18.54 13.04,18.3L9,16.9V5L15,7.1V14.56C16.07,13.6 17.47,13 19,13C19.7,13 20.37,13.13 21,13.36V3.5A0.5,0.5 0 0,0 20.5,3H20.34L15,5.1L9,3M18,15V18H15V20H18V23H20V20H23V18H20V15H18Z"
          />
        </SVGIcon>
      )
    case 'add_favort':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
          />
        </SVGIcon>
      )

    case 'save_to_storage':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M14,13V17H10V13H7L12,8L17,13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z"
          />
        </SVGIcon>
      )
    case 'delete':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"
          />
        </SVGIcon>
      )
    case 'move_to':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
          />
        </SVGIcon>
      )
    case 'edit':
      return (
        <SVGIcon>
          <path
            fill="rgba(0, 0, 0, 0.54)"
            d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z"
          />
        </SVGIcon>
      )
  }
}

export const getFileIcon = dataType => {
  switch (dataType) {
    case 'map':
      return (
        <SVGIcon>
          <path
            fill="#fff"
            d="M15,19L9,16.89V5L15,7.11M20.5,3C20.44,3 20.39,3 20.34,3L15,5.1L9,3L3.36,4.9C3.15,4.97 3,5.15 3,5.38V20.5A0.5,0.5 0 0,0 3.5,21C3.55,21 3.61,21 3.66,20.97L9,18.9L15,21L20.64,19.1C20.85,19 21,18.85 21,18.62V3.5A0.5,0.5 0 0,0 20.5,3Z"
          />
        </SVGIcon>
      )
    case 'dataset':
      return (
        <SVGIcon>
          <path
            fill="#fff"
            d="M2,2H8V4H16V2H22V8H20V16H22V22H16V20H8V22H2V16H4V8H2V2M16,8V6H8V8H6V16H8V18H16V16H18V8H16M4,4V6H6V4H4M18,4V6H20V4H18M4,18V20H6V18H4M18,18V20H20V18H18Z"
          />
        </SVGIcon>
      )
    case 'folder':
      return (
        <SVGIcon>
          <path
            fill="#8c949c"
            d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
          />
        </SVGIcon>
      )
    case 'zip':
      return (
        <SVGIcon>
          <path
            fill="#fff"
            d="M11,21H3V13H5V17.59L17.59,5H13V3H21V11H19V6.41L6.41,19H11V21Z"
          />
        </SVGIcon>
      )
  }
}

export const gradients = [
  'linear-gradient(-45deg, #ff9a9e, #fad0c4)',
  'linear-gradient(-45deg, #B7F8DB, #50A7C2)',
  'linear-gradient(-45deg, #a1c4fd, #c2e9fb)',
  'linear-gradient(-45deg, #cfd9df, #e2ebf0)',
  'linear-gradient(-45deg, #667eea, #764ba2)',
  'linear-gradient(-45deg, #ffecd2, #fcb69f)',
  'linear-gradient(-45deg, #fdfcfb, #e2d1c3)',
  'linear-gradient(-45deg, #89f7fe, #66a6ff)',
  'linear-gradient(-45deg, #48c6ef, #6f86d6)',
  'linear-gradient(-45deg, #feada6, #f5efef)',
  'linear-gradient(-45deg, #13547a, #80d0c7)',
  'linear-gradient(-45deg, #ff758c, #ff7eb3)',
  'linear-gradient(-45deg, #96deda, #50c9c3)',
  'linear-gradient(-45deg, #ff9a9e, #fecfef)',
]

export const mapImages = [
  '/static/images/map_1.png',
  '/static/images/map_2.png',
  '/static/images/map_3.png',
  '/static/images/map_4.png',
  '/static/images/map_5.png',
]
