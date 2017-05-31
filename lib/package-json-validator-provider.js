'use babel'

import { PJV } from 'package-json-validator'

export default {

  name: 'package-json-validator',

  grammarScopes: ['source.json'],

  scope: 'file',

  lintOnFly: true,

  types: {
    errors: 'Error',
    warnings: 'Warning',
    recommendations: 'Recommendation'
  },

  lint (textEditor) {
    const filePath = textEditor.getPath()

    if (!filePath || !/package\.json$/.test(filePath)) {
      return []
    }

    const text = textEditor.getText()
    const result = this.lintText(text)

    return Object.keys(this.types)
      .filter((typeKey) => result[typeKey])
      .reduce((messages, typeKey) => [
        ...messages,
        ...result[typeKey].map((message) => ({
          type: this.types[typeKey],
          text: message,
          filePath: filePath,
          range: [[0, 0], [0, 0]]
        }))
      ], [])
  },

  lintText (text, callback) {
    const spec = this.config('spec', 'npm')

    return PJV.validate(text, spec, {
      warnings: this.config('show_warnings', true),
      recommendations: this.config('show_recommendations', true)
    })
  },

  config (key, defaultValue = null) {
    const value = atom.config.get(`linter-package-json-validator.${key}`)
    return value === undefined ? defaultValue : value
  }
}
