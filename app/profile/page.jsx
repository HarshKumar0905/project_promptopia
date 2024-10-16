"use client";

import {useState, useEffect} from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

import ProfileBuilder from '@components/ProfileBuilder';

const Profile = () => {

  const router = useRouter();
  const {data : session} = useSession();
  const [posts, setPosts] = useState();

  useEffect(() => {
    const fetchPosts = async () => {
    const response = await fetch(`/api/users/${session?.user.id}/posts`);
    const data = await response.json();
    setPosts(data);
    }
    
    if(session?.user.id)
      fetchPosts();
    }, [session]);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  }
  const handleDelete = async (post) => {
    const hasConfirmed = confirm("Are you sure you want to delete this prompt");

    if(hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method : "DELETE"
        });

        const filtetredPosts = posts.filter((p) => p._id !== post._id);
        setPosts(filtetredPosts);
      } catch (error) {
        console.log(error);
      }
    }
  } 

  return (
    <ProfileBuilder name="My" 
    desc="Welcome to your personalized profile page"
    data={posts}
    handleEdit={handleEdit}
    handleDelete={handleDelete} />
  )
}

export default Profile;