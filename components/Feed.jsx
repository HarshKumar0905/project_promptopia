"use client" 

import {useState, useEffect} from 'react';
import PromptCard from './PromptCard';

const PromptCardList = ({data, handleTagClick}) => {
  return (
    <div className='mt-16 prompt_layout'>
      {
        data.map((post) => (
          <PromptCard key={post._id} post={post}
          handleTagClick={handleTagClick} />))
      }
    </div>
  )
}

const Feed = () => {

  const [searchText, setSearchText] = useState("");
  const [posts, setPosts] = useState([]);
  const [mockPosts, setMockPosts] = useState([]);
  const [optionF, setOptionF] = useState("none");

  const handleSearchChange = async (e) => {
    e.preventDefault();
    setSearchText(e.target.value);

    if(e.target.value === "") {
      setPosts(mockPosts);
      return;
    } 

    const filteredByTag = mockPosts.filter((p) => 
      p.tag.toLowerCase().includes(e.target.value.toLowerCase()));

    const filteredByPrompt = mockPosts.filter((p) => 
      p.prompt.toLowerCase().includes(e.target.value.toLowerCase()));
    
    const filteredByUser = mockPosts.filter((p) => 
      p.creator.username.toLowerCase().includes(e.target.value.toLowerCase()));
    
    console.log("Options : ", optionF);
    if(optionF == "none") 
      return;
    else if(optionF == "prompt")
      setPosts(filteredByPrompt);
    else if(optionF == "tag")
      setPosts(filteredByTag);
    else
      setPosts(filteredByUser);
  }

  const handleTagClick = (tag) => {
    setSearchText(tag);
    setOptionF("tag");
  }

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch("/api/prompt");
      const data = await response.json();
      setPosts(data);
      setMockPosts(data);
    }
    fetchPosts();
  }, []);

  return (
    <section className='feed'>
      <form className='relative w-full md:w-[125%] flex-center gap-2 flex-wrap md:flex-nowrap'>
        <input type="text" placeholder="Search via given filters"
        value={searchText} onChange={handleSearchChange} required 
        className='search_input peer'/>
        
        <p className='text-gray-400 font-bold ml-4'>Filter By : </p>
        <select onChange={(e)=>setOptionF(e.target.value)} value={optionF} className="bg-transparent outline-green-600 
        border-2 border-gray-400 p-2 w-[max(25%,250px)] rounded-md font-bold">
          <option value="none">None</option>
          <option value="prompt">Prompt</option>
          <option value="tag">Tag</option>
          <option value="username">User Name</option>
        </select>
      </form>

      <PromptCardList data={posts} handleTagClick={handleTagClick} />
    </section>
  )
}

export default Feed;