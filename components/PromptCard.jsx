"use cleint"

import { useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const PromptCard = ({post, handleTagClick, handleEdit, handleDelete}) => {

  const {data : session} = useSession();
  const pathName = usePathname();
  const router = useRouter();
  const [copied, setCopied] = useState("");

  const handleCopy = () => {
    setCopied(post.prompt);
    navigator.clipboard.writeText(post.prompt);
    setTimeout(() => setCopied(""), 3000);
  }

  const handleClick = () => {
    if (post.creator._id === session?.user.id) 
      return router.push("/profile");
    router.push(`/profile/${post.creator._id}?name=${post.creator.username}`);
  }

  return (
    <div className="prompt_card">
      <div className="flex justify-between items-start gap-5">

        <div className="flex justify-start items-center 
        gap-3 cursor-pointer" onClick={handleClick}>
          <Image src={post.creator.image} alt="user_image" width={40} 
          height={40} className="rounded-full object-contain"/>

          <div className="flex flex-col">
            <h3 className="font-satoshi font-semibold text-gray-900">
              {post.creator.username}
            </h3>
            <p className="font-inter text-sm text-gray-500">
              {post.creator.email}
            </p>
          </div>
        </div>

        <div className="copy_btn" onClick={handleCopy}>
          <Image src={copied === post.prompt ? '/assets/icons/tick.svg' : 
          '/assets/icons/copy.svg'} width={12} height={12} alt=""/> 
        </div>
      </div>

      <p className="my-4 font-satoshi text-sm text-gray-700">
        {post.prompt}
      </p>
      <div className="flex gap-2 flex-wrap">
      {
        post.tag.split(" ").map((tag) => {
          return (
            <p className="font-inter text-sm blue_gradient cursor-pointer"
            onClick={() => handleTagClick && handleTagClick(post.tag)}>
              {tag}
            </p>
          )
        })
      }
      </div>
      
      {session?.user.id === post.creator._id && pathName === "/profile" &&
        <div className="mt-5 flex-center gap-4 border-t-2 pt-3">
          <button className="text-sm green_gradient cursor-pointer border-2 border-blue-300 
          p-2 rounded-full w-24 text-center hover:scale-110 transition ease-in-out delay-100"
          onClick={handleEdit}>
            Edit
          </button>
          <button className="text-sm orange_gradient cursor-pointer border-2 border-blue-300
          p-2 rounded-full w-24 text-center hover:scale-110 transition ease-in-out delay-100"
          onClick={handleDelete}>
            Delete
          </button>
        </div>
      }
    </div>
  )
}

export default PromptCard;