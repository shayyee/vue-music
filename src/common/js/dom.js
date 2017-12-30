/**
 * dom 常用操作
 */
export function addClass(el, className) {
    /**
     * 添加一个class
     */
    if(hasClass(el, className)) {
        return
    }
    if(el.className) {
        let newClass = el.className.split(' ')
        newClass.push(className)
        el.className = newClass.join(' ')
    }else{
        el.className = className
    }
}

export function hasClass(el, className) {
    /**
     * 判断是否有某个class
     */
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className)
}

export function getData(el, name, val) {
  let prefix = 'data-';
  name = prefix + name;
  if(val) {
    return el.setAttribute(name, val);
  } else {
    return el.getAttribute(name);
  }
}