import BuildingsImg from './images/buildings.png'
import SchoolsImg from './images/schools.png'
import HospitalsImg from './images/hospitals.png'
import LinesImg from './images/lines.png'
import AllImg from './images/all.png'
import i18n from 'i18n-js'
import l from 'libs/langs/keys'
export const infsList = [
  {
    name: i18n.t(l.buildings),
    createdDate: '2019-05-17T13:59:22',
    image: BuildingsImg,
    id: 'buildings',
    _type: 'intrastructure',
    layers: ['Residential', 'Business', 'Industrial'],
    description: i18n.t(l.inf_description),
  },
  {
    name: i18n.t(l.schools),
    layers: ['Faith', 'Academies', 'Private'],
    createdDate: '2019-05-17T13:59:22',
    image: SchoolsImg,
    id: 'schools',
    _type: 'intrastructure',
    description: i18n.t(l.inf_description),
  },
  {
    name: i18n.t(l.hospitals),

    layers: ['Psychiatric', 'Rural', 'Urban'],
    createdDate: '2019-05-17T13:59:22',
    image: HospitalsImg,
    id: 'hospitals',
    _type: 'intrastructure',
    description: i18n.t(l.inf_description),
  },
  {
    name: i18n.t(l.pipelines),

    layers: ['Water', 'Gas', 'Petroleum'],
    createdDate: '2019-05-17T13:59:22',
    image: LinesImg,
    id: 'pipelines',
    _type: 'intrastructure',
    description: i18n.t(l.inf_description),
  },
  {
    name: i18n.t(l.intrastructure),
    layers: ['Builings', 'Schools', 'Hospitals', 'Pipelines'],
    createdDate: '2019-05-17T13:59:22',
    image: AllImg,
    id: 'all',
    _type: 'intrastructure',
    description: i18n.t(l.inf_description),
  },
]
