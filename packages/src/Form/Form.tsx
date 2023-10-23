'use client';

import { useContext, MouseEvent, FC, FormEvent, useState, CSSProperties, ReactElement, createElement, JSXElementConstructor, ReactPortal, ChangeEvent, ReactNode, Children, Dispatch, SetStateAction, cloneElement, ReactFragment, useEffect, useLayoutEffect, useRef } from "react";
import { getPropValue, updateObjProp } from "./utils/functions";
import { XOR, NativeHTMLButtonProps, NativeHTMLInputProps, NativeHTMLSelectProps, NativeHTMLTextAreaProps, CustomOnClick } from "./utils/types";
import { NextPage, PrevPage, Delete, addProps, isDeeplyEmpty, getObjPropSchema } from "./utils/functions";
import { FormContext, ValidatorContext } from "./FormContext";
import { cloneDeep } from "lodash";
import { z } from 'zod';

export type FieldStructure = {
  name: string
} & (({
  as: 'input'
} & NativeHTMLInputProps) | ({
  as: 'select'
} & NativeHTMLSelectProps) | ({
  as: 'textarea'
} & NativeHTMLTextAreaProps) | ({
  as: FC
} & {[x: string]: any}));

export const Field: FC<FieldStructure> = (props) => {
  const { name, as, ...rest } = props;
  const { validationSchema, initialValues, setValidators, entries, setEntries, setParticularEntry } = useContext(FormContext);

  return createElement<any>(props.as, {
    value: props.type === 'file' ? undefined : getPropValue(entries, name),
    ...rest, //radio button and/or checkbox requires user-input value, so Formalise should not override
    name: name,
    checked: props.type === 'radio' ? getPropValue(entries, name) === props.value : props.type === 'checkbox' ? (props.multiple ? getPropValue(entries, name).includes(props.value) : getPropValue(entries, name)) : undefined,
    onChange: (e: ChangeEvent<HTMLInputElement>) => { //mutating states as we do in the following shallow copies will not be problematic because Field has no memoised child component that depends on the mutated
      if(props.type === 'checkbox' && props.multiple){
        if(getPropValue(entries, name).includes(props.value)){
          let newEntries = {...entries};
          const i = getPropValue(newEntries, name).indexOf(props.value);
          getPropValue(newEntries, name).splice(i, 1);
          setEntries(newEntries);
        }//remove
        else{
          let newEntries = {...entries};
          getPropValue(newEntries, name).push(props.value);
          setEntries(newEntries);
        }//append
      }
      else if(props.type === 'file'){
        setParticularEntry(name, e.target.files);
      }
      else{
        setParticularEntry(name, props.type === 'checkbox' ? !getPropValue(entries, name) : e.target.value);
      }
      setValidators((prev: ValidatorContext) => {
        let newValidators = {...prev};
        addProps(newValidators.touched, name, true);
        if(e.target.value !== getPropValue(initialValues, name)) addProps(newValidators.dirty, name, true);
        else addProps(newValidators.dirty, name, false);
        if(isDeeplyEmpty(newValidators.touched)) addProps(newValidators.aggregate, 'touched', false);
        else addProps(newValidators.aggregate, 'touched', true);
        if(isDeeplyEmpty(newValidators.dirty)) addProps(newValidators.aggregate, 'dirty', false);
        else addProps(newValidators.aggregate, 'dirty', true);
        try{
          const shapeOfCurrent = getObjPropSchema(validationSchema, name);
          shapeOfCurrent?.parse(e.target.value);
          addProps(newValidators.errors, name, false);
        }
        catch{
          addProps(newValidators.errors, name, true);
        }
        let newEntries = {...entries};
        addProps(newEntries, name, e.target.value);
        if(validationSchema?.safeParse(newEntries).success) addProps(newValidators.aggregate, 'errors', false);
        else addProps(newValidators.aggregate, 'errors', true);
        return newValidators;
      });
      if(props.onChange) props.onChange(e);
    }
  });
}

export interface PageStructure {
  style?: CSSProperties,
  className?: string,
  children: (string | number | boolean | null | undefined | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal) | (string | number | boolean | null | undefined | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal)[] | ((validators: ValidatorContext, data: any, fieldSetter: (name: string, value: any) => void, currentPage: number, pageSetter: Dispatch<SetStateAction<number>>) => ReactElement)
}

export const FormPage: FC<PageStructure> = ({ style, className, children }) => {
  const { validators, entries, setParticularEntry, activePage, setActivePage } = useContext(FormContext);

  let entriesToRender: (string | number | boolean | null | undefined | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal)[];
  
  if(typeof children === 'function'){
    entriesToRender = ['defer'];
  }
  else{
    if(Array.isArray(children)) entriesToRender = children;
    else entriesToRender = [children];
  }
  
  return (
    <div style={style} className={className}>
      {typeof children !== 'function' ? entriesToRender.map((child) => child) : children(validators, entries, setParticularEntry, activePage, setActivePage)}
    </div>
  )
}

