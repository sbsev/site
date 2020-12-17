export const colors = {
  blue: `#003089`,
  darkBlue: `#003056`,
  darkerBlue: `#061725`,
  lightBlue: `#00a1ff`,
  lighterBlue: `#06c5ff`,

  green: `#89ba17`,
  darkGreen: `#4d8711`,
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
    linkColor: colors.darkBlue,
    hoverColor: colors.lightBlue,
    bodyBg: colors.lightestGray,
    accentBg: `white`,
    buttonBg: colors.green,
    transparentBg: `rgba(255, 255, 255, 0.6)`,
    borderColor: colors.lightBlue,
    shadowColor: `gray`,
    headingColor: colors.darkGreen,
    headerBg: colors.blue,
    headerColor: `white`,
  },
  dark: {
    textColor: `white`,
    linkColor: colors.lightBlue,
    hoverColor: `#89ba17`,
    bodyBg: colors.darkerBlue,
    accentBg: `#001d31`,
    buttonBg: colors.darkGreen,
    transparentBg: `rgba(6, 23, 37, 0.6)`,
    borderColor: `orange`,
    shadowColor: `black`,
    headingColor: colors.lightGreen,
    headerBg: colors.darkerBlue,
    headerColor: colors.lightBlue,
  },
}
