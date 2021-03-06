# @specla/config
[![npm version](https://img.shields.io/npm/v/@specla/config.svg)](https://www.npmjs.com/package/@specla/config)
[![Build Status](https://travis-ci.org/specla/config.svg?branch=master)](https://travis-ci.org/specla/config)
[![Coverage Status](https://coveralls.io/repos/github/specla/config/badge.svg?branch=master)](https://coveralls.io/github/specla/config?branch=master)
[![Dependency Status](https://david-dm.org/specla/config.svg)](https://david-dm.org/specla/config)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Manage configuration objects with ease.

### Install
```sh
npm install @specla/config
```

### Usage
```js
import Config from '@specla/config'

const config = new Config({
  'my.config.key': 'some value...'
})

// Access property in the config
config.get('my.config.key') // returns 'some value...'

// Access part of config property
config.get('my') // returns { config: { key: 'some value...' } }

// Set or update a config property value
config.set('my.config.key', 'updated value...')

// Delete a config property
config.unset('my.config.key')

// Merge current config with new config
config.merge({
  'my.config.newKey': 'other key...'
})
```

### Functional properties
Specla config ships with functional properties which is a dynamic property that
has a relation to an other config property.
```js
const config = new Config({
  'normal.prop': 'test',
  'func.prop': config => config.get('normal.prop') + ' functional property'
})

config.get('func.prop') // will return "test functional property"
```
