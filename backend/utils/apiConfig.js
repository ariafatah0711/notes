export const GITHUB_API = "https://api.github.com/gists";
export const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  "Content-Type": "application/json",
};
