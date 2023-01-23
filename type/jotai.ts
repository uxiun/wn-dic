import {useAtom, atom} from "jotai"
import { PushedOr } from "../pages/Wn"
import { defFilterOp, defForm, defShowPush, defView, emptySearchForm, FilterOp, RootViewOption, SearchForm, ShowForm, WnType } from "./type"
export const nvmode = atom(true)
export const selectedSynsetsAtom = atom<WnType[]>([])

export const convert_spell_fromnv = (spell: string) => {
  return spell.replace("n", ",").replace("v",".")
}
export const convert_spell_tonv = (spell: string) => {
  return spell.replace(",", "n").replace(".","v")
}

export const convertif_tonv = (toConvert: string, nvmode: boolean) => nvmode ? toConvert.replace(",", "n").replace(".","v") : toConvert
export const convertif_fromnv = (converted: string, nvmode: boolean) => nvmode ? converted.replace("n", ",").replace("v",".") : converted


export const rootViewOptionAtom = atom<RootViewOption>(defView)
export const searchFormAtom = atom<SearchForm>(emptySearchForm)
export const filterOpAtom = atom<FilterOp>(defFilterOp)
export const pushedOrAtom = atom<PushedOr>(defShowPush)
export const showFormAtom = atom<ShowForm>(defForm)
export const isSearchSubmitAtom = atom(false)