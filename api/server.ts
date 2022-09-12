import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
const app = express();

const bodyParser = require("body-parser");



const prisma = new PrismaClient();


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT || 5000;



      
//1 ===>Api for check the permission for user 
app.post('/checkpermission',async(req,res)=>{  
  try{
    const checkPermsn = await prisma.access.findUnique({
      where: { id : req.body.id },
    })

  res.json({data:checkPermsn});
  } catch(err) {
    res.status(500).json({error:'Unknown error please contact your administrator'});
  }

});
//Api end
//2 ===>Api for create project
  app.post('/createproject',async(req,res)=>{
    try{

      const result = await prisma.project.create({
        data: {
          name:req.body.name,
          state:req.body.state,
          date: new Date(),
        },
      })
      res.json(result);
    }catch(err){
      res.status(500).json({error:'Unknown error please contact your administrator'});
    }
  })
//3 ===> Api for get a project,he has access to the project;
app.get('/getproject/:id', async (req, res) => {

  try{
    const projAcces = await prisma.access.findUnique({
      where: { id: Number(req.params.id) },
    });
   
    if(projAcces?.permit.includes('Read')){
      const projects = await prisma.project.findUnique({
        where: { id: Number(projAcces.project_id) },
      })
      res.json(projects)
    }else{
      res.json({data:'No permission for read'});
    }
  }catch(err){
    res.status(500).json({error:'Unknown error please contact your administrator'});
  }

});
//End

//4 ===> Api for get all projects,he has access to the project;
app.get('/getAllProjects/:id',async(req,res)=>{
  try{
    const projAcces = await prisma.access.findMany({
      where: {user_id:Number(req.params.id) },
    });
  
    if(projAcces){
      const selectedIds = projAcces.map(({ project_id }) => project_id);

      const projects = await prisma.project.findMany()
      res.status(200).json({data:projects})
    }else{
      res.status(200).json({error:'No records found'});
    }

  }catch(err){
    res.status(500).json({error:'Unknown error please contact your administrator'});
  }

});
//End

//4===>Update the project
app.put('/updateproject', async (req, res) => {

  try{
    const updateAccess = await prisma.access.findUnique({
      where: {
        id:req.body.user_id
      },
      select: {
        id:true,
        project_id: true,
        permit:true
      },
    });
    if(updateAccess?.permit.includes('Update')){
      const updatedProject = await prisma.project.update({
        where: { id : req.body.id},
        data: {
          name:req.body.name,
          state:req.body.state,
          date: req.body.date
        }
      });
      res.json(updatedProject)
    }else{
      res.json({data:'No records found'});
    }
  
  }catch(err){
    res.status(500).json({error:'Unknown error please contact your administrator'});
  }

  
});
//End
//5===>Delecte the project
app.delete(`/deleteproject/:id`, async (req, res) => {
  const { id } = req.params;
  
  const deleteProject = await prisma.access.findFirst({
    where: { id: 1 },
  })
  
  if(deleteProject?.permit.includes('Delete')){
    const post = await prisma.project.delete({
      where: { id: deleteProject.project_id },
    });
  }
  res.json(deleteProject);
})


//



  



app.listen(port, () => {
  console.log(`Server Running at ${port} 🚀`);
});