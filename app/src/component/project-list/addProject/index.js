import React, {useState, useEffect} from 'react';
import styles from './addProject.module.css'
import { apiCall } from '../../../common/apiRoutes';

const AddProject = ({user, close, isEdit, object}) => {
  const [field, setField]=useState(null)
  const [error, setError]=useState(null)

    const onHandleChange=(e)=>{
        setField({...field,[e.target.name]: e.target.value})
    }

    useEffect(()=>{
        if(isEdit){
            setField({...object})
        }
    },[object, isEdit])

    const validation=()=>{
        const values =  {...field};
        const errors ={}
        let vaild = true;
        if(!values['name']){
            errors.name = 'Please enter the name'
            vaild = false
        }
        if(!values['state']){
            errors.state = 'Please select the state'
            vaild = false
        }
        setError({...errors})
        return vaild
    }
     const onSumbit=async()=>{
        if(validation()){
            const res = isEdit ?  await apiCall('http://localhost:5000/updateProject', 'PUT', {...field, user_id:user}) : await apiCall('http://localhost:5000/createProject', 'POST', {...field, user_id:user});
            if(res){
                close()
            }
        }
     }
    return ( 
      <div className={styles.modal}>
        <div className={styles.modalBg}>
            <button className={styles.close} onClick={close}>X</button>
          <div className={styles.modalInnerDiv}>
            <h2>{isEdit ? 'Edit' : 'Add'} Project</h2>
             <input type='text' name='name' className={styles.input} value={field?.name} onChange={(e)=>onHandleChange(e)} />
             {error?.name && <label className={styles.error}>{error?.name}</label>}
           <select name='state' onChange={(e)=>onHandleChange(e)} value={field?.state}><option  value=''>Select Option</option><option value='Open'>Open</option><option value='Closed'>Closed</option><option value='Propose'>Propose</option></select>
           {error?.state && <label className={styles.error}>{error?.state}</label>}
          <button type='submit' onClick={()=>onSumbit()}>Submit</button>
          </div>      
        </div>
      </div>
  
    );
}
export default AddProject;