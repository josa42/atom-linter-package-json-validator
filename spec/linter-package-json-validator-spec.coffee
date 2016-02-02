{ resetConfig } = require './test-helper'
path = require 'path'

PJVProvider = require '../lib/package-json-validator-provider'

describe "Lint package.json", ->
  beforeEach ->
    waitsForPromise -> atom.packages.activatePackage('linter-package-json-validator')
    resetConfig()

  describe "Other json files", ->
    it 'should not lint other.json files', ->

      waitsForPromise ->
        atom.workspace.open(path.join(__dirname, 'files', 'other.json'))
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->
            expect(messages.length).toEqual(0)


  describe "package.json - npm", ->
    it 'should lint package.json files', ->

      waitsForPromise ->
        atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->
            expect(messages.length).toNotEqual(0)

  describe "package.json - settings", ->

    it 'should lint package.json and find only errors', ->
      atom.config.set('linter-package-json-validator.show_warnings', false)
      atom.config.set('linter-package-json-validator.show_recommendations', false)

      waitsForPromise ->
        atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->
            expect(messages.filter((m) -> m.type is 'Error').length).toNotEqual(0)
            expect(messages.filter((m) -> m.type is 'Warning').length).toEqual(0)
            expect(messages.filter((m) -> m.type is 'Recommendation').length).toEqual(0)

    it 'should lint package.json and find only errors and warnings', ->
      atom.config.set('linter-package-json-validator.show_recommendations', false)

      waitsForPromise ->
        atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->
            expect(messages.filter((m) -> m.type is 'Error').length).toNotEqual(0)
            expect(messages.filter((m) -> m.type is 'Warning').length).toNotEqual(0)
            expect(messages.filter((m) -> m.type is 'Recommendation').length).toEqual(0)

    it 'should lint package.json and find only errors, warnings and recommendations', ->

      waitsForPromise ->
        atom.workspace.open(path.join(__dirname, 'files', 'package.json'))
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->
            expect(messages.filter((m) -> m.type is 'Error').length).toNotEqual(0)
            expect(messages.filter((m) -> m.type is 'Warning').length).toNotEqual(0)
            expect(messages.filter((m) -> m.type is 'Recommendation').length).toNotEqual(0)
