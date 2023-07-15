import { Dispatch, SetStateAction, createContext } from "react"

interface IFormContext {
  entries: any,
  setEntries: Dispatch<SetStateAction<any>>,
  activePage: number,
  setActivePage: Dispatch<SetStateAction<number>>
}

export const FormContext = createContext<IFormContext>({entries: null, setEntries: () => {}, activePage: 0, setActivePage: () => {}});