/* eslint-env jest */
import Config from 'Config'

test('Should create a config tree structure and a flatten structure', () => {
  const config = new Config({
    'hello.key': true,
    hello: {
      world: 325
    },
    array: ['test']
  })
  expect(config._config).toMatchSnapshot()
  expect(config._flattenConfig).toMatchSnapshot()
})

test('Should throw error if invalid arguments are given to the constructor', () => {
  expect(() => new Config('test')).toThrowErrorMatchingSnapshot()
  expect(() => new Config([])).toThrowErrorMatchingSnapshot()
})

test('Should access config property with dot notation', () => {
  const config = new Config({
    'key.value': true
  })

  expect(config._config.key.value).toBe(true)
  expect(config._flattenConfig['key.value']).toBe(true)
  expect(config.get('key.value')).toBe(true)
})

test('Should return object with all config properties', () => {
  const config = new Config({
    'key.value': true,
    hello: 'world',
    'func': config => 'hello ' + config.get('hello'),
    key: {
      'func': config => config.get('hello'),
      testing: false
    }
  })

  expect(config.get()).toMatchSnapshot()
  expect(config.get().key.value).toBe(true)
  expect(config.get('key')).toMatchSnapshot()
})

test(`Should return undefined if a config property isn't found`, () => {
  const config = new Config()
  expect(config.get('hello.world')).toBe(undefined)
})

test('Should mutate a config property with dot notation', () => {
  const config = new Config({
    'key.value': false
  })

  config.set('key.value', true)
  config.set('key', {
    'test.newValue': true
  })

  expect(config._config.key.value).toBe(true)
  expect(config._flattenConfig['key.value']).toBe(true)
  expect(config.get('key.value')).toBe(true)
  expect(config.get('key.test.newValue')).toBe(true)
})

test('Should set override object with new object', () => {
  const config = new Config({
    'key.value': false
  })

  config.set('key', {
    value: true,
    hello: 'world'
  })

  expect(config._config.key.hello).toBe('world')
  expect(config._flattenConfig['key.hello']).toBe('world')
  expect(config.get('key.hello')).toBe('world')
  expect(config._config.key.value).toBe(true)
  expect(config._flattenConfig['key.value']).toBe(true)
  expect(config.get('key.value')).toBe(true)
})

test('Should merge existing config with a new object', () => {
  const config = new Config({ 'test.key': true })

  config.merge({
    'test.newKey': 325,
    hello: 'world'
  })

  expect(config._config).toMatchSnapshot()
  expect(config._flattenConfig).toMatchSnapshot()
})

test('Should delete a config property', () => {
  const config = new Config({
    'my.config': true,
    'some.key': true,
    'some.test': true,
    'someOtherKey': true,
    hello: 'world'
  })

  config.unset('my.config')
  config.unset('some')
  expect(config._config).toMatchSnapshot()
})

test('Should merge existing config with a new config instance', () => {
  const config = new Config({ 'test.key': true })

  const instance = config.merge(new Config({
    'test.newKey': 325,
    hello: 'world'
  }))

  expect(config._config).toMatchSnapshot()
  expect(config._flattenConfig).toMatchSnapshot()
  expect(instance).toBe(config)
})

test('Should invoke the functional property and parse it the config as an argument', () => {
  const config = new Config({
    'test.key': 'test',
    'test.func.prop': config => config.get('test.key') + ' value'
  })

  expect(config.get('test.func.prop')).toBe('test value')
})
