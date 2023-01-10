import { InsomniaContext } from '../insomnia/types/context.types'

export type ConfigurationDialogProps = {
  context: InsomniaContext
}

export type SyncModels = {
  apiSpec: boolean,
  workspace: boolean,
  cookies_not_secure: boolean,
  cookies_secure: boolean,
  environment_global: boolean,
  environment_custom: boolean,
  request: boolean,
  unitTest: boolean,
}