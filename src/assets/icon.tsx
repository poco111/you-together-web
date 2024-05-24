import {
  FaAngleUp,
  FaAngleDown,
  FaGripLines,
  FaRegCirclePlay,
  FaRegCirclePause,
  FaEllipsis,
} from 'react-icons/fa6';
import { IoIosSend } from 'react-icons/io';

const iconTypes = {
  arrowUp: FaAngleUp,
  arrowDown: FaAngleDown,
  gripLines: FaGripLines,
  play: FaRegCirclePlay,
  pause: FaRegCirclePause,
  ellipsis: FaEllipsis,
  sendMessage: IoIosSend,
};

type TIconName = {
  name: keyof typeof iconTypes;
  className?: string;
};

const Icon = ({ name, className, ...props }: TIconName) => {
  const IconComponent = iconTypes[name];
  return <IconComponent className={className} {...props} />;
};

export default Icon;
