'use babel'

import PJVProvider from './package-json-validator-provider'
import { install } from 'atom-package-deps'

export default {

  config: {
    show_warnings: {
      type: 'boolean',
      default: true
    },
    show_recommendations: {
      type: 'boolean',
      default: true
    },
    spec: {
      type: 'string',
      default: 'npm',
      enum: ['npm', 'commonjs_1.0', 'commonjs_1.1']
    }
  },

  activate () {
    if (!atom.inSpecMode()) {
      install('linter-package-json-validator')
    }
  },

  provideLinter: () => PJVProvider
}
