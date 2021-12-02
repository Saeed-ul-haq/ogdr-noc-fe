import { fetchJSON } from 'libs/fetch'

export async function getWorkSpaces(orgID) {
  return fetchJSON(
    `/graphql`,
    {
      body: JSON.stringify({
        query: `query meWorkspacesByOrganization($orgId: String!) {
            meWorkspacesByOrganization(organizationID: $orgId) {
              workspaces {
                id
                name
              }
            }
          }`,
        operationName: 'meWorkspacesByOrganization',
        variables: { orgId: orgID },
      }),
      method: 'POST',
    },
    true,
  )
}
