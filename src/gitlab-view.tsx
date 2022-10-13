import { List } from "@raycast/api";
import { useFetch } from '@raycast/utils';
import { MergeRequest, Response } from './types';
import { personalAccessToken } from "./preferences";
import { viewQuery } from './queries';
import { gitlabUrl } from './constants';
import { ViewItem } from './components';

export default function GitlabView() {
  const { data, isLoading } = useFetch<Response>(`${gitlabUrl}/api/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${personalAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: viewQuery })
  });

  let mergeRequests: MergeRequest[] = [];

  if (data) {
    mergeRequests = [
      ...data.data.user.assignedMergeRequests.nodes,
      ...data.data.user.reviewRequestedMergeRequests.nodes,
    ]
  }

  return (
    <List isLoading={isLoading}>
      {mergeRequests?.map(mergeRequest => <ViewItem key={mergeRequest.id} mergeRequest={mergeRequest} />)}
    </List>
  );
};
