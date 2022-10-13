import React from 'react';
import { Icon, Image, List } from '@raycast/api';

import { gitlabUrl } from '../constants';
import { ItemAccessory, ViewItemProps } from '../types';
import { getMergeRequestIcon, getPipelineIcon } from '../utils';

import { ViewActions } from './ViewActions';

export const ViewItem: React.FC<ViewItemProps> = ({ mergeRequest }: ViewItemProps) => {
  const accessories: ItemAccessory[] = [
    { icon: { source: `${gitlabUrl}/${mergeRequest.author.avatarUrl ?? ''}` ?? Icon.PersonCircle, mask: Image.Mask.Circle } }
  ];

  if (mergeRequest.headPipeline) {
    accessories.push({ icon: getPipelineIcon(mergeRequest.headPipeline?.status ?? null) });
  }

  accessories.push({ text: mergeRequest.approved ? 'approved' : 'not approved' });

  return (
    <List.Item
      key={mergeRequest.id}
      icon={getMergeRequestIcon(mergeRequest.mergeStatusEnum)}
      title={`${mergeRequest.title}`}
      subtitle={`${mergeRequest.project.name.toLowerCase()} #${mergeRequest.iid}`}
      accessories={accessories}
      actions={<ViewActions mergeRequest={mergeRequest} />}
    />
  )
}
