/* Setting things up. */
import { Context, APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";

import createAuthorizationHeader from "./auth.js";

const BASE_URL = "https://api.x.com/2";

// More setting things up - TIME
const dayInMs = 86400000;
const hourInMs = 3600000;

const hourOffset = (hour: number) => {
  return hour * hourInMs;
};

//Set the date to which you want to count down to here!

const TGAT_TPAT: Exam = {
  name: "TGAT/TPAT2-5 70",
  year: 2027,
  month: 1,
  day: 30,
};

const med: Exam = {
  name: "TPAT1(กสพท) 70",
  year: 2027,
  month: 2,
  day: 13,
};

const A_levels: Exam = {
  name: "A-Level 70",
  year: 2027,
  month: 3,
  day: 13,
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

const buildStatus = () => {
  return countdown(TGAT_TPAT) + countdown(med) + countdown(A_levels);
}

export const handler = async (): Promise<APIGatewayProxyResult> => {
  // Post new status
  const status = buildStatus();

  if (!status) {
    return {
      statusCode: 200,
      body: "No status to post",
    };
  }

  const authHeader = createAuthorizationHeader({}, "POST", `${BASE_URL}/tweets`);

  const body = { text: status, };

  try {
    const response = await fetch(`${BASE_URL}/tweets`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result: XPostTweetsResponse = await response.json();

    if (!response.ok) {
      const errors = result.errors ?? [];

      console.error("Failed to post a new status:", {
        status: response.status,
        statusText: response.statusText,
        errors,
      });

      return {
        statusCode: response.status,
        body: JSON.stringify({
          errors,
        }),
      };
    }

    console.log(
      "Successfully posted a new status:",
      JSON.stringify(result.data)
    );

    return {
      statusCode: response.status,
      body: JSON.stringify(result.data),
    };
  } catch (error: unknown) {
    console.error("Failed to post a new status:", error);

    const message = error instanceof Error
      ? error.message
      : String(error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: message,
      }),
    };
  }
};
