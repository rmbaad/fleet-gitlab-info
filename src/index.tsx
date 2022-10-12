import { ActionPanel, List, Action, Icon, Image, Color } from "@raycast/api";
import { useFetch } from '@raycast/utils';
import { MergeRequest, Response, MergeStatus, PipelineStatus, ItemAccessory } from './types';
import { username, personalAccessToken } from "./preferences";

const getMrIcon = (type: MergeStatus): Image.ImageLike => {
    switch (type) {
        case MergeStatus.UNCHECKED:
            return Icon.Circle;
        case MergeStatus.CHECKING:
            return Icon.CircleProgress;
        case MergeStatus.CAN_BE_MERGED:
            return { source: Icon.CheckCircle, tintColor: Color.Green };
        default:
            return { source: Icon.Multiply, tintColor: Color.Red };
    }
}

const getPipelineIcon = (status: PipelineStatus | null): Image.ImageLike => {
    switch (status) {
        case PipelineStatus.SUCCESS:
            return { source: Icon.CheckCircle, tintColor: Color.Green };
        case PipelineStatus.FAILED:
        case PipelineStatus.CANCELED:
        case PipelineStatus.SKIPPED:
            return { source: Icon.Multiply, tintColor: Color.Red };
        default:
            return Icon.CircleProgress;
    }
}

export default function Command() {
    const { data, isLoading } = useFetch<Response>('https://git.core.arrival.co/api/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${personalAccessToken}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `
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
        `})
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
            {mergeRequests?.map(mr => <Item key={mr.id} mr={mr} />)}
        </List>
    );
}

const Item = (props: { mr: MergeRequest }) => {
    const { mr } = props;

    const accessories: ItemAccessory[] = [
        { icon: { source: `https://git.core.arrival.co/${mr.author.avatarUrl ?? ''}` ?? Icon.PersonCircle, mask: Image.Mask.Circle } }
    ];

    if (mr.headPipeline) {
        accessories.push({ icon: getPipelineIcon(mr.headPipeline?.status ?? null) });
    }

    accessories.push({ text: mr.approved ? 'approved' : 'not approved' });

    return (
        <List.Item
            key={mr.id}
            icon={getMrIcon(mr.mergeStatusEnum)}
            title={`${mr.title}`}
            subtitle={`${mr.project.name.toLowerCase()} #${mr.iid}`}
            accessories={accessories}
            actions={<Actions mr={mr} />}
        />
    )
}


function Actions(props: { mr: MergeRequest }) {
    const task = props.mr.title.match(/[a-zA-Z]+-[0-9]+/)?.[0];
    const jiraUrl = task ? `https://arrival.atlassian.net/browse/${task}` : '';
    const jobs = props.mr.headPipeline?.jobs?.nodes ?? [];
    const job = jobs.length ? jobs[0] : null;

    return (
        <ActionPanel>
            <Action.OpenInBrowser url={props.mr.webUrl} />
            {jiraUrl && <Action.OpenInBrowser title="Open JIRA task" url={jiraUrl} />}
            {job && <Action.OpenInBrowser title="Open Build" url={job.detailedStatus.detailsPath} />}
            <Action.CopyToClipboard title="Copy URL" content={props.mr.webUrl} />
            <Action.CopyToClipboard title="Copy branch" content={props.mr.sourceBranch} />
        </ActionPanel>
    );
}
