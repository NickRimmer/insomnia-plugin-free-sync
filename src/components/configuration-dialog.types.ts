import { InsomniaContext } from '../insomnia/types/context.types'

export type ConfigurationDialogProps = {
  context: InsomniaContext,
  workspaceId: string,
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