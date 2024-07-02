'use client';

import ChangeRoomTitleModal from '@/components/change-room-title-modal-form';
import Icon from '@/assets/icon';

interface IRoomInfoProps {
  roomDetailInfo: TRoomDetailInfo | undefined;
  participantsList: TUserInfo[];
  userInfo: TUserInfo | undefined;
}

const RoomInfo = ({
  roomDetailInfo,
  participantsList,
  userInfo,
}: IRoomInfoProps) => {
  return (
    <div className="w-full min-h-10 p-3 border-small rounded-small border-default-200 dark:border-default-100">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 w-2/3">
          <div className="text-sm font-semibold">
            {roomDetailInfo?.roomTitle}
          </div>
        </div>
        <div className="flex items-center gap-2 w-1/3 justify-end pl-1">
          <ChangeRoomTitleModal
            currentRoomTitle={roomDetailInfo?.roomTitle}
            userInfo={userInfo}
          />
          <Icon
            name="peopleGroup"
            className={`size-5 ${
              (participantsList?.length ?? 0) >= (roomDetailInfo?.capacity ?? 0)
                ? 'text-red-500'
                : ''
            }`}
          />
          <div
            className={`text-sm ${
              (participantsList?.length ?? 0) >= (roomDetailInfo?.capacity ?? 0)
                ? 'text-red-500'
                : ''
            }`}
          >
            {participantsList?.length}/{roomDetailInfo?.capacity}
          </div>
          {roomDetailInfo?.passwordExist ? (
            <Icon name="lock" className="text-red-500" />
          ) : (
            <Icon name="lockOpen" />
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomInfo;
