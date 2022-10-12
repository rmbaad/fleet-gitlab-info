import { Image } from '@raycast/api';

export type ItemAccessory = ({
    text?: string | undefined | null;
} | {
    date?: Date | undefined | null;
}) & {
    icon?: Image.ImageLike | undefined | null;
    tooltip?: string | undefined | null;
};
