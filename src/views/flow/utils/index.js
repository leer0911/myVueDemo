const deepCopy = function (s, t = {}) {
  for (var i in s) {
    if (typeof s[i] === 'object') {
      t[i] = s[i].constructor === Array ? [] : {};
      deepCopy(s[i], t[i]);
    } else {
      t[i] = s[i];
    }
  }
  return t;
}
const getElementOffset = function (element, targetId) {
  // 获取某元素相对于指定ID元素的偏移量，有translate的情况则不适合
  let {
    offsetLeft: left,
    offsetTop: top
  } = element;
  let current = element.offsetParent;

  while (current.offsetParent.id !== targetId) {
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent;
  }
  return {
    top,
    left
  };
}

const pxToNumber = function (s) {
  return Number(s.replace('px', ''))
}

const getEleTopAndLeft = function (ele) {
  const {
    left,
    top
  } = ele.getBoundingClientRect()
  const {
    scrollLeft,
    scrollTop
  } = document.documentElement
  return {
    top: top + scrollTop,
    left: left + scrollLeft
  }
}

const getRelativePosition = function (son, parent) {
  const {
    left: sonLeft,
    top: sonTop
  } = getEleTopAndLeft(son)
  const {
    left: parentLeft,
    top: parentTop
  } = getEleTopAndLeft(parent)
  return {
    top: sonTop - parentTop,
    left: sonLeft - parentLeft
  }
}


export {
  deepCopy,
  getElementOffset,
  pxToNumber,
  getEleTopAndLeft,
  getRelativePosition
};