'use client';

import { useContext, MouseEvent, FC, FormEvent, useState, CSSProperties, ReactElement, createElement, JSXElementConstructor, ReactPortal, ChangeEvent } from "react";
import { getPropValue, updateObjProp } from "./utils/functions";
import { XOR, NativeHTMLButtonProps, NativeHTMLInputProps, NativeHTMLSelectProps, NativeHTMLTextAreaProps } from "./utils/types";
import { NextPage, PrevPage } from "./utils/functions";
import { FormContext } from "./FormContext";


type InputStructure = XOR<NativeHTMLInputProps, {name: string, type: string, as: ReactElement<any>}>

export const Input: FC<InputStructure> = (props) => {
  const { name, as, type } = props;
  const { entries, setEntries } = useContext(FormContext);

  if(as){
    //if(type === 'checkbox') console.log(getPropValue(entries, name));
    return createElement(as.type, {value: type === 'file' ? undefined : getPropValue(entries, name), ...as.props, name,
      defaultChecked: type === 'radio' ? getPropValue(entries, name) === as.props.value : type === 'checkbox' ? getPropValue(entries, name).includes(as.props.value) : undefined,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        if(as.props.onChange) as.props.onChange(e);
        if(type === 'checkbox'){
          if(getPropValue(entries, name).includes(as.props.value)){
            let newEntries = {...entries};
            const i = getPropValue(newEntries, name).indexOf(as.props.value);
            getPropValue(newEntries, name).splice(i, 1);
            setEntries(newEntries);
          }//remove
          else{
            let newEntries = {...entries};
            getPropValue(newEntries, name).push(as.props.value);
            setEntries(newEntries);
          }//append
        }
        else if(type === 'file'){
          let newEntries = {...entries};
          updateObjProp(newEntries, e.target.files, name);
          setEntries(newEntries);
        }
        else{
          let newEntries = {...entries};
          updateObjProp(newEntries, e.target.value, name);
          setEntries(newEntries);
        }
      }
    });
  }
  else{
    return createElement('input', {value: type === 'file' ? undefined : getPropValue(entries, name), ...props,
      defaultChecked: type === 'radio' ? getPropValue(entries, name) === props.value : type === 'checkbox' ? getPropValue(entries, name).includes(props.value) : undefined,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        if(props.onChange) props.onChange(e);
        if(type === 'checkbox'){
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
        else if(type === 'file'){
          //do file handling
          let newEntries = {...entries};
          updateObjProp(newEntries, e.target.files, name);
          setEntries(newEntries);
        }
        else{
          let newEntries = {...entries};
          updateObjProp(newEntries, e.target.value, name);
          setEntries(newEntries);
        }
      }
    });
  }
}

type SelectStructure = XOR<NativeHTMLSelectProps, {name: string, as: ReactElement<any>}>

export const Select: FC<SelectStructure> = (props) => {
  const { name, as } = props;
  const { entries, setEntries } = useContext(FormContext);

  if(as){
    return createElement(as.type, {value: getPropValue(entries, name), ...as.props, name,
      onChange: (e: ChangeEvent<HTMLSelectElement>) => {
        if(as.props.onChange) as.props.onChange(e);
        let newEntries = {...entries};
        updateObjProp(newEntries, e.target.value, name);
        setEntries(newEntries);
      }
    });
  }
  else{
    return createElement('select', {value: getPropValue(entries, name), ...props,
      onChange: (e: ChangeEvent<HTMLSelectElement>) => {
        if(props.onChange) props.onChange(e);
        let newEntries = {...entries};
        updateObjProp(newEntries, e.target.value, name);
        setEntries(newEntries);
      }
    });
  }
}

type TextAreaStructure = XOR<NativeHTMLTextAreaProps, {name: string, as: ReactElement<any>}>

