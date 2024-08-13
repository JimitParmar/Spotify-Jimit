import { SearchIcon } from "./icon";
import React, {useState} from "react";


export function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    console.log("Search Query: ", e.target.value)
    onSearch(e.target.value);
  };
    return (
        <div className="sticky md:absolute md:scale-100 scale-75 ">
          <input type="text" value={query} onChange={handleChange} class="bg-white bg-opacity-15 h-[2.5rem] w-80 md:font-normal font-medium md:text-sm text-md border border-gray-400 text-black md:text-white py-2 px-4 pl-4 rounded-md  placeholder-gray-600 md:placeholder-gray-300 focus:outline-none focus:ring-2 focus:border-transparent" placeholder="Search Song, Artist"/>
          <div className="absolute inset-y-0 left-[18rem]  text-[1.3rem] flex items-center text-gray-600">
            <SearchIcon/>
          </div>
        </div>
      )
}