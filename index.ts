import dayjs from "dayjs";
import git from "simple-git";
import inquirer from "inquirer";
import generateRandomNumber, {
  removeGitFolder,
  writeJsonToFile,
  range,
  isWeekend,
  wait,
} from "./utils";
import ora from "ora";

const FILE_PATH = "./data.json";
const DAYS_IN_YEAR = 365;

async function doDateCommit(
  date: string,
  options?: { message?: string; files?: string }
) {
  await writeJsonToFile(FILE_PATH, { date });
  git()
    .add(options?.files ?? FILE_PATH)
    .commit(options?.message ?? date, {
      "--date": date,
    });
}

async function main() {
  const { commitsAmount, adjustWeekends } = await inquirer.prompt([
    {
      type: "input",
      name: "commitsAmount",
      message: "Enter the amount of commits you want to make:",
    },
    {
      type: "confirm",
      name: "adjustWeekends",
      message: "Do you want to make less commits on weekends?",
    },
  ]);
  const progress = ora("Removing .git folder...").start();
  await removeGitFolder();

  progress.text = "Initializing git repository...";
  await git().init();

  const yearAgo = dayjs().subtract(DAYS_IN_YEAR, "day").format();
  await doDateCommit(yearAgo, {
    message: "init",
    files: ".",
  });

  for (let commitIndex of range(commitsAmount)) {
    progress.text = `Committing ${commitIndex + 1} of ${commitsAmount}...`;
    const number = generateRandomNumber(0, DAYS_IN_YEAR - 1);
    const date = dayjs().subtract(number, "day");
    if (adjustWeekends && isWeekend(date)) {
      const randomNumber = generateRandomNumber(0, 2);
      if (randomNumber !== 0) continue;
    }
    await doDateCommit(date.format());
    await wait(50);
  }
  progress.succeed("Commits are ready! Check it out with `git log`.");
  console.log(
    "📤 You can now push this repo to your remote repository. It must be your own intention :)"
  );
  console.log("❓ How to push");
  console.log("\t> Create a new git repo on GitHub");
  console.log("\t$ git remote add origin <your-repo-url>");
  console.log("\t$ git push -u origin main");
}

main().catch((error) => {
  console.error("Oops, something went wrong!\n", error);
});
