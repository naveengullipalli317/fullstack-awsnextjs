import {API, Storage} from 'aws-amplify'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ReactMarkDown from 'react-markdown'
import'../../configureAmplify'
//import { updatePost } from '../../src/graphql/mutations'
import { listPosts, getPost } from '../../src/graphql/queries'
import { creteComment } from "../../src/graphql/mutations"
import dynamic from "next/dynamic";
const SimpleMDE = dynamic(() => import("react-simplemde-editor"),
    {
    ssr:false,
    });

const intialState = {message: ""}

export default function Post({ post }) {
    const [coverImage, setCoverImage] = useState(null);
    const [comment, setComment ] = useState(intialState)
    const [showMe, setShowMe] = useState(false)

    function toggle () {
        setShowMe(!showMe)
    }

    useEffect(() => {
        updateCoverImage()
    }, [])
    async function updateCoverImage() {
        if (post.coverImage) {
            const imageKey = await Storage.get(post.coverImage)
            setCoverImage(imageKey)
        }
    }

    const router= useRouter()
    if (router.isFallback) {
        return <div>Loading......</div>
    }

    return (
        <div>
            <h1 className='text-5xl mt-4 font-semibold tracing-wide'>
                {post.title}
            </h1>
            {
                coverImage && (
                    <img src={coverImage} className= "mt-4"/>
                )
            }
            <p className='text-sm font-light my-4'> By {post.username}</p>
            <div className='mt-8'>
                <ReactMarkDown className="prose"
                children={post.content}/>
            </div>
            <div>
                <button type="button" className="mb-4 bg-green-600 text-white
                font-semibold px-8 py-2 rounded-lg" onClick={toggle}>Write a Comment </button>

                {
                    <div
                        style={{display: showMe ? "block" : "none"}}>
                        <SimpleMDE value= ""/>
                        <button type="button" className="mb-4 bg-green-600 text-white
                font-semibold px-8 py-2 rounded-lg">Save</button>
                    </div>

                }
            </div>
        </div>
    )
}

export async function getStaticPaths() {
    const postData = await API.graphql({
        query: listPosts
    })

    const paths = postData.data.listPosts.items
    .map((post) => ({params: {id: post.id}}))
    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps({ params }) {
    const {id} = params
    const postData = await API.graphql({
        query: getPost,
        variables: {id}
    })
    return {
        props: {
            post: postData.data.getPost
        },
        revalidate: 1
    }
}