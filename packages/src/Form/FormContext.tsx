import { Dispatch, SetStateAction, createContext } from "react"
import { z } from "zod";

interface IValidators {
  touched?: any,
  dirty?: any,
  errors?: any,
  aggregate?: {
    touched: boolean,
    dirty: boolean,
    errors: boolean
  }
}

export type ValidatorContext = IValidators | null;

interface IFormContext {
  validators: ValidatorContext,
  setValidators: Dispatch<SetStateAction<ValidatorContext>>
  entries: any,
  setEntries: Dispatch<SetStateAction<any>>,
  activePage: number,
  setActivePage: Dispatch<SetStateAction<number>>,
  setParticularEntry: (name: string, value: any) => void,
  initialValues: any,
  validationSchema?: z.ZodObject<any>
}

export const FormContext = createContext<IFormContext>({validators: {aggregate: {touched: false, dirty: false, errors: false}}, setValidators: () => {}, entries: null, setEntries: () => {}, activePage: 0, setActivePage: () => {}, setParticularEntry: () => {}, initialValues: {}, validationSchema: z.object({})});