{ resetConfig } = require './test-helper'

PJVProvider = require '../lib/package-json-validator-provider'

describe "Lint package.json", ->
  beforeEach ->
    waitsForPromise -> atom.packages.activatePackage('linter-less')
    resetConfig()

  describe "Other json files", ->
    it 'should only lint package.json files', ->

      waitsForPromise ->
        atom.workspace.open('./files/other.json')
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->

            expect(messages.length).toEqual(0)


  describe "package.json - npm", ->
    it 'should only lint package.json files', ->

      waitsForPromise ->
        atom.workspace.open('./files/package.json')
          .then (editor) -> PJVProvider.lint(editor)
          .then (messages) ->

            expect(messages.length).notEqual(0)
