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

let elementStyle = document.createElement('div').style;
let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if(elementStyle[transformNames[key]] !== undefined) {
      return key;
    }
  }

  return false
})();

export function prefixStyle(style) {
  if(vendor === false) {
    return false;
  }

  if(vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}