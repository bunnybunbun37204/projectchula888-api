import { Hono } from "hono";
import { Binding, ProjectQ, ProjectWithStudentsAndAdvisors } from "../../type";
import { PrismaD1 } from "@prisma/adapter-d1";
import { PrismaClient, Project, Student } from "@prisma/client";
import { HTTPException } from "hono/http-exception";
import {
  filterProjectsByAdvisorIds,
  filterProjectsByEndDate,
  filterProjectsByStartDate,
  filterProjectsByStudentIds,
} from "../../utils";

const project = new Hono<{ Bindings: Binding }>();

project.get("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const student = c.req.queries("student") || [];
  const advisor = c.req.queries("advisor") || [];
  const startDateString = c.req.query("start") as string | undefined;
  const endDateString = c.req.query("end") as string | undefined;

  let startDate: Date | undefined;
  let endDate: Date | undefined;
  const data = (await prisma.project.findMany({
    include: {
      advisors: true,
      students: true,
    },
  })) as unknown as ProjectQ[];

  if (startDateString) {
    startDate = new Date(startDateString);
    startDate.setUTCHours(0, 0, 0, 0);
  }

  if (endDateString) {
    endDate = new Date(endDateString);
    endDate.setUTCHours(0, 0, 0, 0);
  }

  let result = data;

  if (student && student.length > 0) {
    result = filterProjectsByStudentIds(data, student);
  }

  if (advisor && advisor.length > 0) {
    result = filterProjectsByAdvisorIds(result, advisor);
  }

  if (startDateString) {
    result = filterProjectsByStartDate(result, startDateString);
  }

  if (endDateString) {
    result = filterProjectsByEndDate(result, endDateString);
  }

  let studentInput: string[] = [];
  let advisorInput: string[] = [];

  result.map((value) => {
    value.students.map((student) => {
      studentInput.push(student.student_id);
    });
    value.advisors.map((advisor) => {
      advisorInput.push(advisor.advisor_id);
    });
  });

  const students = await prisma.student.findMany({
    where: {
      student_id: {
        in: studentInput,
      },
    },
  });

  const advisors = await prisma.advisor.findMany({
    where: {
      advisor_id: {
        in: advisorInput,
      },
    },
  });

  result.forEach((project) => {
    project.students = project.students.map((student) => {
      let matchedStudent = students.find(
        (s) => s.student_id === student.student_id
      );
      return matchedStudent ? { ...student, ...matchedStudent } : student;
    });
    project.advisors = project.advisors.map((advisor) => {
      let matchedAdvisor = advisors.find(
        (a) => a.advisor_id === advisor.advisor_id
      );
      return matchedAdvisor ? { ...advisor, ...matchedAdvisor } : advisor;
    });
  });

  return c.json({ result });
});

project.get("/:id", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const id = c.req.param("id");
  const student = c.req.queries("student") || [];
  const advisor = c.req.queries("advisor") || [];
  const startDateString = c.req.query("start") as string | undefined;
  const endDateString = c.req.query("end") as string | undefined;

  let startDate: Date | undefined;
  let endDate: Date | undefined;
  const data = (await prisma.project.findMany({
    where: {
      project_id: parseInt(id),
    },
    include: {
      advisors: true,
      students: true,
    },
  })) as unknown as ProjectQ[];

  if (startDateString) {
    startDate = new Date(startDateString);
    startDate.setUTCHours(0, 0, 0, 0);
  }

  if (endDateString) {
    endDate = new Date(endDateString);
    endDate.setUTCHours(0, 0, 0, 0);
  }

  let result = data;

  if (student && student.length > 0) {
    result = filterProjectsByStudentIds(data, student);
  }

  if (advisor && advisor.length > 0) {
    result = filterProjectsByAdvisorIds(result, advisor);
  }

  if (startDateString) {
    result = filterProjectsByStartDate(result, startDateString);
  }

  if (endDateString) {
    result = filterProjectsByEndDate(result, endDateString);
  }

  let studentInput: string[] = [];
  let advisorInput: string[] = [];

  result.map((value) => {
    value.students.map((student) => {
      studentInput.push(student.student_id);
    });
    value.advisors.map((advisor) => {
      advisorInput.push(advisor.advisor_id);
    });
  });

  const students = await prisma.student.findMany({
    where: {
      student_id: {
        in: studentInput,
      },
    },
  });

  const advisors = await prisma.advisor.findMany({
    where: {
      advisor_id: {
        in: advisorInput,
      },
    },
  });

  result.forEach((project) => {
    project.students = project.students.map((student) => {
      let matchedStudent = students.find(
        (s) => s.student_id === student.student_id
      );
      return matchedStudent ? { ...student, ...matchedStudent } : student;
    });
    project.advisors = project.advisors.map((advisor) => {
      let matchedAdvisor = advisors.find(
        (a) => a.advisor_id === advisor.advisor_id
      );
      return matchedAdvisor ? { ...advisor, ...matchedAdvisor } : advisor;
    });
  });

  return c.json({ result });
});

