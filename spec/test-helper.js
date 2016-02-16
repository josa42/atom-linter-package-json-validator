"use babel"

import { config } from '../lib/init'

export function resetConfig() {
  Object.keys(config).forEach((key) => {
    atom.config.set("linter-linter-package-json-validator.#{key}", config[key].default)
  })
}

export function countIn(array, prop, value) {
  return array.filter((el) => el[prop] === value).length
}
