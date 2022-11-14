import { Auth, API } from "aws-amplify";
import { useEffect, useState } from "react";
import { postsByUsername } from "../src/graphql/queries";
import Link from "next/link"
import Moment from 'moment'
import { deletePost as deletePostMutation} from "../src/graphql/mutations"

export default function MyPosts() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        fetchPosts()
    }, [])

    async function fetchPosts() {
        //const { username } = await Auth.currentAuthenticatedUser()
        // // const { username } = await Auth.currentAuthenticatedUser();
        const user = await Auth.currentAuthenticatedUser()
        const username = `${user.attributes.sub}::${user.username}`
        

        const postData = await API.graphql({
            query: postsByUsername,
            variables: {username}
        })
        setPosts(postData.data.postsByUsername.items)
    }
    
    async function deletePost(id) {
        await API.graphql({
            query: deletePostMutation,
            variables: {input: {id}},
            authMode: "AMAZON_COGNITO_USER_POOLS",
        })
        fetchPosts()
    }

    return (
        <div>
            {/* <h1 className="py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex
        sm:items-center sm:space-y-0 sm:space-x-6 mb-2"
            className="text-3xl font-semibold tracking-wide mt-6 mb-2"> My Posts</h1> */}
            {
                posts.map((post, index) => (
                    // <Link key={index}
                    // href={`/posts/${post.id}`}>
                    //     <div className="cursor-pointer border-b border-gray-300
                    //     mt-8 pb-4">
                    //         <h1 className="text-xl font-semibold">
                    //             {post.title}
                    //         </h1>
                    //         <p className="text-gray-500 mt-2">Author: {post.username}</p>
                    //     </div>
                
                    // </Link>
                    <div key={index} className="py-8 px-8 max-w-xxl mx-auto bg-white rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex
                        sm:items-center sm:space-y-0 sm:space-x-6 mb-2">
                        <div className="text-center space-z-2 sm:text-left">
                            <div className="space-y-0.5">
                                <p className="text-lg text-black font-semibold">{post.title}</p>
                                <p className="text-slate-500 font-medium">
                                    Created on: {Moment(post.createdAt).format("dd, MMM hh:mm a")}
                                </p>
                            </div>
                            <div className="sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-1">
                                <p className="py-2 px-4 bg-blue-300 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"                 
                                ><Link href={`/edit-post/${post.id}`}>Edit Post</Link></p>
                                <p className="py-2 px-4 bg-blue-300 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-7"
                                ><Link href={`/posts/${post.id}`}>View Post</Link></p>
                                <button className="py-2 px-4 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-white-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                                onClick={() => deletePost(post.id)}>
                                    Delete Post
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}