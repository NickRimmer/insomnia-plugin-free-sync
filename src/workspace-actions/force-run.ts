import { InsomniaWorkspaceAction } from "../types/insomnia/workspace-action.type"
import {
  InsomniaContext,
  InsomniaWorkspaceActionModel,
} from '../types/insomnia/insomnia.types'

export const forceRunAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Force run',
  icon: 'fa-arrows-rotate',
  action
}

async function action(
  context: InsomniaContext,
  models: InsomniaWorkspaceActionModel,
) {
  await context.app.alert('Not implemented yet')
}