import { useEffect, useState } from "react";
import { useLoaderData } from "react-router-dom";

export default function Categories() {
  const [categories,setCategories] = useState([]);
  const [editCatId, setEditCatId] = useState('');
  const [newCategoryName,setNewCategoryName] = useState('');
  const categoriesData = useLoaderData();
  useEffect(() => {
    setCategories(categoriesData);
  },[]);

  console.log(categories);

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
      setCategories([...categories, data]);
      setNewCategoryName('');
    })
    .catch(err => console.log(err));
  }


  function handleNameChange(e) {
    setNewCategoryName(e.target.value);
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
      setCategories(
        categories.filter(
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
      { categories
        .map(cat => {
          if (cat._id === editCatId) {
            return (
              <EditCategory 
                categories={categories}
                setCategories={setCategories}
                setEditCatId={setEditCatId}
                key={cat._id}
                catId={cat._id}
                name={cat.name}  
              />
            ); 
          }
          return (
            <li
              id={cat._id}
              key={cat._id}
              className="block">
              <a href={`/categories/${cat._id}`}>
                { cat.name } ({ cat.postsCount })
              </a>
              <span className="category-buttons">
                <a data-id={cat._id} onClick={editCat}>
                  <button className="button is-warning">edit</button>
                </a>
                <a data-id={cat._id} onClick={deleteCat}>
                  <button className="button is-danger">delete</button>
                </a>
              </span>
            </li>
          );
        })
      }
        <li className="new-category">
          <h3 className="title is-3">Add new category:</h3>
          <input type="text" className="input is-medium block" placeholder="Add new category" value={newCategoryName} onChange={handleNameChange} />
          <input type="submit" value="add" onClick={addNewCategory} className="button is-primary is-medium"/>
        </li>
      </ul>
    </>
  )
}


function EditCategory(props) {
  const [categoryName,setCategoryName] = useState(0);

  useEffect(() => {
    setCategoryName(props.name);
  },[]);

  function editCategory(e) {
    setCategoryName(e.target.value);
    console.log(categoryName);
  }

  async function saveEdit(e) {
    fetch(
      'http://localhost:8888/admin/categories/' + props.catId,
      {
        method: 'PUT',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + window.localStorage.getItem('token')
        },
        body: JSON.stringify({"name":categoryName})
      }
    )
    .then(res => res.json())
    .then(data => {
      console.log(data);
      props.setEditCatId(0);
      props.setCategories(
        props.categories.map(
          (cat) => {
            if (cat._id == data._id) {
              return {
                ...cat,
                name: categoryName
              }
            }
            return cat;
          }
        )
      )
    })
    .catch(err => console.log(err));
  }

  return (
    <>
      <li className="block">
        <input type="text" className="input is-medium edit-field" value={categoryName} onChange={editCategory} />
        <input type="submit" value="save" onClick={saveEdit} className="button is-primary is-medium edit-button"/>
      </li>
    </>
  )
}