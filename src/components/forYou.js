import React from 'react';

const ForYou = ({ songs, onSongSelect }) => {
  return (
    <div className='relative mt-16'>
      <ul>
        {songs.length === 0 ? (
          <p>No songs found</p>
        ) : (
          songs.map(song => (
            <li
              key={song.id}
              className="transition-colors mb-4 pt-[0.15rem] w-[21rem] px-2 py-2 rounded-md hover:bg-white hover:bg-opacity-15"
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

export default ForYou;
