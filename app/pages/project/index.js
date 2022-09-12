
import React , { useEffect, useState } from 'react';
import { apiCall } from '../../src/common/apiRoutes';
import ProjectList from '../../src/component/project-list';
import AddProject from '../../src/component/project-list/addProject';
import ViewProject from '../../src/component/project-list/viewProject';
import styles from './project.module.css'
const Project = () => {
    const [userAccess, setUserAccess]=useState(null);
    const [projectListData, setProjectListData]=useState(null);
    const [modal, setModal]=useState(false)
    const [isEdit, setIsEdit]=useState(false)
    const [selectedObject, setSelectedObject] =useState(null)
    const [viewModal, setViewModal]=useState(false)
    const [viewData, setViewData]=useState(null)
    useEffect(()=>{
        const res = JSON.parse(localStorage.getItem('access'));
        setUserAccess(res)
        projectListApiCall(res)
    },[])

    const projectListApiCall= async(res)=>{
        if(res?.permit?.includes('Read')){
            const response =  await apiCall(`http://localhost:5000/getAllProjects/${res?.user_id}`, 'GET');
            const filterData = response?.data?.map((each, i)=> {
                if(each.id === res?.project_id){
                    return {...each, permit: res?.permit}
                }else{
                    return   {...each, permit:[]}
                }
            })
           setProjectListData(filterData)
        }
    }
    const closeModal=()=>{
        setModal(false)
        projectListApiCall(userAccess)
    }
    const editOnChange=(each)=>{
        setIsEdit(true)
        setModal(true)
        setSelectedObject(each)
    }

    const openModal=()=>{
        setModal(true)
        setIsEdit(false);
        setSelectedObject(null)
    }
    const deleteMethod=async (id)=>{
        const response =  await apiCall(`http://localhost:5000/deleteproject/${id}`, 'DELETE');
        if(response){
            alert('Deleted successfully')
            projectListApiCall(userAccess)
        }
    }

    const onSortTable =(column)=>{  
        let sortedList = projectListData?.sort((a, b) => {
            const nameA = a[column].toUpperCase(); 
            const nameB = b[column].toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
        });
        setProjectListData(sortedList)
    }
    const onViewProject=(each)=>{
        setViewModal(true)
        setViewData(each)
    }
    return (
        <div className={styles.contain}>
            {viewModal && <ViewProject data={viewData} close={()=>setViewModal(false)}/> }
           {modal && <AddProject user={userAccess?.user_id} close={closeModal} isEdit={isEdit} object={selectedObject}/>} 
            {userAccess?.permit?.includes('Create') && <button type="button" className={styles.createProject} onClick={()=>openModal()}>+ Create Project</button>}
            <ProjectList list={projectListData} access={userAccess?.permit} onEdit={editOnChange} onDelete={deleteMethod} onView={onViewProject} onSortBy={onSortTable} />
        </div>
    );
}

export default Project;
