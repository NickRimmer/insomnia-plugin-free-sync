import { InsomniaContext } from '../insomnia/types/context.types'

export type ConfigurationDialogProps = {
  context: InsomniaContext
}

export type SyncModels = {
  apiSpec: boolean,
  cookiesNotSecure: boolean,
  cookiesSecure: boolean,
  environmentBase: boolean,
  environmentCustom: boolean,
  request: boolean,
  unitTest: boolean,
}