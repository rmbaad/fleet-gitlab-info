import { Color, Icon, Image } from '@raycast/api';
import { MergeStatus } from '../types';

export const getMergeRequestIcon = (type: MergeStatus): Image.ImageLike => {
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
};
