/* Setting things up. */
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

import createAuthorizationHeader from "./auth.js";

const BASE_URL = "https://api.twitter.com/2";

// More setting things up - TIME
const dayInMs = 86400000;
const hourInMs = 3600000;

const hourOffset = (hour: number) => {
  return hour * hourInMs;
};

interface Exam {
  name: string;
  year: number;
  month: number;
  day: number;
}

//Set the date to which you want to count down to here!

// TGAT-TPAT DATE 09-12-2023
const TGAT_TPAT: Exam = {
  name: "TGAT/TPAT2-5 67",
  year: 2023,
  month: 12,
  day: 9,
};

// Med กสพท. DATE 16-12-2023
const med: Exam = {
  name: "TPAT1(กสพท) 67",
  year: 2023,
  month: 12,
  day: 16,
};

// A-Level DATE 16-03-2024
const A_levels: Exam = {
  name: "A-Level 67",
  year: 2024,
  month: 3,
  day: 16,
};

/* Returns the countdown message to be tweeted */
export const countdown = (exam: Exam) => {
  //Create date, subtract 1 from month since js month starts from 0
  const date = new Date(
    Date.UTC(exam.year, exam.month - 1, exam.day, 0, 0, 0, 1)
  ).getTime();

  //Get current timestamp in Bangkok Time
  const now = new Date().getTime() + hourOffset(7);

  // Set Time to 9:00AM of the Exam day using hourOffset
  const diffTime = date + hourOffset(9) - now;

  // Calculate days left and create tweet message
  let status = "";
  const days = Math.floor(diffTime / dayInMs);

  if (days === 0) {
    status += `โชคดีกับการสอบ ${exam.name} นะครับ #Fight\n`;
    return status;
  } else if (days > 0) {
    status += `${days} วัน จนถึงสอบ ${exam.name}!\n`;
  }

  return status;
};

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {
  // Post new status
  const status = countdown(TGAT_TPAT) +
    countdown(med) +
    countdown(A_levels) +
    "#dek67 " +
    "#TCAS67";

  const authHeader = createAuthorizationHeader({}, "POST", `${BASE_URL}/tweets`);

  const body = { text: status, };

  try {
    // Why ignore? Because fetch is not defined in typescript
    // @ts-ignore
    const response = await fetch(`${BASE_URL}/tweets`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(response);
    }

    const data = await response.json();
    console.log("Successfully post a new status: ", JSON.stringify(data));

    return {
      statusCode: response.status,
      body: JSON.stringify(data),
    };
  } catch (error: any) {
    console.error("Failed to post a new status: ", error);
    return {
      statusCode: error.statusCode || 500,
      body: JSON.stringify(error),
    };
  }
};
