import { Icon, Image, MenuBarExtra } from "@raycast/api";
import { useCachedState, useFetch } from '@raycast/utils';
import { useEffect } from 'react';

import { MenuItem } from './components';
import { gitlabUrl } from './constants';
import { personalAccessToken } from './preferences';
import { viewQuery } from './queries';
import { Response } from './types';

export default function MenuCommand(): JSX.Element {
  const [count, setCount] = useCachedState('count', 0);
  const [isDismissed, setIsDismissed] = useCachedState('isDismissed', false);

  const { data, isLoading } = useFetch<Response>(`${gitlabUrl}/api/graphql`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${personalAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: viewQuery })
  });

  const myRequests = data?.data.user.assignedMergeRequests.nodes ?? [];
  const requested = data?.data.user.reviewRequestedMergeRequests.nodes ?? [];

  const isFirstTimeLoading = isLoading && !data;
  let icon: Image.ImageLike = isFirstTimeLoading ? { source: Icon.CircleProgress } : { source: 'command-icon.png' };
  if (isDismissed && !isFirstTimeLoading) {
    icon = { source: 'command-icon.png', tintColor: '#999999' };
  }

  const checkText = requested.length ? `Check: ${requested.length}` : '';
  const myText = myRequests.length ? `My: ${myRequests.length}` : '';
  const title = [checkText, myText].filter(Boolean).join(' ');

  useEffect(() => {
    if (!isDismissed) {
      setCount(requested.length + myRequests.length);
      return;
    }

    if (requested.length + myRequests.length !== count) {
      setCount(requested.length + myRequests.length);
      setIsDismissed(false);
    }
  }, [data]);

  return (
    <MenuBarExtra icon={icon} title={isDismissed ? undefined : title}>
      {requested.length ? (
        <>
          <MenuBarExtra.Section title="To review">
            {requested.map(mergeRequest => (
              <MenuItem key={mergeRequest.id} mergeRequest={mergeRequest} />
            ))}
          </MenuBarExtra.Section>
        </>
      ) : null}
      {requested.length && myRequests.length ? <MenuBarExtra.Separator /> : null}
      {myRequests.length ? (
        <>
          <MenuBarExtra.Section title="My requests">
            {myRequests.map(mergeRequest => (
              <MenuItem key={mergeRequest.id} mergeRequest={mergeRequest} />
            ))}
          </MenuBarExtra.Section>
        </>
      ) : null}
      {!isDismissed ? (
        <MenuBarExtra.Section>
          <MenuBarExtra.Item
            title="Dismiss"
            onAction={() => setIsDismissed(true)}
          />
        </MenuBarExtra.Section>
      ) : null}
    </MenuBarExtra>
  );
}
