import { useState, useEffect } from 'react';
export default function PostTeaser(props) {
  const [commentsCount,setCommentsCount] = useState(0);
  const [visible,setVisible] = useState(true);
  useEffect(() => {
    fetch(`http://localhost:8888/comment/${props.post._id}`)
    .then(response => response.json())
    .then(comments => {
      setCommentsCount(comments.length)
    })
    .catch(err => console.log(err));
  },[]);

  useEffect(() => {
    setVisible(props.post.visible);
  },[]);


  function deletePost(e) {
    const posts = props.posts;
    const setPosts = props.setPosts;
    console.log(setPosts);
    fetch(
      'http://localhost:8888/admin/posts/' + props.post._id,
      {
        mode: 'cors',
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }
      }
    )
    .then(res => res.json())
    .then(data => {
      setPosts(
        posts.filter(
          post => {
            return post._id !== props.post._id
          }
        )
      )
    })
    .catch(err => console.log(err));
  }
 

  function handleChangeVisibility(e) {
    fetch(
      'http://localhost:8888/admin/posts/' + props.post._id,
      {
        mode: 'cors',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        },
        body: JSON.stringify(
          {
            visible: !visible
          }
        )
      }
    )
    .then(res => res.json())
    .then(data => {
      console.log(!visible);
      setVisible(!visible);
    })
    .catch(err => console.log(err));
  }
 
  return (
    <div className='blog-post'>
      <h3 className='title is-3'>{props.post.title}</h3>
      <h4 className='subtitle is-4'>{props.post.teaser}</h4>
      <ul className='post-info block'>
        <li>Author: {props.post.author ? props.post.author.username : 'Admin'}</li>
        <li>Category: {props.post.category ? props.post.category.name : 'No category'}</li>
        <li>Posted: {new Date(props.post.createdAt).toLocaleString()}</li>
        <li>Comments: { commentsCount }</li>
      </ul>
      <span className="category-buttons">
        {
          visible ?
            <button data-visible={visible} onClick={handleChangeVisibility} className="button is-info">hide</button> :
            <button data-visible={visible} onClick={handleChangeVisibility} className="button is-primary">publish</button>
        }
        <a href={`/posts/${props.post._id}/edit`} data-id={props.post._id}>
          <button className="button is-warning">edit</button>
        </a>
        <a data-id={props.post._id} onClick={deletePost}>
          <button className="button is-danger">delete</button>
        </a>
      </span>
    </div>
  );
}