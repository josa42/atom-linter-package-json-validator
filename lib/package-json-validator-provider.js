'use babel'

import { PJV } from 'package-json-validator'

export default {

  name: 'Package.json validator',

  grammarScopes: ['source.json'],

  scope: 'file',

  lintsOnChange: true,

  // const VALID_SEVERITY = new Set(['error', 'warning', 'info'])
  severities: {
    errors: 'error',
    warnings: 'warning',
    recommendations: 'info'
  },

  lint (textEditor) {
    const filePath = textEditor.getPath()

    if (!filePath || !/package\.json$/.test(filePath)) {
      return []
    }

    const text = textEditor.getText()
    const result = this.lintText(text)

    return Object.keys(this.severities)
      .filter((typeKey) => result[typeKey])
      .reduce((messages, typeKey) => [
        ...messages,
        ...result[typeKey].map((message) => ({
          severity: this.severities[typeKey],
          excerpt: message,
          description: message,
          location: {
            file: filePath,
            position: [[0, 0], [0, 1]]
          }
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
