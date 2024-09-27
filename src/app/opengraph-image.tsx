import { ImageResponse } from 'next/og';

export const size = {
  width: 1200,
  height: 630,
};

const getOpenGraphImage = async () => {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 48,
          background: 'white',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        You-Together 친구와 함께 youtube 시청
      </div>
    ),
    {
      ...size,
    }
  );
};

export default getOpenGraphImage;
