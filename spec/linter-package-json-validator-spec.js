"use babel"

import { resetConfig, countIn } from './test-helper'
import path from 'path'
import PJVProvider from '../lib/package-json-validator-provider'

describe(('Lint package.json'), () => {
  beforeEach(() => {
    waitsForPromise(() => atom.packages.activatePackage('linter-package-json-validator'))
    return resetConfig()
  })

  describe(('Other json files'), () => {

    it(('should not lint other.json files'), () => {
      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'other.json'))
          .then((editor) => PJVProvider.lint(editor))
          .then((messages) => {
            expect(messages.length).toEqual(0)
          })
      })
    })
  })

  describe(('package.json - npm'), () => {
    it(('should lint package.json files'), () => {

      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then((editor) => PJVProvider.lint(editor))
          .then((messages) => {
            expect(messages.length).toNotEqual(0)
          })
      })
    })
  })

  describe(('package.json - settings'), () => {

    it(('should lint package.json and find only errors'), () => {
      atom.config.set('linter-package-json-validator.show_warnings', false)
      atom.config.set('linter-package-json-validator.show_recommendations', false)

      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then((editor) => PJVProvider.lint(editor))
          .then((messages) => {
            expect(countIn(messages, 'type', 'Error')).toNotEqual(0)
            expect(countIn(messages, 'type', 'Warning')).toEqual(0)
            expect(countIn(messages, 'type', 'Recommendation')).toEqual(0)
          })
      })
    })

    it(('should lint package.json and find only errors and warnings'), () => {
      atom.config.set('linter-package-json-validator.show_recommendations', false)

      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then((editor) => PJVProvider.lint(editor))
          .then((messages) => {
            expect(countIn(messages, 'type', 'Error')).toNotEqual(0)
            expect(countIn(messages, 'type', 'Warning')).toNotEqual(0)
            expect(countIn(messages, 'type', 'Recommendation')).toEqual(0)
          })
      })
    })

    it(('should lint package.json and find only errors, warnings and recommendations'), () => {

      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then((editor) => PJVProvider.lint(editor))
          .then((messages) => {
            expect(countIn(messages, 'type', 'Error')).toNotEqual(0)
            expect(countIn(messages, 'type', 'Warning')).toNotEqual(0)
            expect(countIn(messages, 'type', 'Recommendation')).toNotEqual(0)
          })
      })
    })
  })
})
