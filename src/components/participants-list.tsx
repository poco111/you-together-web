import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableColumn,
  TableRow,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from '@nextui-org/react';
import { getDropdownContents } from '@/service/user-action';
import Icon from '@/assets/icon';

interface IParticipantsListProps {
  participantsList: Array<TUserInfo>;
  userInfo: TUserInfo | undefined;
  onChangeNicknameModalOpen: () => void;
  changeUserRole: ({
    targetUserId,
    newUserRole,
  }: {
    targetUserId: number;
    newUserRole: string;
  }) => void;
}

const ParticipantsList = ({
  participantsList,
  userInfo,
  onChangeNicknameModalOpen,
  changeUserRole,
}: IParticipantsListProps) => {
  const renderDropdownContent = (
    userInfo: TUserInfo,
    targetUserInfo: TUserInfo
  ) => {
    const { contentsType, dropdownContents } = getDropdownContents(
      userInfo,
      targetUserInfo
    );

    switch (contentsType) {
      case 'NICK_NAME':
        return (
          <DropdownMenu aria-label="Action menu">
            <DropdownItem onClick={onChangeNicknameModalOpen}>
              닉네임 변경
            </DropdownItem>
          </DropdownMenu>
        );
      case 'CHANGE_ROLE':
        return (
          <DropdownMenu aria-label="Action menu">
            {dropdownContents.map((role) => (
              <DropdownItem
                key={role}
                textValue="role"
                onClick={() =>
                  changeUserRole({
                    targetUserId: targetUserInfo.userId,
                    newUserRole: role,
                  })
                }
              >
                {role}로 역할 변경
              </DropdownItem>
            ))}
          </DropdownMenu>
        );
      case 'NONE':
        return null;
      default:
        return null;
    }
  };
  return (
    <Table
      isStriped
      aria-label="Participants table"
      className="min-x-auto min-h-auto max-h-64 overflow-auto"
    >
      <TableHeader className="sticky top-32">
        <TableColumn>NAME</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody>
        {participantsList?.map((participant) => {
          const isDisabled =
            userInfo &&
            getDropdownContents(userInfo, participant).contentsType === 'NONE';
          return (
            <TableRow key={participant.userId}>
              <TableCell>
                <div className="flex items-center gap-1">
                  {participant.nickname}
                  {userInfo?.nickname === participant.nickname && (
                    <Icon name="person" className="text-emerald-600" />
                  )}
                </div>
              </TableCell>
              <TableCell>{participant.role}</TableCell>
              <TableCell>
                <Dropdown>
                  <DropdownTrigger>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      disabled={isDisabled}
                      className="pl-1"
                    >
                      <Icon name="ellipsis" className="size-5" />
                    </Button>
                  </DropdownTrigger>
                  {!isDisabled &&
                    userInfo &&
                    renderDropdownContent(userInfo, participant)}
                </Dropdown>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ParticipantsList;
