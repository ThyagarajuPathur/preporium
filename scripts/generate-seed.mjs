import { allProblems } from "../src/lib/problem-data.ts";

function escapeSql(value) {
  return value.replaceAll("'", "''");
}

const values = allProblems
  .map((problem) => {
    return `('${escapeSql(problem.id)}', ${problem.leetcodeNumber}, '${escapeSql(
      problem.title,
    )}', '${escapeSql(problem.slug)}', '${escapeSql(problem.url)}', '${escapeSql(
      problem.difficulty,
    )}', '${escapeSql(problem.topic)}', '${escapeSql(problem.focus)}', '${escapeSql(
      problem.pattern,
    )}', ${problem.dayNumber}, ${problem.dayOrder}, '${escapeSql(
      problem.pathName,
    )}', true)`;
  })
  .join(",\n");

process.stdout.write(`insert into public.problems (
  id,
  leetcode_number,
  title,
  slug,
  url,
  difficulty,
  topic,
  focus,
  pattern,
  day_number,
  day_order,
  path_name,
  is_active
) values
${values}
on conflict (id) do update set
  leetcode_number = excluded.leetcode_number,
  title = excluded.title,
  slug = excluded.slug,
  url = excluded.url,
  difficulty = excluded.difficulty,
  topic = excluded.topic,
  focus = excluded.focus,
  pattern = excluded.pattern,
  day_number = excluded.day_number,
  day_order = excluded.day_order,
  path_name = excluded.path_name,
  is_active = excluded.is_active;
`);
