import { useEffect, useState } from "react";
import * as React from "react";


export default function LoginForm() {
  const [user,setUser] = useState({username: "", password: ""});
  const [success,setSuccess] = useState(false);

  function sendData(e) {
    e.preventDefault();
    console.log(user);
    console.log(JSON.stringify(user));
    fetch(
      'http://localhost:8888/admin/login',
      {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      }
    )
    .then(res => res.json())
    .then(data => {
      console.log(data.token);
      setSuccess(true);
      window.localStorage.setItem('token',data.token)
    })
    .catch(err => console.log(err));
  } 

  return (
    <>
      <h1 className="title is-1">Login</h1>
      {
        success ?
        'Congratulations' :
        <form onSubmit={sendData}>
          <div className="field">
            <label className="label">Name</label>
            <div className="control">
              <input
                className="input is-medium"
                type="text"
                name="username"
                placeholder="user"
                value={user.username}
                onChange={e => setUser({...user, username:e.target.value})}
                />
            </div>
          </div>
          <div className="field">
            <label className="label">Password</label>
            <div className="control">
              <input 
                className="input is-medium"
                type="password"
                name="password"
                placeholder="password" 
                value={user.password}
                onChange={e => setUser({...user, password:e.target.value})}
              />
            </div>
          </div>
          <input type="submit" className="button is-info" value="login" />
        </form>
      }
    </>
  );
}