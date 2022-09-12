/* Setting things up. */
import config from "./config.js";

import Twit from "twit";

const T = new Twit(config);

// More setting things up - TIME
const dayInMs = 86400000;
const hourInMs = 3600000;

const hourOffset = (hour) => {
  return hour * hourInMs;
};

//Set the date to which you want to count down to here!

// TGAT-TPAT DATE 10-12-2022
const TGAT_TPAT = {
  name: "TGAT/TPAT2-5 66",
  year: 2022,
  month: 12,
  day: 10,
};

// Med กสพท. DATE 17-12-2022
const med = {
  name: "TPAT1(กสพท) 66",
  year: 2022,
  month: 12,
  day: 17,
};

// A-Level DATE 18-03-2023
const A_levels = {
  name: "A-Level 66",
  year: 2023,
  month: 3,
  day: 18,
};

/* Returns the countdown message to be tweeted */
export const countdown = (exam) => {
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

export const handler = () => {
  T.post(
    "statuses/update",
    {
      status:
        countdown(TGAT_TPAT) +
        countdown(med) +
        countdown(A_levels) +
        "#dek66 " +
        "#TCAS66",
    },
    (err, data, response) => {
      if (err) {
        console.log("error!", err);
      } else {
        console.log("Success ", response);
      }
    }
  );
};
