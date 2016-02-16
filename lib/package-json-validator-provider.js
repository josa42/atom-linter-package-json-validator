"use babel"

import fs from 'fs'
import path from 'path'
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

  lint(textEditor) {

    return new Promise((resolve, reject) => {

      const filePath = textEditor.getPath()

      if (!filePath || !/package\.json$/.test(filePath)) {
        return resolve([])
      }

      const text = textEditor.getText()

      this.lintText(text, (result) => {

        const messsages = Object.keys(this.types)
          .filter((typeKey) => result[typeKey])
          .reduce((messages, typeKey) => {
            return messages.concat(result[typeKey].map((message)=> {
                return {
                  type: this.types[typeKey],
                  text: message,
                  filePath: filePath,
                  range: [[0, 0], [0, 0]]
                }
            }))
          }, [])

        resolve(messsages)
      })
    })
  },

  lintText(text, callback) {
    const spec = this.config('spec', 'npm')

    callback(PJV.validate(text, spec, {
      warnings: this.config('show_warnings', true),
      recommendations: this.config('show_recommendations', true)
    }))
  },

  config(key, defaultValue = null) {
    value = atom.config.get(`linter-package-json-validator.${key}`)
    return value === undefined ? defaultValue : value
  }
}
