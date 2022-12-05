import { useEffect, useState } from "react";
import * as React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar(props) {
  const [loggedIn,setLoggedIn] = useState(0);

  useEffect(() => {
    setLoggedIn(!!window.localStorage.getItem('token'));
  },[]);

  function logOut() {
    window.localStorage.clear();
    setLoggedIn(false);
  }

  return (
    <>
    <nav className="blog-navbar" role="navigation" aria-label="main navigation">
      <a href="/"><h4 className="site-name">Admin panel</h4></a>

      <NavLink to='/' >Posts</NavLink>
      <NavLink to='comments'>Comments</NavLink>
      <NavLink to='categories'>Categories</NavLink>

      <div className="buttons nav-butt">
        { !loggedIn ? 
          <>
            <a href="/login" className="button is-light">
              Log in
            </a>
          </> : 
          <>
            <a href="#" onClick={logOut} className="button is-danger">
              Log Out
            </a>
          </>
        }
      </div>
    </nav>
    </>
  );
}