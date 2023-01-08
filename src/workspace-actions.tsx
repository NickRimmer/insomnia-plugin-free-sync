import React from "react";
import { InsomniaWorkspaceAction } from './insomnia/types/workspace-action.types'
import { showDialogComponent } from './insomnia/tools/dialogs'
import { ConfigurationDialog } from './components/configuration-dialog'

const forceRunAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Force run',
  icon: 'fa-arrows-rotate',
  action: () => alert('Not implemented yet')
}

const configurationAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Configuration',
  icon: 'fa-cog',
  action: context => showDialogComponent({
    context,
    children: (<ConfigurationDialog context={context}/>)
  })
}

export const workspaceActions: InsomniaWorkspaceAction[] = [
  forceRunAction,
  configurationAction
];
