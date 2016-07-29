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

    it(('should lint package.json and find only security issues'), () => {
      atom.config.set('linter-package-json-validator.show_warnings', false)
      atom.config.set('linter-package-json-validator.show_recommendations', false)

      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'badDependencies', 'package.json'))
          .then((editor) => PJVProvider.lint(editor))
          .then((messages) => {
            expect(countIn(messages, 'type', 'Error')).toEqual(0)
            expect(countIn(messages, 'type', 'Warning')).toEqual(0)
            expect(countIn(messages, 'type', 'Recommendation')).toEqual(0)
            expect(countIn(messages, 'type', 'Security')).toNotEqual(0)
            expect(messages[0].text).toEqual("jqtree@1.2.1: XSS in drag and drop node. Recommendation: Upgrade to 1.3.4 or later. \n(see https://nodesecurity.io/advisories/132)")
            expect(messages[0].range).toEqual([[11, 4],[11, 22]])
            expect(messages[1].text).toEqual("azure@0.10.4 / request@2.27.0 / qs@0.6.6: Denial-of-Service Extended Event Loop Blocking. Recommendation: Update qs to version 1.0.0 or greater \n(see https://nodesecurity.io/advisories/28)")
            expect(messages[1].range).toEqual([[12, 4],[12, 21]])
          })
      })
    })

    it(('should lint package.json and find no issues'), () => {
      atom.config.set('linter-package-json-validator.show_warnings', false)
      atom.config.set('linter-package-json-validator.show_recommendations', false)

      waitsForPromise(() => {
        return atom.workspace.open(path.join(__dirname, 'files', 'goodDependencies', 'package.json'))
          .then((editor) => PJVProvider.lint(editor))
          .then((messages) => {
            expect(countIn(messages, 'type', 'Error')).toEqual(0)
            expect(countIn(messages, 'type', 'Warning')).toEqual(0)
            expect(countIn(messages, 'type', 'Recommendation')).toEqual(0)
            expect(countIn(messages, 'type', 'Security')).toEqual(0)
          })
      })
    })
  })
})
