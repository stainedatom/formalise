'use client';

import { Input, Form, FormPage, Button, NextPage, PrevPage, Select, TextArea } from 'formalise';

export default function Page(){
  return (
    <>
      <Form initialValues={{nested: {field1: '', field2: ''}, options: ['Apple'], area: '', name: 'defaulted', email: '', password: '', selector: 'Hello', filetest: {nested: []}}} onSubmit={(data, e) => {console.log(data)}}>
        <FormPage>
          Hello
          <Input type='text' name='name' placeholder='Name'/>
          <Input name='password' type='password' as={<input type='password'/>}/>
          <Button as={<button onClick={() => NextPage}>Hello</button>}/>
        </FormPage>
        <FormPage>
          <Input type='email' name='email' placeholder='Email'/>
          <Button onClick={() => PrevPage}>Back</Button>
          <Select name='selector'>
            <option>
              Hello
            </option>
            <option>
              well
            </option>
          </Select>
          <TextArea name='area'/>
          {/* <Input type='radio' name='yesno' as={<input type='radio' value='yes'/>}/>
          <Input type='radio' name='yesno' as={<input type='radio' value='no'/>}/> */}
          <Input type='checkbox' name='options' as={<input type='checkbox' value='Apple'/>}/>
          <Input type='checkbox' name='options' as={<input type='checkbox' value='Orange'/>}/>
          <Input name='nested.field1' type='text'/>
          <Input name='nested.field2' type='text'/>
          <Input name='filetest.nested' type='file' as={<input type='file' multiple/>}/>
          <Button>Submit</Button>
        </FormPage>
      </Form>
    </>
  );
}