import dot from '@specla/dot-string'

export default class Config {
  /**
   * Create a new configuration instance
   * @param  {Object} config
   * @return {Config}
   */
  constructor (config = {}) {
    if (typeof config !== 'object' || Array.isArray(config)) {
      throw new Error(`Config does only accept an object as the first argument`)
    }

    this._flattenConfig = {}
    this._config = {}
    this._parse(config)
  }

  /**
   * Parse the config object and create a flatten config
   * @param  {Object} config
   * @return {Object}
   */
  _parse (config) {
    this._flatten(config)

    for (const key in this._flattenConfig) {
      this.set(key, this._flattenConfig[key])
    }
  }

  /**
   * Flatten objects into an object of dot strings
   * @param  {Mixed} config
   * @param  {Array} context
   * @return {Mixed}
   */
  _flatten (config, context = []) {
    if (!Array.isArray(config) && typeof config === 'object') {
      return this._flattenObject(config, context)
    }

    return (this._flattenConfig[context.join('.')] = config)
  }

  /**
   * Flatten object
   * @param  {Mixed} config
   * @param  {Array} context
   */
  _flattenObject (config, context) {
    for (const key in config) {
      this._flatten(config[key], context.concat(key))
    }
  }

  /**
   * Loop through the config object an invoke functional properties
   * @param  {Object} config
   * @return {Object}
   */
  _parseConfig (config) {
    const copyConfig = Object.assign({}, config)

    for (const key in copyConfig) {
      if (typeof copyConfig[key] === 'function') {
        copyConfig[key] = copyConfig[key](this)
      }

      if (!Array.isArray(copyConfig[key]) && typeof copyConfig[key] === 'object') {
        copyConfig[key] = this._parseConfig(copyConfig[key])
      }
    }

    return copyConfig
  }

  /**
   * Get config property from dot notation
   * If the property is a function then invoke it with the config object
   * as the first argument
   * @param  {String} key
   * @return {Mixed}
   */
  get (key) {
    let value

    if (!key) {
      value = this._parseConfig(this._config)
    }

    if (!value && this._flattenConfig[key]) {
      value = this._flattenConfig[key]
    }

    if (!value) {
      try {
        value = dot.get(this._config, key)
      } catch (err) {}
    }

    if (!Array.isArray(value) && typeof value === 'object') {
      return this._parseConfig(value)
    }

    if (typeof value === 'function') {
      return value(this)
    }

    return value
  }

  /**
   * Set value for a given key in dot notation
   * @param {String} key
   * @param {Mixed} value
   * @return {Mixed}
   */
  set (key, value) {
    if (typeof value !== 'object' || Array.isArray(value)) {
      this._flattenConfig[key] = value
      return dot.set(this._config, key, value)
    }

    for (const prop in value) {
      this.set(`${key}.${prop}`, value[prop])
    }
  }

  /**
   * Delete a config property with dot notation
   * @param {String} key
   */
  unset (key) {
    if (!key.includes('.')) {
      key += '.'
    }

    for (const prop in this._flattenConfig) {
      if (prop.includes(`${key}`)) {
        delete this._flattenConfig[prop]
      }
    }

    this._config = {}
    this._parse(this._flattenConfig)
  }

  /**
   * Merge a new config with the current config
   * @param  {Object} config
   * @return {Config}
   */
  merge (config) {
    if (config instanceof Config) {
      config = this._flattenConfig
    }

    this._parse(Object.assign({}, this._flattenConfig, config))

    return this
  }
}
