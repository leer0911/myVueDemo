export default {
  deepCopy(s, t = {}) {
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
}
