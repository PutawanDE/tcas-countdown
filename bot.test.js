const { countdown } = await import("./bot.js");

const assertStr = (testStr, actualStr, msg) => {
  if (testStr === actualStr) {
    console.log("\x1b[42m", `Passed-- ${msg}`, "\x1b[0m");
  } else {
    console.error("\x1b[41m", `Failed-- ${msg}`, "\x1b[0m");
    console.log(`Output:${testStr}, Correct:${actualStr}`);
  }
};

const test = () => {
  const med = {
    name: "กสพท 65",
    year: 2022,
    month: 3,
    day: 26,
  };

  // A-Level DATE 18-03-2023
  const A_levels = {
    name: "A-Level 66",
    year: 2023,
    month: 3,
    day: 18,
  };

  assertStr(countdown(med), "", "Test Exam Date has passed.");
  assertStr(
    countdown(A_levels),
    "187 วัน จนถึงสอบ A-Level 66!\n",
    "Test Exam Date is coming."
  );
};

test();
