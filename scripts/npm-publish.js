'use strict'

const fs = require('fs')
const {execSync} = require('child_process')

// build a new clear package.json for NPM + Insomnia
const dataJson = fs.readFileSync('package.json').toString()
const dataObj = JSON.parse(dataJson)

// versions auto builder
const buildVersion = (configuredVersion) => {
  const deployedVersionJson = execSync('npm show insomnia-plugin-free-sync versions --json').toString()
  const deployedVersion = JSON.parse(deployedVersionJson).slice(-1)[0]

  console.info(`Configured version: ${configuredVersion}`)
  console.info(`Deployed version: ${deployedVersion}`)

  const configuredVersionParts = configuredVersion.split('.')
  const deployedVersionParts = deployedVersion.split('.')

  // if new major or minor
  if (configuredVersionParts[0] !== deployedVersionParts[0] ||
    configuredVersionParts[1] !== deployedVersionParts[1]) {
    console.info(`New major/minor version set from configuration: ${configuredVersion}`)
    return configuredVersion
  }

  const generated = (parseInt(deployedVersionParts[2]) + 1).toString()

  const result = `${deployedVersionParts[0]}.${deployedVersionParts[1]}.${generated}`
  console.log(`Auto version created: ${result}`)

  return result
}

const resultObj = {
  name: dataObj.name,
  version: buildVersion(dataObj.version),
  main: 'index.js',
  author: dataObj.author,
  license: dataObj.license,
  repository: dataObj.repository,
  bugs: dataObj.bugs,
  insomnia: dataObj.insomnia,
}

const resultJson = JSON.stringify(resultObj, null, 2)
fs.writeFileSync('dist/package.json', resultJson)

// create README.md for NPM repo
fs.createReadStream('README-NPM.md').pipe(fs.createWriteStream('dist/README.md'))