import { MouseEvent, DetailedHTMLProps, InputHTMLAttributes, ButtonHTMLAttributes } from "react";
import { NextPage, PrevPage } from "./functions";

export type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = (T | U) extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;
export type WithRequiredProperty<Type, Key extends keyof Type> = Type & {
  [Property in Key]-?: Type[Property];
};
export type NativeHTMLInputProps = WithRequiredProperty<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'name' | 'type'>
export type NativeHTMLSelectProps = WithRequiredProperty<DetailedHTMLProps<InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'name'>
export type NativeHTMLTextAreaProps = WithRequiredProperty<DetailedHTMLProps<InputHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>, 'name'>
export interface NativeHTMLButtonProps extends Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'onClick'> {
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | typeof NextPage | typeof PrevPage
}