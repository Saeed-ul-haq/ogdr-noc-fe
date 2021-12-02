import React from 'react'
import image1 from './images/Map0.png'

export const mapDetailsHelper = {
  userImg: image1,
  name: 'Map 1',
  title: 'Oman Map',
  description: (
    <>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Lorem ipsum dolor
        sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
        ut labore et dolore magna aliqua. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
        et dolore magna aliqua.
      </p>
    </>
  ),
  plansAndPricing: (
    <>
      <h3>{`Plans & Pricing Conditions`}</h3>
      <ul style={{ listStyle: 'disc', margin: '10px 0 0 30px' }}>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
      </ul>
    </>
  ),
  support: (
    <>
      <h3>{`Support Conditions`}</h3>
      <ul style={{ listStyle: 'disc', margin: '10px 0 0 30px' }}>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
        <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit</li>
      </ul>
    </>
  ),
  layers: [
    { label: 'Buildings' },
    { label: 'Schools' },
    { label: 'Pipelines' },
  ],
}
