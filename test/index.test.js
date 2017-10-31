/* eslint-env jest */
import Config from 'index'

test('Should export Config', () => {
  expect(Config.prototype.constructor.name).toBe('Config')
})
