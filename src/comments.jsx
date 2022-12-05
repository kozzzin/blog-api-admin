import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

export default function Comments() {
  const [comments,setComments] = useState([]);
  const [editCatId, setEditCatId] = useState('');
  const [newCategoryName,setNewCategoryName] = useState('');
  const categoriesData = useLoaderData();
  useEffect(() => {
    setComments(categoriesData);
  },[]);

  
  async function deleteCat(e) {
    const deleteId = e.target.parentElement.getAttribute('data-id');
    fetch(
      'http://localhost:8888/admin/comments/' + deleteId,
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
      setComments(
        comments.filter(
          cat => cat._id !== deleteId
        )
      )
    })
    .catch(err => console.log(err));
  }

  return (
    <>
      <h1 className="title is-1">Categories</h1>
      <ul className="categories block">
      { comments
        .map(comment => {
          return (
            <li
              id={comment._id}
              key={comment._id}
              className="block">
                <strong>{ comment.text }</strong> 
              <span className="category-buttons">
                (Post: { comment.post.title })
                <a data-id={comment._id} onClick={deleteCat}>
                  <button className="button is-danger">delete</button>
                </a>
              </span>
            </li>
          );
        })
      }
      </ul>
    </>
  )
}
