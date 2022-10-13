import React from 'react';
import { Action, ActionPanel } from '@raycast/api';

import { jiraUrl } from '../constants';
import { ViewActionsProps } from '../types';

export const ViewActions: React.FC<ViewActionsProps> = ({ mergeRequest }: ViewActionsProps) => {
  const task = mergeRequest.title.match(/[a-zA-Z]+-[0-9]+/)?.[0];
  const taskUrl = task ? `${jiraUrl}/browse/${task}` : '';
  const jobs = mergeRequest.headPipeline?.jobs?.nodes ?? [];
  const job = jobs.length ? jobs[0] : null;

  return (
    <ActionPanel>
      <Action.OpenInBrowser url={mergeRequest.webUrl} />
      {taskUrl && <Action.OpenInBrowser title="Open JIRA task" url={taskUrl} />}
      {job && <Action.OpenInBrowser title="Open Build" url={job.detailedStatus.detailsPath} />}
      <Action.CopyToClipboard title="Copy URL" content={mergeRequest.webUrl} />
      <Action.CopyToClipboard title="Copy branch" content={mergeRequest.sourceBranch} />
    </ActionPanel>
  );
}
