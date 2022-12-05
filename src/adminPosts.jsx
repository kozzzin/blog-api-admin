import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";
import PostTeaser from "./PostTeaser";

export default function Categories() {
  const [posts,setPosts] = useState([]);
  const [editCatId, setEditCatId] = useState('');
  const [newCategoryName,setNewCategoryName] = useState('');
  const categoriesData = useLoaderData();
  useEffect(() => {
    setPosts(categoriesData);
  },[]);

  console.log(posts);

  function editCat(e) {
    setEditCatId(e.target.parentElement.getAttribute('data-id'));
  }

  async function addNewCategory(e) {
    fetch(
      'http://localhost:8888/admin/categories/',
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        },
        body: JSON.stringify({"name":newCategoryName})  
      }
    )
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setPosts([...posts, data]);
      setNewCategoryName('');
    })
    .catch(err => console.log(err));
  }

  async function deleteCat(e) {
    const deleteId = e.target.parentElement.getAttribute('data-id');
    fetch(
      'http://localhost:8888/admin/categories/' + deleteId,
      {
        method: 'DELETE',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        }
      }
    )
    .then(res => res.json())
    .then(data => {
      console.log(data);
      setPosts(
        posts.filter(
          cat => cat._id !== deleteId
        )
      )
    })
    .catch(err => console.log(err));
  }

  return (
    <>
      <h1 className="title is-1">Manage your blog</h1>
      <h3 className="title is-3">Add new post:</h3>
            <a href="/posts/new" className="block">
              <button className="button is-primary is-medium block">
                Add new post
              </button>
            </a>
            <br/><br/>
            <hr />
      <ul className="categories block">
      { posts
        .map(post => {
          return (
            <li
              id={post._id}
              key={post._id}
              className="block">
              <PostTeaser 
                post={post}
                posts={posts}
                setPosts={setPosts}
              />
            </li>
          );
        })
      }
      </ul>
    </>
  )
}


