export const colors = {
  blue: `#0b4abf`,
  darkBlue: `#003056`,
  darkerBlue: `#061725`,
  lightBlue: `#00a1ff`,
  lighterBlue: `#06c5ff`,

  green: `#89ba17`,
  darkGreen: `#4d8711`,
  darkerGreen: `#3c660f`,
  lightGreen: `#95d50f`,
  lighterGreen: `#caef76`,

  yellow: `#f9ff00`,
  darkYellow: `#ffca35`,
  lightYellow: `#fbff6c`,

  orange: `#e8ab00`,
  lightOrange: `#ffca29`,

  gray: `#464849`,
  lightGray: `#d8d8d8`,
  lighterGray: `#efefef`,
  lightestGray: `#f6f6f6`,
  darkGray: `#2a2c30`,
}

export const modeColors = {
  light: {
    textColor: `black`,
    linkColor: colors.blue,
    hoverColor: colors.lightBlue,
    bodyBg: colors.lightestGray,
    accentBg: `white`,
    lightBg: colors.lightestGray,
    buttonBg: colors.green,
    borderColor: colors.lightBlue,
    headingColor: colors.lightBlue,
    headerBg: colors.darkBlue,
    headerColor: `white`,
    footerBg: colors.darkBlue,
    invert: 0,
  },
  dark: {
    textColor: `white`,
    linkColor: colors.lightBlue,
    hoverColor: colors.green,
    bodyBg: colors.darkerBlue,
    accentBg: `black`,
    lightBg: colors.darkGray,
    buttonBg: colors.darkGreen,
    borderColor: colors.darkGreen,
    headingColor: colors.lightGreen,
    headerBg: colors.darkerBlue,
    headerColor: colors.lightBlue,
    footerBg: `black`,
    invert: 1,
  },
}
