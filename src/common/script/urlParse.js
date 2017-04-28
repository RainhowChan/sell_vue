export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substring(1).split('=');
      obj[decodeURIComponent(tempArr[0])] = tempArr[1];
    });
  }
  return obj;
}
