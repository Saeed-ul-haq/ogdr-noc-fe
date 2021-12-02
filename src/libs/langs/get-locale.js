export const getLocale = () => {
  return localStorage.getItem('language') || 'en'
}
