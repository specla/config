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
   * Get configuration from dot string
   * @param  {String} key
   * @return {Mixed}
   */
  get (key) {
    if (!key) {
      return this._config
    }

    if (this._flattenConfig[key]) {
      return this._flattenConfig[key]
    }

    try {
      return dot.get(this._config, key)
    } catch (err) {
      return undefined
    }
  }

  /**
   * Set value for a given key
   * @param {String} key
   * @param {Mixed} value
   * @return {Mixed}
   */
  set (key, value) {
    this._flattenConfig[key] = value
    return dot.set(this._config, key, value)
  }

  /**
   * Merge a new config with the current config
   * @param  {Object} config
   */
  merge (config) {
    if (config instanceof Config) {
      config = this._flattenConfig
    }

    this._parse(Object.assign({}, this._flattenConfig, config))
  }
}