project.get("/test", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const studentIds = ["6534435223", "6534435224"];
  const result = await prisma.student.findMany({
    where: {
      student_id: {
        in: studentIds,
      },
    },
  });
  return c.json({ result });
});

project.post("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<ProjectWithStudentsAndAdvisors>();
  const studentIds = data.studentIds;
  const advisorIds = data.advisorIds;

  let advisorData: { advisor_id: string; project_id: number }[] = [];
  let studentData: { student_id: string; project_id: number }[] = [];

  await prisma.project.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      startDate: data.startDate,
      endDate: data.endDate,
    },
  });
  const latestQuery = await prisma.project.findMany({
    orderBy: {
      project_id: "desc",
    },
    take: 1,
  });

  const number = latestQuery[0].project_id;

  advisorIds.map((id) => {
    advisorData.push({ advisor_id: id.toString(), project_id: number });
  });

  studentIds.map((id) => {
    studentData.push({ student_id: id.toString(), project_id: number });
  });

  await prisma.$transaction([
    prisma.project_advisor.createMany({
      data: advisorData,
    }),
    prisma.project_Student.createMany({
      data: studentData,
    }),
  ]);

  return c.json({ message: "Create Project success" });
});

project.patch("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });
  const data = await c.req.json<ProjectQ>();

  let advisorData: { advisor_id: string; project_id: number }[] = [];
  let studentData: { student_id: string; project_id: number }[] = [];
  const number = data.project_id;

  data.advisors.map((id) => {
    advisorData.push({ advisor_id: id.toString(), project_id: number });
  });
  data.students.map((id) => {
    studentData.push({ student_id: id.toString(), project_id: number });
  });

  await prisma.project.update({
    where: {
      project_id: data.project_id,
    },
    data: {
      title: data.title || undefined,
      description: data.description || undefined,
      startDate: data.startDate || undefined,
      endDate: data.endDate || undefined,
      status: data.status || undefined,
    },
  });

  await prisma.project_advisor.deleteMany({
    where: {
      project_id: data.project_id,
      advisor_id: {
        notIn: data.advisors.map((advisor) => advisor.toString()),
      },
    },
  });

  await prisma.project_Student.deleteMany({
    where: {
      project_id: data.project_id,
      student_id: {
        notIn: data.students.map((student) => student.toString()),
      },
    },
  });

  await prisma.project_advisor.createMany({
    data: advisorData.filter((advisor) => {
      return !data.advisors.includes({advisor_id: advisor.advisor_id, project_id: advisor.project_id});
    }),
  });

  await prisma.project_Student.createMany({
    data: studentData.filter((student) => {
      return !data.students.includes({student_id: student.student_id, project_id: student.project_id});
    }),
  });

  return c.json({ message: "Update success" });
});


project.delete("/", async (c) => {
  const adapter = new PrismaD1(c.env.DB);
  const prisma = new PrismaClient({ adapter });

  const data = await c.req.json<Project>();

  await prisma.$transaction([
    prisma.project_advisor.deleteMany({
      where: {
        project_id: data.project_id,
      },
    }),
    prisma.project_Student.deleteMany({
      where: {
        project_id: data.project_id,
      },
    }),
    prisma.project.delete({
      where: {
        project_id: data.project_id,
      },
    }),
  ]);
  return c.json({ message: "Delete success" });
});

project.onError((err) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  throw new HTTPException(400, {
    message: (err as Error).message,
    cause: (err as Error).cause,
  });
});
export default project;
