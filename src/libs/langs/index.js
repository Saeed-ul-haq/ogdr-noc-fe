// import React from 'react'
// import { Provider } from '@target-energysolutions/tiny-i18n'
// import PropTypes from 'prop-types'

// import i18n from 'i18n-js'
// import en from 'libs/langs/en'
// import tr from 'libs/langs/tr'
// import zh from 'libs/langs/zh'
// import fr from 'libs/langs/fr'
// import ar from 'libs/langs/ar'
// import { getLocale } from 'libs/langs/get-locale'

// i18n.translations.en = en
// i18n.translations.tr = tr
// i18n.translations.zh = zh
// i18n.translations.fr = fr
// i18n.translations.ar = ar
// i18n.defaultLocale = 'en'
// i18n.locale = getLocale()

// const locales = {
//   en: () => import('libs/langs/en'),
//   tr: () => import('libs/langs/tr'),
//   zh: () => import('libs/langs/zh'),
//   fr: () => import('libs/langs/fr'),
//   ar: () => import('libs/langs/ar'),
// }

// export async function changeLang(locale) {
//   if (!i18n.translations[locale]) {
//     i18n.translations[locale] = (await locales[locale]()).default
//   }
//   i18n.locale = locale
// }

// function defaultLang() {
//   const lang = localStorage.getItem('language')
//   if (lang === 'zh') {
//     return 'zh-CN'
//   }
//   if (lang === 'en') {
//     return 'en-US'
//   }
//   return lang || 'en-US'
// }

// const ctx = React.createContext({
//   change: () => 0,
//   lang: 'en-US',
// })

// export function LangProvider({ children }) {
//   const [lang, changeLange] = React.useState(defaultLang())
//   const change = React.useCallback(lang => {
//     localStorage.setItem('language', lang)
//     changeLange(lang)
//   }, [])

//   return (
//     <ctx.Provider
//       value={{
//         lang: lang,
//         change,
//       }}
//     >
//       <Provider language={lang} i18nServiceEndpoint={PRODUCT_APP_URL_LANG}>
//         {children}
//       </Provider>
//     </ctx.Provider>
//   )
// }

// LangProvider.propTypes = {
//   children: PropTypes.node,
// }

import i18n from 'i18n-js'
import React, { useState, useCallback } from 'react'
import { Provider } from '@target-energysolutions/tiny-i18n'
import PropTypes from 'prop-types'
import en from 'libs/langs/en'
import tr from 'libs/langs/tr'
import zh from 'libs/langs/zh'
import fr from 'libs/langs/fr'
import ar from 'libs/langs/ar'
// import { getLocale } from '../utils/get-locale'
import { getLocale } from 'libs/langs/get-locale'

i18n.translations.en = en
i18n.translations.tr = tr
i18n.translations.zh = zh
i18n.translations.fr = fr
i18n.translations.ar = ar
i18n.defaultLocale = 'en'
i18n.locale = getLocale()

export const ctx = React.createContext({
  change: () => {},
  lang: 'en-US',
})
const locales = {
  'en-US': () => ({ default: en }),
  'zh-CN': () => import('libs/langs/zh'),
  tr: () => import('libs/langs/tr'),
  zh: () => import('libs/langs/zh'),
  fr: () => import('libs/langs/fr'),
  ar: () => import('libs/langs/ar'),
}

export const changeLang = async locale => {
  const langs = Object.keys(locales).includes(locale)
    ? (await locales[locale]()).default
    : locales['en-US']
  if (!i18n.translations[locale]) {
    i18n.translations[locale] = langs
  } else {
    Object.assign(i18n.translations[locale], langs)
  }
  i18n.locale = locale
}
export const getLangCode = lang => {
  switch (lang) {
    case 'zh':
    case 'zh-CN':
    case 'zh-TW':
      return 'zh-CN'
    case 'en':
    case 'en-US':
      return 'en-US'
    default:
      return 'en-US'
  }
}
const defaultLang = () => {
  const lang = localStorage.getItem('language')
  return getLangCode(lang)
}

export const LangProvider = ({ children }) => {
  const [lang, changeLange] = useState(defaultLang())
  const change = useCallback(lang => {
    localStorage.setItem('language', lang)
    changeLange(lang)
  }, [])
  return (
    <ctx.Provider
      value={{
        lang: lang,
        change,
      }}
    >
      <Provider language={lang} i18nServiceEndpoint={PRODUCT_APP_URL_LANG}>
        {children}
      </Provider>
    </ctx.Provider>
  )
}
LangProvider.propTypes = {
  children: PropTypes.element,
}
