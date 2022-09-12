import React, {useState, useEffect} from 'react';
import styles from '../addProject/addProject.module.css'

const ViewProject = ({data, close}) => {
  
    return ( 
      <div className={styles.modal}>
        <div className={styles.modalBg}>
            <button className={styles.close} onClick={close}>X</button>
          <div className={styles.modalInnerDiv}>
            <h2>View Project</h2>
            <div className={styles.viewData}><label>Name :</label> <p>{data?.name}</p></div>
            <div className={styles.viewData}><label>State :</label> <p>{data?.state}</p></div>
            <div className={styles.viewData}><label>Date :</label> <p>{data?.date}</p></div>
          </div>      
        </div>
      </div>
  
    );
}
export default ViewProject;