import jsonfile from "jsonfile";
import moment from "moment";
import simpleGit from "simple-git";

const path = "./data.json";

const commitDates = [
  "2025-02-11T09:14:22+05:30",
  "2025-07-29T21:03:47+05:30",
  "2026-01-05T13:55:10+05:30",
  "2025-11-18T06:42:33+05:30",
  "2026-03-10T17:26:58+05:30",
  "2025-04-03T11:09:15+05:30",
  "2025-12-27T23:48:02+05:30",
  "2026-02-14T08:31:44+05:30",
  "2025-09-06T15:19:27+05:30",
  "2026-03-21T19:07:51+05:30",
];

const git = simpleGit();

const writeData = (data) => jsonfile.writeFile(path, data, { spaces: 0 });

const makeCommitsFromDates = async (dates) => {
  for (const rawDate of dates) {
    const date = moment.parseZone(rawDate).format();

    if (!moment(date, moment.ISO_8601, true).isValid()) {
      throw new Error(`Invalid date: ${rawDate}`);
    }

    console.log(`Committing for ${date}`);
    await writeData({ date });
    await git.add([path]);
    await git.commit(
      `commit: ${date}`,
      undefined,
      {
        "--date": date,
      }
    );
  }

  await git.push();
  console.log(`Done. Created ${dates.length} commits and pushed to remote.`);
};

makeCommitsFromDates(commitDates).catch((err) => {
  console.error("Failed to create commits:", err.message);
  process.exitCode = 1;
});
