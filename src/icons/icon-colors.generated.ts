/** Don't edit manually only color names. Generated by script: ./tools/icons/generate-colors.ts */
export const iconColors = {
  darkgray: {day: '#ada9a6ff', night: '#6f737aff'},
  pink: {day: '#ff8f96ff', night: '#b96066ff'},
  seawave: {day: '#62c0c6ff', night: '#468286ff'},
  orchid: {day: '#e096d0ff', night: '#916187ff'},
  steelblue: {day: '#498ea5ff', night: '#57a8c2ff'},
  bluebell: {day: '#9d9dc4ff', night: '#6767a3ff'},
  ceil: {day: '#88aecfff', night: '#537695ff'},
  green: {day: '#5ebd8cff', night: '#468c68ff'},
  darksalmon: {day: '#f09a75ff', night: '#ab6f55ff'}
} as const;
export type IconColor = keyof typeof iconColors;