/**
 * Created by 大白胡子 on 2017/6/22.
 */
export function addClass(el,className){
  if(hasClass(el,className)){
    return;
  }
  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}
export function hasClass(el,className){
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}
