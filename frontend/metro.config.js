const { getDefaultConfig } = require('expo/metro-config')

// NativeWind 2 (modo compileOnly via babel) não exige alterações no Metro.
const config = getDefaultConfig(__dirname)

module.exports = config