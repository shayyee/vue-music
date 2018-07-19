/**
 * Created by lenovo on 2018/4/28.
 */
// [min, max]
function getRandomInit(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
// 乱序函数
export function shuffle(arr) {
  let _arr = arr.slice();
  for(let i = 0; i < _arr.length; i++) {
    let j = getRandomInit(0,i);
    let t = _arr[i];
    _arr[i] = _arr[j];
    _arr[j] = t;
  }
  return _arr
}

// 节流函数
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if(timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
