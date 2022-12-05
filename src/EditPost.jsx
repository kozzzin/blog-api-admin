import { useEffect, useState, useRef } from "react";
import { useLoaderData } from "react-router-dom";

export default function EditPost(props) {
  // edit mode ? comments and other depends on it
  const { postData, categoriesData } = useLoaderData();
  const [post,setPost] = useState({});
  const [categories,setCategories] = useState([]);
  const [visible,setVisible] = useState(true);
  const [currentCategory, setCurrentCategory] = useState('');


  useEffect(() => {
    if (postData === undefined) {
      setPost({
        'title': '',
        'text': ''
      });
    } else {
      setPost(postData);
      setCurrentCategory(!!postData.category ? postData.category._id : '');
      setVisible(postData.visible);
    }
    setCategories(categoriesData);
  },[]);

  function handleTitleChange(e) {
    setPost({
      ...post,
      title: e.target.value
    });
  }

  function handleTextChange(e) {
    setPost({
      ...post,
      text: e.target.value
    });
  }

  function handleCategoryChange(e) {
    setCurrentCategory(e.target.value);
  }

  function updatePost(e) {
    fetch(
      'http://localhost:8888/admin/posts/' + post._id,
      {
        mode: 'cors',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        },
        body: JSON.stringify(
          {
            ...post,
            category: currentCategory,
            visible: visible
          }
        )
      }
    )
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  }

  function addPost(e) {
    fetch(
      'http://localhost:8888/admin/posts/',
      {
        mode: 'cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        },
        body: JSON.stringify(
          {
            ...post,
            category: currentCategory === '' ? undefined : currentCategory,
            visible: visible
          }
        )
      }
    )
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log(err))
  }

  function handleCheckbox(e) {
    setVisible(!visible);
  }

  return (
    <>
      <h1 className="title is-1">{props.mode === 'edit' ? 'Edit' : 'New'} post</h1>
      <form className="post-form" onSubmit={props.mode === 'edit' ? updatePost : addPost}>
        <label className="label block">
          Title:
          <input
            type="text"
            className="input is-medium block"
            placeholder="Post Title"
            value={post.title || ''}
            onChange={handleTitleChange}
          />
        </label>
        <label className="label block">
          Your text:      
          <textarea
            type="text"
            className="textarea is-medium block"
            placeholder="Post Text"
            value={post.text || ''}
            onChange={handleTextChange}
          />
        </label>
        <label className="label block">
          Category:<br />
          <select
            value={currentCategory}
            onChange={handleCategoryChange}
            className="select is-medium block"
          >
          <option value=''>Select category</option>
          {
            categories.map(
              (cat) => {
                return (
                  <option
                    key={cat._id}
                    value={cat._id}
                  >
                      { cat.name }
                  </option>
                );     
              }
            )
          }

          </select>
        </label>
        <label className="label visible">
          Visible: <input 
            className="checkbox is-medium"
            type="checkbox"
            checked={visible}
            onChange={handleCheckbox}
          />
        </label>

        <input
          type="submit"
          className="button is-medium is-info"
          value={ props.mode === 'edit' ? 'Save' : 'Post'}
        />
      </form>
    </>
  )
}