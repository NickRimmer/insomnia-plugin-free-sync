import { InsomniaContext } from '../types/context.types'
import ReactDOM from 'react-dom'
import { ReactElement } from 'react'

export type showDialogComponentProps = {
  context: InsomniaContext,
  children: ReactElement<any, any>
}

export const showDialogComponent = ({context, children}: showDialogComponentProps): void => {
  const root: HTMLElement = document.createElement('div')
  ReactDOM.render(
    children,
    root,
  )

  context.app.dialog('Free sync: Settings', root, {
    skinny: true,
    onHide() {
      ReactDOM.unmountComponentAtNode(root)
    },
  })
}
