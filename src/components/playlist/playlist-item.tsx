'use client';

import { useRef } from 'react';
import { Image } from '@nextui-org/react';
import Icon from '@/assets/icon';
import { useDrag, useDrop } from 'react-dnd';
import useReorderPlaylist from '@/hooks/use-reorder-playlist';

interface IPlaylistItemProps {
  videoNumber: number;
  videoTitle: string;
  thumbnail: string;
  channelTitle: string;
  userHasVideoEditPermission: boolean | undefined;
  handlePlaylistDelete: (videoNumber: number) => void;
  findPlaylistItemIdx: (videoNumber: number) => number;
  movePlaylistItem: (dragIndex: number, hoverIndex: number) => void;
}

const PlaylistItem = ({
  videoNumber,
  videoTitle,
  thumbnail,
  channelTitle,
  userHasVideoEditPermission,
  handlePlaylistDelete,
  findPlaylistItemIdx,
  movePlaylistItem,
}: IPlaylistItemProps) => {
  const { mutate: reorderPlaylist } = useReorderPlaylist();

  const originalIdx = findPlaylistItemIdx(videoNumber);

  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLLIElement>(null);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: 'PLAYLIST_ITEM',
      item: { videoNumber, originalIdx },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { videoNumber: draggedVideoNumber, originalIdx } = item;

        const didDrop = monitor.didDrop();
        if (!didDrop) {
          movePlaylistItem(draggedVideoNumber, originalIdx);
        } else if (didDrop) {
          if (originalIdx === findPlaylistItemIdx(draggedVideoNumber)) {
            return;
          }
          reorderPlaylist(
            {
              from: originalIdx,
              to: findPlaylistItemIdx(draggedVideoNumber),
            },
            {
              onError: () => {
                movePlaylistItem(draggedVideoNumber, originalIdx);
              },
            }
          );
        }
      },
    }),
    [originalIdx, movePlaylistItem]
  );

  const [, drop] = useDrop(
    () => ({
      accept: 'PLAYLIST_ITEM',
      hover({ videoNumber: draggedVideoNumber }: { videoNumber: number }) {
        const overIdx = findPlaylistItemIdx(videoNumber);
        if (draggedVideoNumber !== videoNumber) {
          movePlaylistItem(draggedVideoNumber, overIdx);
        }
      },
    }),
    [videoNumber, movePlaylistItem]
  );

  drag(dragRef);
  preview(drop(dropRef));

  return (
    <li
      key={videoNumber}
      className={`flex cursor-default pl-4 pt-1 pb-1 ${
        isDragging ? 'opacity-0' : 'opacity-100'
      }`}
      ref={dropRef}
    >
      <div className="flex gap-4 items-center w-full">
        <div
          ref={dragRef}
          className={`${
            !userHasVideoEditPermission ? 'pointer-events-none' : ''
          }`}
        >
          <Icon
            name="gripLines"
            className={`${
              userHasVideoEditPermission ? 'cursor-pointer' : 'text-gray-400'
            }`}
          />
        </div>

        <Image className="size-6" alt="썸네일" src={thumbnail} />
        <div className="flex justify-between items-center gap-2">
          <div className="flex flex-col">
            <span className="text-bold text-xs whitespace-normal w-40">
              {videoTitle}
            </span>
            <span className="text-tiny text-default-400 truncate">
              {channelTitle}
            </span>
          </div>
          <div className="flex gap-2 pl-7">
            <button
              disabled={!userHasVideoEditPermission}
              onClick={() => handlePlaylistDelete(videoNumber)}
            >
              <Icon
                name="trashCan"
                className={`${
                  !userHasVideoEditPermission ? 'text-gray-400' : null
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </li>
  );
};

export default PlaylistItem;
