import './App.css';
import { Next, Pause, Play, Previous, Spotifylogo, MenuIcon, SoundIcon, MuteIcon} from './components/icon';
import { SearchBar } from './components/search';
import React, { useEffect, useState, useRef } from 'react';
import { motion } from "framer-motion";
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import ForYou from './components/forYou';
import TopTracks from './components/topTracks';
import LoadingList from './components/listLoading';

export function App() {
  const [songs, setSongs] = useState([]);
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [duration, setDuration] = useState(0);
  const [bgColor, setBgColor] = useState('#000000');
  const [isMenuOpen, setIsMenuOpen] = useState(window.innerWidth < 768); // State for menu toggle
  const [isLoading, setIsLoading] = useState(true);

  const audioRef = useRef(null);

  
  useEffect(() => {
    fetch('https://cms.samespace.com/items/songs')
      .then(response => response.json())
      .then(data => {
        setSongs(data.data);
        setFilteredSongs(data.data);
        setIsLoading(false);
      })
      .catch(error => console.error('Error Fetching Data', error));
      setIsLoading(false)
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
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMenuOpen(window.innerWidth < 768); // Update menu state based on screen size
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const toggleMute = () => {
    setIsMuted(prev => !prev);
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
      setFilteredSongs(songs);
    }
  };

  const location = useLocation();
  const isForYouSelected = location.pathname === '/for-you';
  const isTopTracksSelected = location.pathname === '/top-tracks';
  return (
    <motion.div
      id='bgm'
      className={`min-w-screen min-h-screen overflow-y-scroll ${isMenuOpen ? 'overflow-hidden' : ''}`} // Hide overflow when menu is open
      initial={{ background: 'linear-gradient(to right, #000000, black)' }}
      animate={{ background: `linear-gradient(to right, ${bgColor}, black)` }}
      exit={{ background: 'linear-gradient(to right, #000000, black)' }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      <div className={`grid md:grid-cols-6 md:gap-16 ${isMenuOpen ? 'grid-cols-1' : 'grid-cols-6'}`}> {/* Adjust grid for menu */}
        <div className='relative'>
            <div className='md:py-6 md:px-6 py-3 scale-75 md:scale-100'>
              <Spotifylogo />
            </div>
          
        </div>
        
        <div className={`md:mt-6 md:ml-4 font-semibold md:col-span-2 text-[1.35rem] text-white hidden md:block ${isMenuOpen ? 'hidden' : 'block'}`}>
          <div className='flex gap-10'>
            <Link
              to="/for-you"
              className={`transition-opacity text-lg md:text-2xl ${isForYouSelected ? 'opacity-100' : 'opacity-50'}`}
            >
              For You
            </Link>
            <Link
              to="/top-tracks"
              className={`transition-opacity text-lg md:text-2xl  ${isTopTracksSelected ? 'opacity-100' : 'opacity-50'}`}
            >
              Top Tracks
            </Link>
          </div>
          <div className="md:pt-4">
            <SearchBar onSearch={handleSearch} />

            {isLoading ? (
              <LoadingList/>
            ):(
            <Routes>
              <Route path="/" element={<Navigate to="/for-you" />} />
              <Route path="/for-you" element={<ForYou songs={filteredSongs} onSongSelect={handleSongSelect} />} />
              <Route path="/top-tracks" element={<TopTracks songs={filteredSongs} onSongSelect={handleSongSelect} />} />
            </Routes>
          )}
          </div>
        </div>
        {/* Drawer for Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex  justify-center items-center">
            <div className="bg-white p-6 rounded-lg w-80 max-w-full h-4/5 overflow-y-auto overflow-x-clip">
              <button
                className="absolute top-4 right-4 text-white text-2xl"
                onClick={() => setIsMenuOpen(false)}
                disabled={!isPlaying}
              >
                &times;
              </button>
              
              <Link
              to="/for-you"
              className={`transition-opacity font-semibold text-xl md:text-2xl pr-4 ${isForYouSelected ? 'opacity-100' : 'opacity-50'}`}
            >
              For You
            </Link>
            <Link
              to="/top-tracks"
              className={`transition-opacity font-semibold text-xl md:text-2xl  ${isTopTracksSelected ? 'opacity-100' : 'opacity-50'}`}
            >
              Top Tracks
            </Link>
            <div className='max-w-20 mt-2 -ml-2.5 text-black'>
              <SearchBar onSearch={handleSearch} />
              </div>
            <div className="md:pt-4">
            {isLoading ? (
              <LoadingList/>
            ):(
            <Routes>
              <Route path="/for-you" element={<ForYou songs={filteredSongs} onSongSelect={handleSongSelect} />} />
              <Route path="/top-tracks" element={<TopTracks songs={filteredSongs} onSongSelect={handleSongSelect} />} />
            </Routes>
            )}
          </div>
            </div>
          </div>
        )}
        {/* Main Content */}
        <div className={`font-semibold md:col-span-3 col-span-6 mx-12 md:pt-4 pt-6 text-2xl text-white items-center `}>
          {selectedSong && (
            <><motion.div
              className=''
              key={selectedSong.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            >
              <h3 className="md:text-3xl text-4xl font-semibold pt-12">{selectedSong.name}</h3>
              <p className="md:text-sm text-xl md:py-1 py-2 text-gray-400">{selectedSong.artist}</p>
              <img
                src={`https://cms.samespace.com/assets/${selectedSong.cover}`}
                alt={selectedSong.name}
                className="object-fill md:object-fill flex md:w-[26rem] md:h-[26rem] justify-center w-[20rem] h-[16rem] md:mt-6 mt-3 rounded-md" />
            </motion.div>
            <div
              className="mt-6 mb-4 md:w-[26rem] w-[18.4rem] h-1.5 bg-gray-600  rounded cursor-pointer"
              onClick={handleProgressClick}
            >
                <div
                  className="h-full bg-white rounded "
                  style={{ width: `${(currentTime / duration) * 100}%` }} />
              </div>
              <div className="grid grid-cols-4 md:grid-cols-3 mx-auto md:mx-[6rem] gap-4 md:gap-8 w-[16rem] mt-4">
                <div className='flex justify-left md:absolute md:-ml-[5rem] -ml-[1rem] text-white text-2xl'>
                  <button
                    className="md:flex-none text-white bg-white bg-opacity-15 md:disabled:cursor-not-allowed md:disabled:opacity-80 scale-90 md:scale-90 p-3 rounded-full"
                    onClick={() => setIsMenuOpen(prev => !prev)}
                    disabled={window.innerWidth >= 768}
                    
                  >
                    <MenuIcon /> {/* Add a Menu Icon */}
                  </button>
                </div>
                <div className='flex col-span-2 md:absolute md:ml-[2rem] justify-center md:scale-100 scale-90'>
                  <button onClick={handlePrevious}>
                    <Previous />
                  </button>
                  <button
                    onClick={togglePlayPause}
                    className="text-white bg-white md:mx-8 mx-6 p-3  rounded-full">
                    {isPlaying ? <Pause /> : <Play />}
                  </button>
                  <button onClick={handleNext}>
                    <Next />
                  </button>
                </div>
                <div className='flex justify-end md:absolute md:ml-[16rem] -mr-[1rem]'>
                  <button
                    onClick={toggleMute}
                    className="text-white  bg-white bg-opacity-15 p-3 md:scale-90 scale-90 rounded-full">
                    {isMuted ? (
    <span role="img" aria-label="Unmute"><MuteIcon/></span> // Or use an icon component for unmuted state
  ) : (
    <span role="img" aria-label="Mute"><SoundIcon/></span> // Or use an icon component for muted state
  )}
                  </button>
                </div>
              </div><audio
                ref={audioRef}
                preload="metadata"
                onEnded={() => setIsPlaying(false)} /></>
            
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default App;
