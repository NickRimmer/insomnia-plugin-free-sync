import { InsomniaWorkspaceAction } from './types/insomnia/workspace-action.type';
import { forceRunAction } from './workspace-actions/force-run'
import { configurationAction } from './workspace-actions/configuration'

export const workspaceActions: InsomniaWorkspaceAction[] = [
  forceRunAction,
  configurationAction
];