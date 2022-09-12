import { PrismaClient } from '@prisma/client';
import express from 'express';
import cors from 'cors';
import e from 'express';
const app = express();

const bodyParser = require("body-parser");



const prisma = new PrismaClient();

const path = require('path');

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "Hi" });
});


const port = process.env.PORT || 5000;
console.log(port)




 



async function main() {
      
//1 ===>Api for check the permission for user can create project(or)not
app.post('/checkpermission',async(req,res)=>{  
  try{
    const checkPermsn = await prisma.access.findUnique({
      where: { id : req.body.id },
    })
  
  if(checkPermsn?.permit.includes('Create')){
        const result = await prisma.project.create({
          data: {
            id:Number(req.body.id),
            name:req.body.proNm,
            state:req.body.projStat,
            date: new Date()
          },
        })
        res.json(result);
  }else{
    res.json({data:'Permission denied for project creation '});
  }
  } catch(err) {
    console.log(err)
    res.status(500).json({data:'Unknown error please contact your administrator'});
  }




});
//Api end
  
//2 ===> Api for get a project,he has access to the project;
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
      res.json({data:'Permission denied for project creation '});
    }
  }catch(err){
    console.log(err)
    res.status(500).json({data:'Unknown error please contact your administrator'});
  }



});
//End

//3 ===> Api for get all projects,he has access to the project;
app.get('/getAllProjects/:id',async(req,res)=>{


  const accessMany = await prisma.access.findMany({
    where: {id:Number(req.params.id) },
  });

  const selectedIds = accessMany.map(({ project_id }) => project_id);


  const projects = await prisma.project.findMany({
    where: {
      id: { in: selectedIds },
    },
  })
  console.log(accessMany)
  // res.json(accessMany);
  res.status(200).json({data:accessMany})
});
//End

//4===>Update the project
app.put('/put/:id', async (req, res) => {
  // const { id } = req.params;

  const updateAccess = await prisma.access.findFirst({
    where: { id: Number(req.params.id) },
  })

  console.log("updateAccess");
  console.log(updateAccess);
  
  
  // if(updateAccess?.permit.includes('Update')){
  //   const updatedProject = await prisma.project.update({
  //     where: { id: updateAccess.project_id },
  //     data: {
  //       name:req.params.name,
  //       state:req.params.state,
  //       date: req.params.date
  //     },
  //   });
   
  // }
  res.json()
});
//End
//5===>Delecte the project
app.delete(`/project/:id`, async (req, res) => {
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


//6===>Filter the project
app.get('/getProjects/:id',async(req,res)=>{

  // const { id }: { id?: string } = req.params;

  const filterProject = await prisma.project.findMany({
    where: { id: Number(req.params.id) },
    orderBy: [
      {
        name: 'desc',
      },
      {
        date: 'asc',
      }
    ],
  })
});
//



  
}


main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})

app.listen(port, () => {
  console.log(`Server Running at ${port} 🚀`);
});