export interface FormStructure {
  style?: CSSProperties,
  className?: string,
  children: ReactElement<PageStructure, FC<PageStructure>> | ReactElement<PageStructure, FC<PageStructure>>[],
  initialValues: any,
  onSubmit?: (data: any, e: FormEvent<HTMLFormElement>) => void,
  validationSchema?: z.ZodObject<any>
}

export const Form: FC<FormStructure> = ({ style, className, children, initialValues, onSubmit, validationSchema }) => {
  const clonedInitialValues = cloneDeep(initialValues);
  const [entries, setEntries] = useState<any>(clonedInitialValues);
  const [activePage, setActivePage] = useState<number>(0);
  const [validators, setValidators] = useState<ValidatorContext>({touched: {}, dirty: {}, errors: {}, aggregate: {touched: false, dirty: false, errors: !validationSchema?.safeParse(initialValues).success || false}});

  function setParticularEntry(name: string, value: any){
    setEntries((prev: any) => {
      let newEntries = {...prev};
      updateObjProp(newEntries, value, name);
      return newEntries;
    });
  }

  // function setParticularEntry(name: string, value: any){
  //   let newEntries = {...entries}
  //   updateObjProp(newEntries, value, name);
  //   setEntries(newEntries);
  // }

  let pagesToRender: ReactElement<PageStructure, FC<PageStructure>>[];
  if(Array.isArray(children)) pagesToRender = children;
  else pagesToRender = [children];

  //now we know for sure that pagesToRender is an array of the FormPage components.
  //we want to first render only the first page.
  
  return (
    <FormContext.Provider value={{validators, setValidators, entries, setEntries, activePage, setActivePage, setParticularEntry, initialValues, validationSchema}}>
      <form style={style} className={className} onSubmit={(e) => {
        e.preventDefault();
        if(onSubmit) onSubmit(entries, e);
      }}>
        {createElement(pagesToRender[activePage].type, {...pagesToRender[activePage].props})}
      </form>
    </FormContext.Provider>
  );
}

export type ButtonStructure = XOR<NativeHTMLButtonProps, {onClick?: CustomOnClick, as?: FC} & {[x: string]: any}>

export const Button: FC<ButtonStructure> = (props) => {
  const { as, onClick, ...rest } = props;
  const { activePage, setActivePage, entries, setEntries } = useContext(FormContext);

  
    return createElement<any>(props.as || 'button', {
      ...rest,
      type: props.type || 'button',
      onClick: onClick ? (e: MouseEvent<HTMLButtonElement>) => {
        const returnVal = onClick(e);
        if(returnVal === NextPage){
          NextPage(e);
          //do real logic for next page
          setActivePage(() => activePage + 1);
        }
        else if(returnVal === PrevPage){
          PrevPage(e);
          //do real logic for prev page
          setActivePage(() => activePage - 1);
        }
        else if(returnVal === Delete){
          Delete(e);
          //do real logic for removal of item from FieldArray
          let newEntries = {...entries};
          getPropValue(newEntries, props.ofat.of).splice(props.ofat.at, 1);
          setEntries(newEntries);
        }
        else if(typeof returnVal === 'string'){
          e.preventDefault();
          let newEntries = {...entries};
          const currentArray = getPropValue(newEntries, returnVal);
          const keys = Object.keys(currentArray[currentArray.length - 1]);
          currentArray.push(keys.reduce((a, v) => ({ ...a, [v]: ''}), {}));
          setEntries(newEntries);
        }//append item to FieldArray
      } : undefined
    });
}

export interface FieldsArrayStructure {
  name: string,
  children: ReactNode | ((index: number, length: number) => ReactElement)
}

export const FieldsArray: FC<FieldsArrayStructure> = ({ name, children }) => {
  const { entries } = useContext(FormContext);
  const values = getPropValue(entries, name);

  return (
    <>
      {values.map((value: any, index: number) => {
        return Children.map(typeof children !== 'function' ? children : children(index, values.length).props.children, (child) => {
          if(child?.type === Field){
            const fullName = `${name}.${index}.${child.props.name}`;
            return cloneElement(child, {name: fullName, value: getPropValue(value, child.props.name)});
          }
          else if(child?.type === Button){
            return cloneElement(child, {ofat: {of: name, at: index}});
          }
          else{
            return child === null || child === undefined || typeof child === 'boolean' || typeof child === 'string' || typeof child === 'number' ? child : cloneElement(child);
          }
        });
      })}
    </>
  );
}