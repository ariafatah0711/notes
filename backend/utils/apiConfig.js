export const GITHUB_API = "https://api.github.com/gists";
export const headers = {
  Authorization: `token ${process.env.GITHUB_TOKEN}`,
  "Content-Type": "application/json",
};

export const fakeheaders = {
  Authorization: `token fake_token`,
  "Content-Type": "application/json",
};
