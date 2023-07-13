import Datastore from 'nedb'

export type DbName = 'ApiSpec' | 'CookieJar' | 'Environment' | 'Request' | 'RequestGroup' | 'UnitTest' | 'Workspace';

export type DbBaseDoc = {
  _id: string;
}

export type InsomniaDb = {
  datastore: Datastore;
  upsert: (data: DbBaseDoc) => void;
}
