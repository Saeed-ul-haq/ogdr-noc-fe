import { fetchJSON ,config} from 'libs/fetch'

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

export async function currentLoggedInUser() {
  let userAPI = config.userAPI || PRODUCT_APP_URL_PROFILE
  return fetchJSON(
    `${userAPI}/graphql`,
    {
      body: JSON.stringify({
        query: ` {
          me {
            userProfile {
              userID
              photo {
                aPIID
              }
              title
              fullName
              subject
              email
            }
          }
        } `
      }),
      method: 'POST'
    },
    true
  )
}

export const getUserSubject = async () => {
  const {data} = await currentLoggedInUser()
    return data && data.me.userProfile.subject;
}