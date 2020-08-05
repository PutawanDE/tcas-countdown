/* Setting things up. */
const config = require("./config.js");

const express = require("express"),
  app = express(),
  Twit = require("twit"),
  T = new Twit(config);

// More setting things up - TIME
const moment = require("moment");

//Get current date and time
const current = new Date();
const dayInMs = 86400000;
const hourInMs = 3600000;

//Get current timestamp in Bangkok Time
const now = current.getTime() + hourOffset(7);

function hourOffset(hour) {
  return hour * hourInMs;
}

//Set the date to which you want to count down to here!

// GAT-PAT DATE 27-03-2021
const gat = {
  name: "GAT-PAT 64",
  year: 2021,
  month: 3,
  day: 20
};

// O-NET DATE 27-03-2021
const onet = {
  name: "O-NET 63",
  year: 2021,
  month: 3,
  day: 27,
};

// // Med กสพท. DATE 7-03-2020
// const med = {
//   name: "กสพท 63",
//   year: 2020,
//   month: 2,
//   day: 7
// };

// 9 Subjects DATE 3-04-2021
const _9subjects = {
  name: "9 วิชาสามัญ 64",
  year: 2021,
  month: 4,
  day: 3
};

T.post(
  "statuses/update",
  {
    status:
      countdown(gat) +
      countdown(onet) +
      // countdown(med) +
      countdown(_9subjects) +
      "#dek64 " +
      "#TCAS64",
  },
  function (err, data, response) {
    if (err) {
      console.log("error!", err);
    } else {
      console.log("Success ", response);
    }
  }
);

function countdown(exam) {
  //Create date, subtract 1 from month since js month starts from 0
  const date = new Date(
    Date.UTC(exam.year, exam.month - 1, exam.day, 0, 0, 0, 1)
  ).getTime();

  // Set Time to 9:00AM of the Exam day using hourOffset
  const diffTime = date + hourOffset(9) - now;

  // Create duration
  const diffDuration = moment.duration(diffTime, "milliseconds");

  // Calculate days left and tweet
  return countdownTweet(diffTime, diffDuration, exam.name);
}

/* Returns the message to send as our status update */
function countdownTweet(diffTime, diffDuration, examName) {
  var status = "";

  // Check whether exam is today, if not return
  if (diffTime < dayInMs && diffTime > -dayInMs) {
    status += `โชคดีกับการสอบ ${examName} นะครับ #Fight\n`;
    return status;
  }

  // Use for testing only
  // if(diffTime < dayInMs && diffTime > -dayInMs) {
  //   status += `TEST TWEET: ${diffTime} till 25-10-19 9:00AM UTC+7 `;
  //   return status;
  // }

  // Calculate days left and return
  if (diffTime > 0) {
    if (diffDuration.asDays() > 1) {
      // Days and Months format
      // let months = Math.trunc(diffDuration.asDays() / 30);
      // let days = Math.trunc(diffDuration.asDays() % 30);
      // if(months >= 1) {
      //   status += `${months} เดือน`;
      // }

      // Days format
      let days = Math.trunc(diffDuration.asDays());
      if (days >= 1) {
        status += `${days} วัน`;
      }
      status += ` จนถึงสอบ ${examName}!\n`;
    }
  }

  if (status != "") {
    return status;
  }
}
