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

const quotes = [
  "ไม่เคยมีคำว่าสายเกินไปที่จะเป็นในสิ่งที่คุณอยากจะเป็น",
  "ความสำเร็จของปีนี้ คือ สิ่งที่เป็นไปไม่ได้ในปีที่ผ่านมา",
  "เส้นบางๆ ที่คั่นระหว่างความเป็นไปได้และความเป็นไปไม่ได้คือการตัดสินใจของเรา",
  "การลงมือทำดีกว่าคำ พูดที่สวยหรู",
  "ทำวันนี้ให้ดีที่สุด แล้วชีวิตคุณจะไม่ธรรมดา",
  "ลืมอดีตของคุณไป ให้อภัยกับตัวเอง และเริ่มต้นใหม่อีกครั้ง",
  "อย่าสูญสิ้นความสิ้นหวัง คุณไม่อาจรู้ได้ว่าพรุ่งนี้ จะเกิดอะไรขึ้นบ้าง",
  "รู้ว่าเสี่ยง แต่คงต้องขอลอง",
  "รู้ว่าเหนื่อย ถ้าอยากได้ของที่อยู่สูง ยังไงจะขอลองดูสักที",
  "ไม่ต้องอ่านเยอะครับ แต่อ่านให้มีประสิทธิภาพ",
  "per aspera ad astra",
  "ไม่มีใครเข้มแข็งตลอดไปและไม่มีใครอ่อนแอตลอดกาล",
  "ไม่มีใครสะดุดภูเขาล้ม มีแต่สะดุดก้อนหินล้ม",
  "ตึกสูงระฟ้ามาจากก้อนอิฐ",
  "เหนื่อยก็พัก ด้วยรักและห่วงใย"
];

T.post(
  "statuses/update",
  {
    status:
      randomQuote(quotes) +
      "\n" +
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
    }s
  }
);

/* Returns the countdown message to be tweeted */
function countdown(exam) {
  //Create date, subtract 1 from month since js month starts from 0
  const date = new Date(
    Date.UTC(exam.year, exam.month - 1, exam.day, 0, 0, 0, 1)
  ).getTime();

  // Set Time to 9:00AM of the Exam day using hourOffset
  const diffTime = date + hourOffset(9) - now;

  // Create duration
  const diffDuration = moment.duration(diffTime, "milliseconds");

  // Calculate days left and create tweet message
  return countdownTweet(diffTime, diffDuration, exam.name);
}

/*Calculate the time left (countdown), create tweet message and return*/
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

/* Returns the randomly selected quote to be tweeted */
function randomQuote(quotes) {
  let r = Math.floor(Math.random() * quotes.length);
  return "\"" +  quotes[r] + "\"" + "\n";
}
