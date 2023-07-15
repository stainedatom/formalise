'use client'

import { Form, FormPage, NextPage, PrevPage, Button } from "formalise";
import styles from './app.module.css';
import { InputHTMLAttributes, useState, FC } from "react";

export default function Page() {

  const init = {
    field1: '',
    field2: '',
    field3: 'Default value for field 3...',
    field4: '',
    field5: '',
    field6: '',
    field7: 'radiocheck1',
    color: [],
    field8: false
  }

  const [field1, setField1] = useState<string>('');

  return (
    <>
      Hello
    </>
  );
}

const Input: FC<InputHTMLAttributes<HTMLInputElement>> = (props) => {
  return (
    <input {...props}/>
  );
}