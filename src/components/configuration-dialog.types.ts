import { InsomniaContext } from '../insomnia/types/context.types'

export type ConfigurationDialogProps = {
  context: InsomniaContext
}

export type SyncModels = {
  api_spec: boolean,
  workspace: boolean,
  cookie_jar: boolean,
  environment: boolean,
  request: boolean, // and 'request_group'
  unit_test: boolean, // and 'unit_test_suite'
}