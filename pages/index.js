import { useState, useEffect } from "react"
import { API, Storage } from "aws-amplify"
import { listPosts} from "../src/graphql/queries"
import Link from 'next/link'

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(()=>{
    fetchPosts()
  },[])

  async function fetchPosts(){
    const postData = await API.graphql({
      query: listPosts
    });
    const { items } = postData.data.listPosts
      const postWithImages = await Promise.all(
        items.map(async (post) => {
          if (post.coverImage) {
            post.coverImage = await Storage.get(post.coverImage)
          }
          return post
        }))
    setPosts(postWithImages)
  }


  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-8">
      {/* className="text-sky-400 text-3xl font-bold tracking-wide mt-6 mb-2" */}
      posts
      </h1>
       {
        posts.map((post, index) => (
          <Link key={index} href={`/posts/${post.id}`}>
            <div className="my-6 pb-6 border-b border-gray-300">
              {
                post.coverImage && (
                  <img src={post.coverImage}
                  className="w-36 h-36 bg-contain bg-center rounded-full sm:mx-0 sm:shrink-0"/>
                )
              }
              <div className="cursor-pointer mt-2">
                {/* className="cursor-pointer border-b border-gray-300 mt-8 pb-4" */}
                <h2 className="text-xl font-semibold" key={index}>{post.title}</h2>
                <p className="text-gray-500 mt-2">Author: {post.username}</p>
                {
                  post.comments.items.length > 0 && 
                  post.comments.items.map((comment, index) => (
                    <div key={index} className="w-full h-20 p-2 border bg-white rounded 
                      focus:outline-none focus:ring-gray-300 focus:ring-1
                      sm:flex sm-py-1 space-y-2">
                      <div>
                        <p className="text-gray-500 mt-2">
                          {comment.message}
                        </p>
                        <p className="text-blue-400 mt-1">
                          {comment.createdBy}
                        </p>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
            
          </Link>  
        ))
       }
    </div>
   
  )
}
