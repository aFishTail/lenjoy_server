import axios from 'axios';

export interface ThirdAccountUserInfo {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  bio: string; // 个性签名
  url: string;
  name: string;
  company: null;
  blog: string;
  location: null;
  email: string;
}

const clien_id = '44db132818e96bbdee51';
const secret = 'dededc5342d77b26f9f70a13fec487773f83504c';
const redirectUrl = 'http://localhost:3001/thirdaccount/redirect';
export const getGithubAccessToken = async (code: string): Promise<string> => {
  const res = await axios({
    method: 'post',
    url: `https://github.com/login/oauth/access_token?client_id=${clien_id}&client_secret=${secret}&code=${code}&redirect_url=${redirectUrl}`,
    headers: {
      accept: 'application/json',
    },
  });
  console.log('github login', res.data);
  return res.data.access_token;
};

export const getGithubUserInfo = async (
  accessToken: string,
): Promise<ThirdAccountUserInfo> => {
  const res = await axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: {
      accept: 'application/json',
      Authorization: `token ${accessToken}`,
    },
  });
  return res.data as ThirdAccountUserInfo;
};
