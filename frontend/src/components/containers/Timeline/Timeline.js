import React, { Fragment, useEffect, useCallback, useState } from 'react';
import Header from '../../Header/Header';
import Post from '../../Post/Post';
import { Container } from '@material-ui/core';
import Upload from '../../Upload/Upload'
import './Timeline.css';
import { getPost } from '../../../services/post';
const Timeline = ()=> {
    const [posts, setPosts] = useState([]);

    const fetchPosts = useCallback(
        async () => {
            const response = await getPost();
            setPosts(response.data);
            console.log(response);
        },
        [],
    )

    useEffect(()=>{
        fetchPosts();
    }, [fetchPosts]);

    return(
        <Fragment>
            <Header />
            <Container className="timeline">
                <Upload />
                {
                    posts.map(post => {
                        return (
                            <Post key={post._id} post={post}/>
                        )
                    })
                }
            </Container>
        </Fragment>
    );
};

export default Timeline;