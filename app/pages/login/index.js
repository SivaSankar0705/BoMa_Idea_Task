import React, {useState} from 'react';
import styles from '../../src/styles/Home.module.css'
import {apiCall} from '../../src/common/apiRoutes'

const url = 'http://localhost:5000';
const Login = () => {
  const [id, setId]=useState(null);
  const [projNm, setprojNm]=useState(null)
  const [projStat, setIdprojStat]=useState(null)
    const submit=async()=>{
        const res = await apiCall(url+'/getproject/'+id, 'GET');
        console.log(res);
    }
    const create=async()=>{
      console.log(id)
      const data = {
          id:id,
          proNm :   projNm,
          projStat: projStat
      };
      const res = await apiCall(url+'/checkpermission', 'POST',data);
      console.log(res);
  }
    return (
      <div className={styles.container}>
        <div className={styles.login}>
          <input type='number' className={styles.input} onChange={(e)=>setId(e.target.value)} />
          <button type='submit' onClick={()=>submit()}>Login</button>
        </div>
        <div>
        <input type='number' className={styles.input} onChange={(e)=>setId(e.target.value)} />
          <input type='string' className={styles.input} onChange={(e)=>setprojNm(e.target.value)} />
          <input type='string' className={styles.input} onChange={(e)=>setIdprojStat(e.target.value)} />
          <button type='submit' onClick={()=>create()}>Create</button>
        </div>
      </div>
  
    );
}
export default Login;

export async function createUser(data) {
  const response = await fetch(url+`/api/user`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({user: data})
    })
  return await response.json();
}