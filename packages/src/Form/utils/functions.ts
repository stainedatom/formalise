import { MouseEvent } from "react";
import _ from 'lodash';
import { ZodObject } from "zod";

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

export const getObjPropSchema = function(obj: ZodObject<any> | undefined, path: string){
  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, '');           // strip a leading dot
  var a = path.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in obj?.shape) {
          obj = obj?.shape[k];
      } else {
          return;
      }
  }
  return obj;
}

export const addProps = (obj: any, arr: string | string[], val: any) => {

  if (typeof arr == 'string')
      arr = arr.split(".");

  obj[arr[0]] = obj[arr[0]] || {};

  var tmpObj = obj[arr[0]];

  if (arr.length > 1) {
      arr.shift();
      addProps(tmpObj, arr, val);
  }
  else
      obj[arr[0]] = val;

  return obj;
}

export const isDeeplyEmpty: (item: any) => boolean = (item) => {
  if(typeof item === 'boolean') return !item;
  else if(typeof item === 'number') return false;
  else if(typeof item === 'object') {
    return Object.keys(item).every(k => {
      if(['object', 'boolean', 'number'].includes(typeof item[k])) {
        return isDeeplyEmpty(item[k]);
      }
      return _.isEmpty(item[k]);
    })
  }
  return !item;
};

export const updateObjProp = (obj: any, value: any, propPath: string) => {
  const [head, ...rest] = propPath.split('.');
  const parsedHead = parseInt(head);

  const cleanedHead = isNaN(parsedHead) ? head : parsedHead;

  !rest.length
      ? obj[cleanedHead] = value
      : updateObjProp(obj[cleanedHead], value, rest.join('.'));
}

export function NextPage(e: MouseEvent<HTMLButtonElement>){
  e.preventDefault();
  //createElement will take over...
  //we pretty much use this as a pure reference
  //might as well use a primitive for better performance but let's think about it later
}

export function PrevPage(e: MouseEvent<HTMLButtonElement>){
  e.preventDefault();
  //createElement will take over...
  //we use this almost as a pure reference
}

export function Delete(e: MouseEvent<HTMLButtonElement>){
  e.preventDefault();
  //createElement will take over...
  //we use this almost as a pure reference
}

export function Push(to: string): string {
  return to;
}