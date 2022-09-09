import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

import express from 'express';
const app = express();
app.use(express.json());
 

//1 ===>Api for check the permission for user can create project(or)not
app.post('/checkpermission',async(req,res)=>{
  const { id } = req.body;


  const checkPermsn = await prisma.access.findUnique({
    where: { id: Number(id) },
  })

if(checkPermsn?.permit == 'Create'){
      const result = await prisma.project.create({
        data: {
          id:req.body.id,
          name:req.body.name,
          state:req.body.state,
          date: req.body.date
        },
      })
      res.json(result);
}

});
//Api end
  
//2 ===> Api for get a project,he has access to the project;
app.get(`/get/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;

  const access = await prisma.access.findUnique({
    where: { id: Number(id) },
  })


  const projects = await prisma.project.findUnique({
    where: { id: Number(id) },
  })
  res.json(projects)
});
//End

//3 ===> Api for get all projects,he has access to the project;
app.get('/get/:id',async(req,res)=>{

  const { id }: { id?: string } = req.params;

  const accessMany = await prisma.access.findMany({
    where: {user_id: req.params.user_id },
  });

  const selectedIds = accessMany.map(({ project_id }) => project_id);


  const projects = await prisma.project.findMany({
    where: {
      id: { in: selectedIds },
    },
  })
  res.json(projects);
});
//End

//4===>Update the project
app.put('/put/:id', async (req, res) => {
  const { id } = req.params;

  const updateAccess = await prisma.access.findFirst({
    where: { user_id: req.params.user_id },
  })
  
  
  if(updateAccess?.permit == 'Update'){
    const updatedProject = await prisma.project.update({
      where: { id: updateAccess.project_id },
      data: {
        name:req.params.name,
        state:req.params.state,
        date: req.params.date
      },
    });
   
  }
  res.json()
});
//End
//5===>Delecte the project
app.delete(`/project/:id`, async (req, res) => {
  const { id } = req.params;
  
  const deleteProject = await prisma.access.findFirst({
    where: { id: 1 },
  })
  
  if(deleteProject?.permit == 'Delete'){
    const post = await prisma.project.delete({
      where: { id: deleteProject.project_id },
    });
  }
  res.json(deleteProject);
})


//6===>Filter the project
app.get('/post/:id',async(req,res)=>{

  const { id }: { id?: string } = req.params;

  const filterProject = await prisma.project.findMany({
    where: { state: req.params.state },
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


async function main() {




  
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