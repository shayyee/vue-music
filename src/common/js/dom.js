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
    let newClass = el.className.split(' ');
    newClass.push(className);
    el.className = newClass.join(' ');

}

export function hasClass(el, className) {
    /**
     * 判断是否有某个class
     */
    let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
    return reg.test(el.className);
}