export const TextArea: FC<TextAreaStructure> = (props) => {
  const { name, as } = props;
  const { entries, setEntries } = useContext(FormContext);

  if(as){
    return createElement(as.type, {value: getPropValue(entries, name), ...as.props, name,
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
        if(as.props.onChange) as.props.onChange(e);
        let newEntries = {...entries};
        updateObjProp(newEntries, e.target.value, name);
        setEntries(newEntries);
      }
    });
  }
  else{
    return createElement('textarea', {value: getPropValue(entries, name), ...props,
      onChange: (e: ChangeEvent<HTMLTextAreaElement>) => {
        if(props.onChange) props.onChange(e);
        let newEntries = {...entries};
        updateObjProp(newEntries, e.target.value, name);
        setEntries(newEntries);
      }
    });
  }
}

interface PageStructure {
  style?: CSSProperties,
  className?: string,
  children: (string | number | boolean | null | undefined | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal) | (string | number | boolean | null | undefined | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal)[]
}

export const FormPage: FC<PageStructure> = ({ style, className, children }) => {
  let entriesToRender: (string | number | boolean | null | undefined | ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal)[];
  
  if(Array.isArray(children)) entriesToRender = children;
  else entriesToRender = [children];
  
  return (
    <div style={style} className={className}>
      {entriesToRender.map((entry, index) => {
        if(typeof entry === 'string' || typeof entry === 'number' || typeof entry === 'boolean' || entry === null || entry === undefined) return entry;
        else{
          return createElement(entry.type,
            {
              ...(entry as ReactElement<any, string | JSXElementConstructor<any>> | ReactPortal).props,
              key: index
            });
        }
      })}
    </div>
  )
}

interface FormStructure {
  style?: CSSProperties,
  className?: string,
  children: ReactElement<PageStructure, FC<PageStructure>> | ReactElement<PageStructure, FC<PageStructure>>[],
  initialValues: any,
  onSubmit?: (data: any, e: FormEvent<HTMLFormElement>) => void
}

export const Form: FC<FormStructure> = ({ style, className, children, initialValues, onSubmit }) => {
  const [entries, setEntries] = useState<any>(initialValues);
  const [activePage, setActivePage] = useState<number>(0)

  let pagesToRender: ReactElement<PageStructure, FC<PageStructure>>[];
  if(Array.isArray(children)) pagesToRender = children;
  else pagesToRender = [children];

  //now we know for sure that pagesToRender is an array of the FormPage components.
  //we want to first render only the first page.
  
  return (
    <FormContext.Provider value={{entries, setEntries, activePage, setActivePage}}>
      <form style={style} className={className} onSubmit={(e) => {
        e.preventDefault();
        if(onSubmit) onSubmit(entries, e);
      }}>
        {createElement(pagesToRender[activePage].type, {...pagesToRender[activePage].props})}
      </form>
    </FormContext.Provider>
  );
}

type ButtonStructure = XOR<NativeHTMLButtonProps, {as: ReactElement<any>}>

export const Button: FC<ButtonStructure> = (props) => {
  const { as, onClick } = props;
  const { activePage, setActivePage } = useContext(FormContext);

  if(as){
    return createElement(as.type, {...as.props,
      onClick: as.props.onClick ? (e: MouseEvent<HTMLButtonElement>) => {
        if(as.props.onClick(e) === NextPage){
          NextPage(e);
          //do real logic for next page
          setActivePage(() => activePage + 1);
        }
        else if(as.props.onClick(e) === PrevPage){
          PrevPage(e);
          //do real logic for prev page
          setActivePage(() => activePage - 1);
        }
      } : undefined
    });
  }
  else{
    return createElement('button', {...props,
      onClick: onClick ? (e: MouseEvent<HTMLButtonElement>) => {
        if(onClick(e) === NextPage){
          NextPage(e);
          //do real logic for next page
          setActivePage(() => activePage + 1);
        }
        else if(onClick(e) === PrevPage){
          PrevPage(e);
          //do real logic for prev page
          setActivePage(() => activePage - 1);
        }
      } : undefined
    });
  }
}