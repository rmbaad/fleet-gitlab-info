import { MenuBarExtra } from '@raycast/api';
import React from 'react'
import { MergeRequest } from '../types'
import { getMergeRequestIcon } from '../utils';

type Props = {
  mergeRequest: MergeRequest;
}

const maxLength = 50;

export const MenuItem: React.FC<Props> = ({ mergeRequest }: Props) => {
  const title = mergeRequest.title.length > maxLength ? `${mergeRequest.title.slice(0, maxLength)}...` : mergeRequest.title;

  const tooltip = `${mergeRequest.project.name}\n` +
    `Build status: ${mergeRequest.headPipeline?.status}\n` +
    `${mergeRequest.approved ? 'Approved' : 'Not approved'}`;

  return (
    <MenuBarExtra.Item
      title={title}
      icon={getMergeRequestIcon(mergeRequest.mergeStatusEnum)}
      onAction={() => open(mergeRequest.webUrl)}
      tooltip={tooltip}
    />
  );
}
