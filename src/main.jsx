import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css';
import LoginForm from './login';
import Categories from './categories';
import AdminPosts from './adminPosts';
import EditPost from './EditPost';
import Comments from './comments';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  useLoaderData
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <p>Horror, it's error!</p>,
    children: [
      {
        path: '/',
        element: <AdminPosts />,
        loader: async function() {
          return fetch(
            `http://localhost:8888/admin/posts`,
            {
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
              }
            }
          ).then(res => res.json());
        }
      },
      {
        path: '/comments',
        element: <Comments />,
        loader: async function() {
          return fetch(
            `http://localhost:8888/admin/comments`,
            {
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
              }
            }
          ).then(res => res.json());
        }
      },
      {
        path: '/login',
        element: <LoginForm />,
      },
      {
        path: '/categories',
        element: <Categories />,
        loader: async function() {
          return fetch(
            'http://localhost:8888/admin/categories',
            {
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
              }
            }
          ).then(res => res.json());
        }
      },
      {
        path: '/posts/new',
        element: <EditPost mode='new' />,
        loader: async function() {
          return fetch(
            'http://localhost:8888/admin/categories',
            {
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
              }
            }
          )
          .then(res => res.json())
          .then(cats => {
            return { categoriesData: cats }
          });
        }
      },
      {
        path: '/posts/:id/edit',
        element: <EditPost mode='edit' />,
        loader: async function({ params }) {
          const post = fetch(
            `http://localhost:8888/admin/posts/${params.id}`,
            {
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
              }
            }
          ).then(res => {
            console.log('posts');
            return res.json()
          });

          const categories = fetch(
            `http://localhost:8888/admin/categories`,
            {
              mode: 'cors',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + window.localStorage.getItem('token')
              }
            }
          ).then(res => {
            console.log('categories');
            return res.json()
          });

          return Promise
            .all([post,categories])
            .then(result => {
              console.log(result);
              return { 
                postData: result[0],
                categoriesData: result[1]
              }
            })
        }
      },
      
    ]
  },

]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
