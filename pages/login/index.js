import React, {useState} from 'react';
import styles from '../../src/styles/Home.module.css'
import {apiCall} from '../../src/common/apiRoutes'
const Login = () => {
  const [id, setId]=useState(null)
    const submit=async()=>{
        const res = await apiCall('/get/'+id, 'GET');
        console.log(res);
    }
    return (
      <div className={styles.container}>
      <div className={styles.login}>
        <input type='number' className={styles.input} onChange={(e)=>setId(e.target.value)} />
        <button type='submit' onClick={()=>submit()}>Login</button>
      </div>
    </div>
    );
}
export default Login;