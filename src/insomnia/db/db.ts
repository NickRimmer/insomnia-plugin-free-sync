import { join } from 'path'
import { DbBaseDoc, DbName, InsomniaDb } from './db.types'
import Datastore from 'nedb'

const _neDB = window.require('nedb')
const _path = window.app.getPath('userData')

const getInstance = (name: DbName): InsomniaDb => {
  const filename = join(_path, `insomnia.${name}.db`)
  const db = new _neDB({
    filename,
    autoload: true,
    corruptAlertThreshold: 0.9,
    inMemoryOnly: false,
  }) as Datastore

  const upsert = (data: DbBaseDoc) => {
    // TODO update or insert record by _id to database
    // TODO update redux store
  }

  return {
    datastore: db,
    upsert,
  }
}

export const collection = {
  workspaces: getInstance('Workspace'),
  environments: getInstance('Environment'),
  requests: getInstance('Request'),
  requestGroups: getInstance('RequestGroup'),
  apiSpecs: getInstance('ApiSpec'),
  cookies: getInstance('CookieJar'),
  unitTests: getInstance('UnitTest'),
}
