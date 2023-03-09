export type WorkspaceResource = {
  _id: string,
  _type: string,
  parentId: string,
  name?: string | null,
  data?: object | null,
  dataPropertyOrder?: object | null,
  contents?: string | null,
}