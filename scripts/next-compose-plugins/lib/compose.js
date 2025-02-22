/* eslint-disable @typescript-eslint/no-var-requires */
'use strict'

Object.defineProperty(exports, '__esModule', {
  value: true
})
exports.composePlugins = exports.parsePluginConfig = void 0

let _phases = require('./phases')

let _optional = require('./optional')
// eslint-disable-next-line no-var
function _objectSpread(target) { for (let i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; let ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable })) } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]) }) } return target }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }) } else { obj[key] = value } return obj }

/**
 * Plugins can be added to `withPlugins` in multiple ways.
 * All possibilities are handled here and returned in a standardized way.
 *
 * @param {array|function} plugin - plugin configuration
 */
const parsePluginConfig = plugin => {
  // it can only depend on phases if it has specific configuration
  if (plugin instanceof Array) {
    // if the plugin array contains 3 values, it always depends on phases
    // [plugin: function, config: object, phases: array]
    if (plugin.length > 2) {
      return {
        pluginFunction: plugin[0],
        pluginConfig: plugin[1],
        phases: plugin[2]
      }
    } // if the plugin array contains 2 values and the second one is an array, it depends on phases
    // [plugin: function, phases: array]


    if (plugin.length > 1 && plugin[1] instanceof Array) {
      return {
        pluginFunction: plugin[0],
        pluginConfig: {},
        phases: plugin[1]
      }
    } // plugin does not contain phase specific config but could have plugin configuration
    // [plugin: function, config?: object]


    return {
      pluginFunction: plugin[0],
      pluginConfig: plugin[1] || {},
      phases: null
    }
  }

  return {
    pluginFunction: plugin,
    pluginConfig: {},
    phases: null
  }
}
/**
 * Composes all plugins
 *
 * @param {string} phase - current phase
 * @param {array} plugins - all plugins
 * @param {object} initialConfig - initial configuration
 */


exports.parsePluginConfig = parsePluginConfig

const composePlugins = (phase, plugins, initialConfig) => {
  const nextComposePluginsParam = {
    nextComposePlugins: true,
    phase
  }
  let config = (0, _phases.mergePhaseConfiguration)(phase, _objectSpread({}, initialConfig))
  plugins.forEach(plugin => {
    const _parsePluginConfig = parsePluginConfig(plugin)
    const pluginFunction = _parsePluginConfig.pluginFunction
    const pluginConfig = _parsePluginConfig.pluginConfig
    const phases = _parsePluginConfig.phases // check if the plugin should not get executed in the current phase


    if (phases !== null) {
      if (!(0, _phases.isInCurrentPhase)(phase, phases)) {
        return
      }
    }

    let resolvedPlugin = pluginFunction

    if ((0, _optional.isOptional)(pluginFunction)) {
      resolvedPlugin = (0, _optional.resolveOptionalPlugin)(pluginFunction)
    }

    const mergedPluginConfig = (0, _phases.mergePhaseConfiguration)(phase, pluginConfig)
    let updatedConfig

    if (typeof resolvedPlugin === 'function') {
      updatedConfig = resolvedPlugin(_objectSpread({}, config, mergedPluginConfig), nextComposePluginsParam)
    } else if (typeof resolvedPlugin === 'object') {
      updatedConfig = resolvedPlugin
    } else {
      throw new Error('Incompatible plugin: plugin needs to export either a function or an object!')
    } // check if the plugin itself has defined in phases it should run
    // and the user did not overwrite it


    if (phases === null && updatedConfig.phases) {
      if (!(0, _phases.isInCurrentPhase)(phase, updatedConfig.phases)) {
        return
      }
    } // delete plugin specific phases array so it doesn't propagate to the next plugin


    if (updatedConfig.phases) {
      delete updatedConfig.phases
    } // merge config back to the main one


    config = _objectSpread({}, config, updatedConfig)
  })
  return config
}

exports.composePlugins = composePlugins