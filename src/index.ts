import { workspaceActions } from './workspace-actions/'
import { collection } from './insomnia/db'

(window as any).dev = collection
module.exports.workspaceActions = workspaceActions
