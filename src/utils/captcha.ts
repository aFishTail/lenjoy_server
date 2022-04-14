import * as captcha from 'svg-captcha';

function randomChoose<T>(arr: T[]) {
  const len = arr.length;
  const index = Math.floor(Math.random() * len);
  return arr[index];
}

export const generateCaptcha = () => {
  const bgColors = [
    '#d3f261',
    '#ff7875',
    '#5cdbd3',
    '#ffadd2',
    '#d9d9d9',
    '#fffb8f',
    '#ff85c0',
  ];
  return captcha.create({
    size: 4,
    noise: 2,
    fontSize: 48,
    width: 100,
    height: 36,
    background: randomChoose(bgColors),
  });
};
