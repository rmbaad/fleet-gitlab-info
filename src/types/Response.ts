export enum MergeStatus {
    // Merge status has not been checked
    UNCHECKED = 'UNCHECKED',
    // Currently checking for mergeability
    CHECKING = 'CHECKING',
    // There are no conflicts between the source and target branches
    CAN_BE_MERGED = 'CAN_BE_MERGED',
    // There are conflicts between the source and target branches
    CANNOT_BE_MERGED = 'CANNOT_BE_MERGED',
    // Currently unchecked. The previous state was CANNOT_BE_MERGED
    CANNOT_BE_MERGED_RECHECK = 'CANNOT_BE_MERGED_RECHECK'
}

export enum PipelineStatus {
    // Pipeline has been created
    CREATED = 'CREATED',
    // A resource (for example, a runner) that the pipeline requires to run is unavailable.
    WAITING_FOR_RESOURCE = 'WAITING_FOR_RESOURCE',
    // Pipeline is preparing to run
    PREPARING = 'PREPARING',
    // Pipeline has not started running yet
    PENDING = 'PENDING',
    // Pipeline is running
    RUNNING = 'RUNNING',
    // At least one stage of the pipeline failed
    FAILED = 'FAILED',
    // Pipeline completed successfully
    SUCCESS = 'SUCCESS',
    // Pipeline was canceled before completion
    CANCELED = 'CANCELED',
    // Pipeline was skipped
    SKIPPED = 'SKIPPED',
    // Pipeline needs to be manually started
    MANUAL = 'MANUAL',
    // Pipeline is scheduled to run
    SCHEDULED = 'SCHEDULED'
}

type Author = {
    username: string;
    avatarUrl: string;
}

enum JobStatus {
    // A job that is created.
    CREATED = 'CREATED',
    // A job that is waiting for resource.
    WAITING_FOR_RESOURCE = 'WAITING_FOR_RESOURCE',
    // A job that is preparing.
    PREPARING = 'PREPARING',
    // A job that is pending.
    PENDING = 'PENDING',
    // A job that is running.
    RUNNING = 'RUNNING',
    // A job that is success.
    SUCCESS = 'SUCCESS',
    // A job that is failed.
    FAILED = 'FAILED',
    // A job that is canceled.
    CANCELED = 'CANCELED',
    // A job that is skipped.
    SKIPPED = 'SKIPPED',
    // A job that is manual.
    MANUAL = 'MANUAL',
    // A job that is scheduled.
    SCHEDULED = 'SCHEDULED',
}

type Job = {
    status: JobStatus;
    detailedStatus: {
        detailsPath: string;
    }
}

type Pipeline = {
    status: PipelineStatus;
    jobs?: {
        nodes: Job[];
    }
}

type Project = {
    name: string;
}

export type MergeRequest = {
    id: string;
    iid: number;
    title: string;
    webUrl: string;
    approved: boolean;
    mergeStatusEnum: MergeStatus;
    sourceBranch: string;
    author: Author;
    headPipeline?: Pipeline;
    project: Project;
}

export type Response = {
    data: {
        user: {
            assignedMergeRequests: {
                nodes: MergeRequest[];
            }
            reviewRequestedMergeRequests: {
                nodes: MergeRequest[];
            }
        }
    }
}
