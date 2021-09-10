#!/usr/bin/env node
const chalk = require('chalk')
const webpack = require('webpack')
const devServer = require('webpack-dev-server')

const clientConfig = require('../config/client')
const serverConfig = require('../config/server')
const devServerConfig = require('../config/devServer')
const paths = require('../config/paths')

if (paths.clientSrc) {
  const clientCompiler = webpack(clientConfig('development'))

  const clientServer = new devServer(devServerConfig, clientCompiler)

  clientCompiler.hooks.done.tap('done', stats => {
    if (!stats.hasErrors()) {
      console.clear()
      console.log(chalk.green('Client Build Completed!'))

      if (paths.serverSrc) {
        const serverCompiler = webpack(serverConfig('development'))

        serverCompiler.hooks.done.tap('done', stats => {
          if (!stats.hasErrors()) {
            console.clear()
            console.log(chalk.green('Server Build Completed!'))
          } else {
            console.log(chalk.red(stats.toJson().errors.map(({message}) => message)))
          }
        })

        serverCompiler.watch({}, () => {})

        console.log(chalk.blue('Server Building...'))
      }
    } else {
      console.log(chalk.red(stats.toJson().errors.map(({message}) => message)))
    }
  })

  console.log(chalk.blue('Client Building...'))

  clientServer.start()
} else {
  console.log(chalk.red('Error! `src/client.js` file is not exist!'))
}
