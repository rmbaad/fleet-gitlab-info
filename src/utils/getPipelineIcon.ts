import { Color, Icon, Image } from '@raycast/api';
import { PipelineStatus } from '../types';

export const getPipelineIcon = (status: PipelineStatus | null): Image.ImageLike => {
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
};
