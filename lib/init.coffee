fs = require "fs"
path = require "path"
PJVProvider = require './package-json-validator-provider'

module.exports =

  config:
    show_warnings:
      type: 'boolean'
      default: true
    show_recommendations:
      type: 'boolean'
      default: true
    spec:
      type: 'string'
      default: 'npm'
      enum: ['npm', 'commonjs_1.0', 'commonjs_1.1']

  activate: ->
    console.log 'activate linter-package-json-validator' if atom.inDevMode()

    if not atom.packages.getLoadedPackage 'linter'
      atom.notifications.addError """
        [linter-package-json-validator] `linter` package not found, please install it
      """

  provideLinter: -> PJVProvider
