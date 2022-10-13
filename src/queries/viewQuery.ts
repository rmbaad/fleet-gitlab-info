import { username } from "../preferences";

export const viewQuery = `
  fragment MergeRequestFragment on MergeRequest {
    id
    iid
    title
    webUrl
    approved
    mergeStatusEnum
    sourceBranch

    author {
      username
      avatarUrl
    }

    project {
      name
    }

    headPipeline {
      status

      jobs(last:1) {
        nodes {
          status
          detailedStatus {
            detailsPath
          }
        }
      }
    }
  }

  query {
    user(username:"${username}") {
      assignedMergeRequests(state:opened,sort:UPDATED_DESC) {
        nodes {
          ...MergeRequestFragment
        }
      }

      reviewRequestedMergeRequests(state:opened,sort:UPDATED_DESC) {
        nodes {
          ...MergeRequestFragment
        }
      }
    }
  }
`;
