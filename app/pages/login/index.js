import React, {useState} from 'react';
import styles from '../../src/styles/Home.module.css'
import {apiCall} from '../../src/common/apiRoutes'
import { useRouter } from 'next/router'

const Login = () => {
  const [id, setId]=useState(null);
  const router = useRouter()
    const submit=async()=>{
      try{
        const res = await apiCall('http://localhost:5000/checkpermission', 'POST', {id: parseInt(id)});
        console.log(res);
        if(res?.data){
          localStorage.setItem('access', JSON.stringify(res?.data))
          router.push('/project')
        }else{
          alert("you don't have a access")
        }
        
      }catch(err){
        alert(err?.data)
      }
    }
   
    return (
      <div className={styles.container}>
        <div className={styles.loginBg}>
          <div className={styles.loginInnerDiv}>
            <h2>Login</h2>
          <input type='number' className={styles.input} onChange={(e)=>setId(e.target.value)} />
          <button type='submit' onClick={()=>submit()}>Login</button>
          </div>      
        </div>
      </div>
  
    );
}
export default Login;