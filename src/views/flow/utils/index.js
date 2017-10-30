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
    console.log(current.offsetLeft)
    left += current.offsetLeft;
    top += current.offsetTop;
    current = current.offsetParent;
    // console.log(current)
  }
  return {
    top,
    left
  };
}


export {
  deepCopy,
  getElementOffset
};