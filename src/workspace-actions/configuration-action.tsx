import React from 'react'
import { ConfigurationDialog } from '../components/configuration-dialog'
import { showDialogComponent } from '../insomnia/tools/dialogs'
import { InsomniaWorkspaceAction } from '../insomnia/types/workspace-action.types'

export const configurationAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Configuration',
  icon: 'gear',
  action: (context, models) => showDialogComponent({
    context,
    title: 'Free sync: Configuration',
    children: (<ConfigurationDialog context={context} workspaceId={models.workspace._id}/>),
  }),
}