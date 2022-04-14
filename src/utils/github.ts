import axios from 'axios';

const clien_id = '44db132818e96bbdee51';
const secret = '0301ed78ae8e0c66aeb19ad22493aa54397ed593';
export const getGithubAccessToken = async (code: string) => {
  const res = await axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clien_id}&client_secret=${secret}&code=${code}`,
    headers: {
      accept: 'application/json',
    },
  });
  console.log(res);
};

export const getGithubUserInfo = async (accessToken: string) => {
  return await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${accessToken}`,
    },
  });
};
