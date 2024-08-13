import React from 'react';

const TopTracks = ({ songs, onSongSelect }) => {
  // Filter top tracks based on the top_track property
  const topTracks = songs.filter(song => song.top_track);

  return (
    <div className='relative mt-16'>
      <ul>
        {topTracks.length === 0 ? (
          <p>No top tracks found</p>
        ) : (
          topTracks.map(song => (
            <li
              key={song.id}
              className="transition-colors mb-4 pt-1 w-[21rem] px-2 py-2 rounded-md hover:bg-white hover:bg-opacity-15"
              onClick={() => onSongSelect(song)}
            >
              <div className="flex items-center">
                <img
                  src={`https://cms.samespace.com/assets/${song.cover}`}
                  alt={song.name}
                  className="w-11 h-11 mr-4 rounded-full"
                />
                <div>
                  <h3 className="text-lg font-normal">{song.name}</h3>
                  <p className="text-xs -mt-[0.1rem] text-gray-400">{song.artist}</p>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default TopTracks;
