import { Project_Student } from "@prisma/client";
import { ProjectQ, ProjectWithStudentsAndAdvisors, UserData } from "./type";

export const serviceValidation = async (
  ticket: string,
  DeeAppId: string,
  DeeAppSecret: string
) => {
  try {
    const url = "https://account.it.chula.ac.th/serviceValidation";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        DeeAppId: DeeAppId,
        DeeAppSecret: DeeAppSecret,
        DeeTicket: ticket,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Content-type": "application/json",
      },
    });

    if (response.ok) {
      const jsonResponse: UserData = await response.json();
      return {
        status: 200,
        message: jsonResponse,
      };
    } else {
      const jsonResponse = await response.json();
      return {
        status: response.status,
        message: jsonResponse,
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: error,
    };
  }
};

export const filterProjectsByStudentIds = (
  projects: ProjectQ[],
  studentIds: string[]
): ProjectQ[] => {
  return projects.reduce((filtered: ProjectQ[], project: ProjectQ) => {
    const projectStudentIds = project.students.map(
      (student) => student.student_id
    );
    if (studentIds.every((id) => projectStudentIds.includes(id))) {
      filtered.push({
        project_id: project.project_id,
        title: project.title,
        advisors: project.advisors,
        description: project.description,
        endDate: project.endDate,
        startDate: project.startDate,
        status: project.status,
        students: project.students,
      });
    }
    return filtered;
  }, []);
};

export const filterProjectsByAdvisorIds = (
  projects: ProjectQ[],
  advisorIds: string[]
): ProjectQ[] => {
  return projects.reduce((filtered: ProjectQ[], project: ProjectQ) => {
    const projectAdvisorIds = project.advisors.map(
      (advisor) => advisor.advisor_id
    );
    if (advisorIds.every((id) => projectAdvisorIds.includes(id))) {
      filtered.push({
        project_id: project.project_id,
        title: project.title,
        advisors: project.advisors,
        description: project.description,
        endDate: project.endDate,
        startDate: project.startDate,
        status: project.status,
        students: project.students,
      });
    }
    return filtered;
  }, []);
};

export const filterProjectsByStartDate = (
  projects: ProjectQ[],
  startDate: string
): ProjectQ[] => {
  const filterDate = new Date(startDate);

  return projects.filter(
    (project) => new Date(project.startDate) >= filterDate
  );
};

export const filterProjectsByEndDate = (
  projects: ProjectQ[],
  endDate: string
): ProjectQ[] => {
  const filterDate = new Date(endDate);
  return projects.filter((project) => new Date(project.endDate) <= filterDate);
};
