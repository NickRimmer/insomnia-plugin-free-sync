import React, { FC, FunctionComponent } from "react";
import ReactDOM from "react-dom";
import { Button } from "../shared/button";
import { InsomniaContext, InsomniaWorkspaceActionModel } from "../types/insomnia/insomnia.types"
import { InsomniaWorkspaceAction } from "../types/insomnia/workspace-action.type"

export const configurationAction: InsomniaWorkspaceAction = {
  label: 'Free sync: Configuration',
  icon: 'fa-cog',
  action
}

async function action(
  context: InsomniaContext,
  models: InsomniaWorkspaceActionModel,
) {
  // console.log(context.app)

  const body: HTMLElement = document.createElement('div');
  ReactDOM.render(
    <DialogBody />,
    body,
  );

  context.app.dialog('Free sync: Settings', body, {
    skinny: true,
    onHide() {
      ReactDOM.unmountComponentAtNode(body)
    }
  })
}

const DialogBody: FC = () => {
  return (
  <div>
    <Button icon="fa-file">Select file...</Button>
  </div>)
}