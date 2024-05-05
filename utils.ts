import { UserData } from "./type";

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