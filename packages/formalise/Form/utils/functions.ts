import { MouseEvent } from "react";

export const getPropValue = function(obj: any, path: string) {
  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, '');           // strip a leading dot
  var a = path.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in obj) {
          obj = obj[k];
      } else {
          return;
      }
  }
  return obj;
}

export const updateObjProp = (obj: any, value: any, propPath: string) => {
  const [head, ...rest] = propPath.split('.');

  !rest.length
      ? obj[head] = value
      : updateObjProp(obj[head], value, rest.join('.'));
}

export function NextPage(e: MouseEvent<HTMLButtonElement>){
  e.preventDefault();
  //createElement will take over...
  //we pretty much use this as a pure reference
}

export function PrevPage(e: MouseEvent<HTMLButtonElement>){
  e.preventDefault();
  //createElement will take over...
  //we use this almost as a pure reference
}