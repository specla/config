/* eslint-env jest */
import Config from 'Config'

test('Should create a config tree structure and a flatten structure', () => {
  const config = new Config({
    'my.key': true,
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
    hello: 'world'
  })

  expect(config.get()).toBe(config._config)
  expect(config.get().key.value).toBe(true)
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

test('Should merge existing config with a new config instance', () => {
  const config = new Config({ 'test.key': true })

  config.merge(new Config({
    'test.newKey': 325,
    hello: 'world'
  }))

  expect(config._config).toMatchSnapshot()
  expect(config._flattenConfig).toMatchSnapshot()
})