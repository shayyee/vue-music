/**
 * Created by lenovo on 2018/4/28.
 */
// [min, max]
function getRandomInit(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 乱序函数
export function shuffle(arr) {
  for(let i = 0; i < arr.length; i++) {
    let j = getRandomInit(0,i);
    let t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr
}