import React, { useEffect, useState } from 'react';
import styles from './projectList.module.css'
const ProjectList = ({list, onEdit, onDelete, onView, onSortBy}) => {
    return (
        <table className={styles.projectTable}>
            <thead>
                <tr>
                    <th>Id</th>
                    <th style={{cursor:'pointer'}} onClick={()=>onSortBy('name')}>Name &#94;</th>
                    <th style={{cursor:'pointer'}} onClick={()=>onSortBy('state')} >State &#94;</th>
                    <th style={{cursor:'pointer'}} onClick={()=>onSortBy('date')}>Create Date &#94;</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
              {list?.length > 0 ?  list?.map((each, i) => <tr key={i}>
                    <td>{each?.id}</td>
                    <td>{each?.name}</td>
                    <td>{each?.state}</td>
                    <td>{each?.date}</td>
                    <td>{each?.permit?.includes('Update') && <span onClick={()=>onEdit(each)}>Edit</span>} {each?.permit?.includes('Delete') &&<span onClick={()=>onDelete(each?.id)}>Delete</span>
                    } {each?.permit?.includes('Read') && <span onClick={()=>onView(each)}>View</span>}</td>
                </tr>) : <tr><td colspan='5'>No Record</td></tr>}
            </tbody>
        </table>
    );
}

export default ProjectList;
