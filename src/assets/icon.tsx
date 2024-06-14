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
import { TbPlayerTrackNextFilled } from 'react-icons/tb';
import { MdOutlineChangeCircle } from 'react-icons/md';

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
  playNextVideo: TbPlayerTrackNextFilled,
  changeCircle: MdOutlineChangeCircle,
};

type TIconName = {
  name: keyof typeof iconTypes;
  className?: string;
  onClick?: () => void;
};

const Icon = ({ name, className, onClick, ...props }: TIconName) => {
  const IconComponent = iconTypes[name];
  return <IconComponent className={className} onClick={onClick} {...props} />;
};

export default Icon;
