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

export const getOrganizations = () => {
  return fetchJSON(
    `${PRODUCT_APP_URL_WORKSPACE}/graphql`,
    {
      body: JSON.stringify({
        query: `{
          meOrganizations {
            ID
            Name
          }
        }`
      }),
      method: 'POST'
    },
    true
  )
}
