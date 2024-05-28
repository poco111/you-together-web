import {
  FaAngleUp,
  FaAngleDown,
  FaGripLines,
  FaRegCirclePlay,
  FaRegCirclePause,
  FaEllipsis,
  FaRegTrashCan,
  FaLock,
  FaLockOpen,
  FaPeopleGroup,
} from 'react-icons/fa6';
import { IoIosSend } from 'react-icons/io';
import { GoPlusCircle } from 'react-icons/go';

const iconTypes = {
  arrowUp: FaAngleUp,
  arrowDown: FaAngleDown,
  gripLines: FaGripLines,
  play: FaRegCirclePlay,
  pause: FaRegCirclePause,
  ellipsis: FaEllipsis,
  sendMessage: IoIosSend,
  plus: GoPlusCircle,
  trashCan: FaRegTrashCan,
  lock: FaLock,
  lockOpen: FaLockOpen,
  peopleGroup: FaPeopleGroup,
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
