import './App.css';
import { Next, Pause, Play, Previous, Spotifylogo } from './components/icon';
import { SearchBar } from './components/search';
import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ForYou from './components/forYou';
import TopTracks from './components/topTracks';

export function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bgColor, setBgColor] = useState('#000000');

  const audioRef = useRef(null);

  useEffect(() => {
    fetch('https://cms.samespace.com/items/songs')
      .then(response => response.json())
      .then(data => {
        setSongs(data.data);
        setFilteredSongs(data.data); // Initialize with all songs
      })
      .catch(error => console.error('Error Fetching Data', error));
  }, []);

  useEffect(() => {
    if (selectedSong && audioRef.current) {
      audioRef.current.src = selectedSong.url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    }
  }, [selectedSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current.duration);
      });

      return () => {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('loadedmetadata', () => {
          setDuration(audioRef.current.duration);
        });
      };
    }
  }, [selectedSong]);

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressClick = (e) => {
    const progressBar = e.target;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSongSelect = (song) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      setCurrentTime(0);
      setSelectedSong(song);
      setBgColor(song.accent);
      
      audioRef.current.src = song.url;
      audioRef.current.load();
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    } else {
      setSelectedSong(song);
      setBgColor(song.accent);
    }
  };

  const handleNext = () => {
    if (filteredSongs.length === 0 || !selectedSong) return;

    const currentIndex = filteredSongs.findIndex(song => song.id === selectedSong.id);
    const nextIndex = (currentIndex + 1) % filteredSongs.length;
    const nextSong = filteredSongs[nextIndex];

    handleSongSelect(nextSong);
  };

  const handlePrevious = () => {
    if (filteredSongs.length === 0 || !selectedSong) return;

    const currentIndex = filteredSongs.findIndex(song => song.id === selectedSong.id);
    const prevIndex = (currentIndex - 1 + filteredSongs.length) % filteredSongs.length;
    const prevSong = filteredSongs[prevIndex];

    handleSongSelect(prevSong);
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(error => {
          console.error('Error playing audio:', error);
          setIsPlaying(false);
        });
    }
  };

  const handleSearch = (query) => {
    if (query) {
      const lowercasedQuery = query.toLowerCase();
      const results = songs.filter(song =>
        song.name.toLowerCase().includes(lowercasedQuery) ||
        song.artist.toLowerCase().includes(lowercasedQuery)
      );
      setFilteredSongs(results);
    } else {
      setFilteredSongs(songs); // Reset to all songs when query is cleared
    }
  };

  const location = useLocation();
  const isForYouSelected = location.pathname === '/for-you';
  const isTopTracksSelected = location.pathname === '/top-tracks';

  return (
    <motion.div
      id='bgm'
      className={'max-w-screen h-screen'}
      initial={{ background: 'linear-gradient(to right, #000000, black)' }}
      animate={{ background: `linear-gradient(to right, ${bgColor}, black)` }}
      exit={{ background: 'linear-gradient(to right, #000000, black)' }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div>
        <div className='grid grid-cols-6 gap-16'>
          <div className='grid grid-rows-2'>
            <header className="App-header">
              <div className='py-6 px-6'>
                <Spotifylogo />
              </div>
            </header>
            <div className='absolute bottom-0 mx-4 my-6 text-white'>
              Avatar
            </div>
          </div>
          <div className='mt-6 ml-4 font-semibold col-span-2 text-[1.35rem] text-white'>
            <div className='flex gap-10'>
              <Link
                to="/for-you"
                className={`transition-opacity ${isForYouSelected ? 'opacity-100' : 'opacity-50'}`}
              >
                For You
              </Link>
              <Link
                to="/top-tracks"
                className={`transition-opacity ${isTopTracksSelected ? 'opacity-100' : 'opacity-50'}`}
              >
                Top Tracks
              </Link>
            </div>
            <div className="pt-4">
              <SearchBar onSearch={handleSearch} />
              <Routes>
                <Route path="/" element={<Navigate to="/for-you" />} />
                <Route path="/for-you" element={<ForYou songs={filteredSongs} onSongSelect={handleSongSelect} />} />
                <Route path="/top-tracks" element={<TopTracks songs={filteredSongs} onSongSelect={handleSongSelect} />} />
              </Routes>
            </div>
          </div>
          <div className='font-semibold col-span-3 text-2xl text-white justify-center'>
            {selectedSong && (
              <motion.div
                key={selectedSong.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <h3 className="text-3xl font-semibold pt-12">{selectedSong.name}</h3>
                <p className="text-sm py-1 text-gray-400">{selectedSong.artist}</p>
                <img
                  src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
                  alt={selectedSong.name}
                  className="w-[26rem] h-[26rem] mt-6 rounded-md"
                />
                <div
                  className="mt-4 w-[26rem] h-1.5 bg-gray-600 rounded cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-white rounded"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex mt-8 mx-[7.85rem] items-center">
                  <button onClick={handlePrevious}>
                    <Previous />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="text-white bg-white mx-8 p-3 rounded-full"
                  >
                    {isPlaying ? <Pause /> : <Play />}
                  </button>
                  <button onClick={handleNext}>
                    <Next />
                  </button>
                  <audio
                    ref={audioRef}
                    preload="metadata"
                    onEnded={() => setIsPlaying(false)}
                  />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default App;
