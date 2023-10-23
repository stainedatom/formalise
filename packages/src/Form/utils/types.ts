import { MouseEvent, DetailedHTMLProps, InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import { NextPage, PrevPage } from "./functions";

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
// type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
//   [Property in Key]-?: Type[Property];
// };
export type CustomOnClick = (e: MouseEvent<HTMLButtonElement>) => (void | typeof NextPage | typeof PrevPage | string)
export type NativeHTMLInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>
export type NativeHTMLSelectProps = DetailedHTMLProps<InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>
export type NativeHTMLTextAreaProps = DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>
export interface NativeHTMLButtonProps extends Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onClick'> {
  onClick?: CustomOnClick,
  ofat?: {of: string, at: number}
}