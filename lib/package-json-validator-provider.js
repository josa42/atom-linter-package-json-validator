"use babel"

import fs from 'fs'
import path from 'path'
import { PJV } from 'package-json-validator'
import { allowUnsafeNewFunction } from 'loophole'

const nsp = allowUnsafeNewFunction(function() {
    return require('nsp')
})

export default {

  name: 'package-json-validator',

  grammarScopes: ['source.json'],

  scope: 'file',

  lintOnFly: true,

  types: {
    errors: 'Error',
    warnings: 'Warning',
    recommendations: 'Recommendation',
    security: "Security"
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
              let msg = {
                type: this.types[typeKey],
                text: message,
                filePath: filePath
              }

              if (typeKey === 'security') {
                  msg.text = message.text
                  msg.range = message.range
              } else {
                  msg.text = message
              }

              return msg
            }))
          }, [])

        resolve(messsages)
      })
    })
  },

  lintText(text, callback) {
    const spec = this.config('spec', 'npm')

    let result = PJV.validate(text, spec, {
      warnings: this.config('show_warnings', true),
      recommendations: this.config('show_recommendations', true)
    })

    if (!result.valid || !(spec === 'npm' && this.config('show_security_issues', true))) {
      return callback(result)
    }

    nsp.check({
      package: JSON.parse(text)
    }, function(err, res) {
      if (err) {
        atom.notifications.addError(`Error when retrieving security issues from Node Security Platform: ${err.message}`)
        return callback(result)
      }

      if (res) {
        result.security = []

        let lines = text.split('\n')

        for (let msgError of res) {
          let modulePath = msgError.path.slice(1).join(" / ")
          let moduleName = msgError.path[1].substring(0, msgError.path[1].indexOf("@"))
          let range = getRange(lines, `"${moduleName}"`)

          result.security.push(
            {
              text: `${modulePath}: ${msgError.title}. Recommendation: ${msgError.recommendation} \n(see ${msgError.advisory})`,
              range: range
            }
          )
        }
      }

      callback(result)
    })
  },

  config(key, defaultValue = null) {
    value = atom.config.get(`linter-package-json-validator.${key}`)
    return value === undefined ? defaultValue : value
  }
}

function getRange(lines, value) {
    for (let lineIndex in lines) {
        let line = lines[lineIndex]
        let start = line.indexOf(value)

        if (start !== -1) {
            let end
            let strFromModule = line.substring(start)

            if (strFromModule.indexOf(",") !== -1) {
                end = start + strFromModule.indexOf(",")
            } else if (strFromModule.indexOf("}") !== -1) {
                end = start + strFromModule.indexOf("}")
            } else {
                end = line.length
            }

            return [[+lineIndex, start],[+lineIndex, end]]
        }
    }
}
