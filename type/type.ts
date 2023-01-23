import { Path, useForm, SubmitHandler, UseFormRegister, FieldValues } from "react-hook-form"
import { PushedOr } from "../pages/Wn"
const infonames = {
    spell: "spell"
    , sep: "sep"
    , lmsjp: "lmsjp"
    , lms: "lms"
    , glojp: "glojp"
    , glo: "glo"
    , ex: "ex"
    , exjp: "exjp"
} as const

export type InfoNames = typeof infonames[keyof typeof infonames]

export type NamesHasAddition = "lms" | "lmsjp"

export type InheritSearchOp = {
    match: MatchOp
    , view: ViewOp
    , range: RangeOp
    , deeper: boolean
}

export type MatchOp = {
    complete: InfoNames[]
}

export type ViewOp = {
    view: InfoNames[]
}

export type RangeOp = {
    addition: NamesHasAddition[]
}

export type FormValue = {

}

export const defxsearchxop: InheritSearchOp = {
    match: {
        complete: []
    }
    , view: {
        view: []
    }
    , range: {
        addition: []
    }
    , deeper: false
}

export interface SimpleViewOption {
    spell: boolean
    sep: boolean
    glo: boolean
    glojp: boolean
    lms: boolean
    lmsjp: boolean
    ex: boolean
    exjp: boolean
}
export type RootViewOption = {
    spell: boolean
    sep: boolean
    glo: boolean
    glojp: boolean
    lms: boolean
    lmsjp: boolean
    lmseach: EachShowOp
    lmsjpeach: EachShowOp
    ex: boolean
    exjp: boolean
}
export const defView: RootViewOption = {
    spell: true,
    sep: true,
    glo: true,
    glojp: true,
    lms: true,
    lmsjp: true,
    lmseach: {},
    lmsjpeach: {},
    ex: false,
    exjp: false,
}
export type Filter = {
    duration: number,
    updatedAt: number,
    submit: boolean,
    lmsjp: string,
    spell: string,
    sep: string,
    glojp: string
}
export type SearchForm = {
    spell: string,
    sep: string,
    glojp: string,
    glo: string,
    lmsjp: string,
    lms: string,
    exjp: string,
    ex: string,
    childSize: string,
}
export const emptySearchForm: SearchForm = {
    spell: "",
    sep: "",
    glo: "",
    glojp: "",
    lms: "",
    lmsjp: "",
    ex: "",
    exjp: "",
    childSize: "",
}
export const wnzokusei = [
    "spell",
    "sep",
    "glo",
    "glojp",
    "lms",
    "lmsjp",
    "ex",
    "exjp",
] as const

export interface ViewOption {
    f: { [key in typeof wnzokusei[number]]: boolean }
}
export interface CheckboxProps<T extends FieldValues> {
    register: UseFormRegister<T>;
    path: Path<T>;
    label: string;
    checked: boolean;
}
export interface MetaToggle {
    viewOp: boolean
}
export type EachShowOp = {
    [spell: string]: boolean
}
export type showListOp = {
    lms: boolean,
    lmsjp: boolean,
}
export type FilterOpMatch = {
    compMatch: boolean
}
export type FilterOp = {
    spell: FilterOpMatch
    lms: FilterOpMatch
    lmsjp: FilterOpMatch
}
export const defShowPush = {
    lms: true,
    lmsjp: true,
}
export const defForm: ShowForm = {
    spell: false,
    sep: false,
    glo: false,
    glojp: false,
    lms: false,
    lmsjp: false,
    ex: false,
    exjp: false,
    spelleach: {},
    sepeach: {},
    gloeach: {},
    glojpeach: {},
    lmseach: {},
    lmsjpeach: {},
    exeach: {},
    exjpeach: {},
}
export type ShowForm = {
    spell: boolean,
    sep: boolean,
    glo: boolean,
    glojp: boolean,
    lms: boolean,
    lmsjp: boolean,
    ex: boolean,
    exjp: boolean,
    spelleach: EachShowOp,
    sepeach: EachShowOp,
    gloeach: EachShowOp,
    glojpeach: EachShowOp,
    lmseach: EachShowOp,
    lmsjpeach: EachShowOp,
    exeach: EachShowOp,
    exjpeach: EachShowOp,
}
const eachshowops = {
    spelleach: "spelleach",
    sepeach: "sepeach",
    gloeach: "gloeach",
    glojpeach: "glojpeach",
    lmseach: "lmseach",
    lmsjpeach: "lmsjpeach",
    exeach: "exeach",
    exjpeach: "exjpeach",
} as const
const boolattrs = {
    spell: "spell"
    , sep: "sep"
    , glo: "glo"
    , glojp: "glojp"
    , lms: "lms"
    , lmsjp: "lmsjp"
    , ex: "ex"
    , exjp: "exjp"
} as const
export type AttrShowForm_EachShowOp = typeof eachshowops[keyof typeof eachshowops]
export type AttrShowForm_bool = typeof boolattrs[keyof typeof boolattrs]
export const defFilterOp: FilterOp = {
    spell: {
        compMatch: false,
    },
    lms: {
        compMatch: true,
    },
    lmsjp: {
        compMatch: false,
    }
}
export type URLQuery = {
    view: RootViewOption,
    form: ShowForm,
    showPush: PushedOr,
    filter: FilterOp,
    searchop?: InheritSearchOp,
    wn: any,
}
export const defURLQuery: URLQuery = {
    view: defView,
    form: defForm,
    showPush: defShowPush,
    filter: defFilterOp,
    searchop: defxsearchxop,
    wn: {},
}

export type WnType = {
    aliases?: string[]
    aliaseps?: string[][]
    childSize: number
    createdBy?: string
    depth: number
    dsrc?: string
    ex: string
    exjp: string
    exs: string[]
    exsjp: string[]
    glo: string
    glojp: string
    gsrc?: string
    id?: string
    identicalsIn?: WnType[]
    identicalsOut?: WnType[]
    jwlj?: WnType[]
    jwlk?: WnType[]
    lm: string
    lmjp: string
    lms: string[]
    lmsjp: string[]
    lmspush: string[]
    lmsjppush: string[]
    name?: string
    pos?: string
    princetonLink?: string
    relj?: WnType[]
    relk?: WnType[]
    sep: string
    seps: string[]
    sisonSize: number
    spell: string
    syndex?: number

    updateCount?: number
    //keifu: WnType[]
    createdAt?: string
    lastModified?: string
    // lmspush(where: PushWhere, options: PushOptions, directed: Boolean = true): [Push!]!
    // lmspushAggregate(where: PushWhere, directed: Boolean = true): wnPushLmspushAggregationSelection
    // lmsjppush(where: PushWhere, options: PushOptions, directed: Boolean = true): [Push!]!
    // lmsjppushAggregate(where: PushWhere, directed: Boolean = true): wnPushLmsjppushAggregationSelection
    // jwlk(where: wnWhere, options: wnOptions, directed: Boolean = true): [wn!]!
    // jwlkAggregate(where: wnWhere, directed: Boolean = true): wnwnJwlkAggregationSelection
    // jwlj(where: wnWhere, options: wnOptions, directed: Boolean = true): [wn!]!
    // jwljAggregate(where: wnWhere, directed: Boolean = true): wnwnJwljAggregationSelection
    // lmspushConnection(where: wnLmspushConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnLmspushConnectionSort!]): wnLmspushConnection!
    // lmsjppushConnection(where: wnLmsjppushConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnLmsjppushConnectionSort!]): wnLmsjppushConnection!
    // jwlkConnection(where: wnJwlkConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnJwlkConnectionSort!]): wnJwlkConnection!
    // jwljConnection(where: wnJwljConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnJwljConnectionSort!]): wnJwljConnection!
}
export type WnTypeSpellAbolished = {
    aliases?: string[]
    aliaseps?: string[][]
    childSize: number
    createdBy?: string
    depth: number
    dsrc?: string
    ex: string
    exjp: string
    exs: string[]
    exsjp: string[]
    glo: string
    glojp: string
    gsrc?: string
    id?: string
    identicalsIn?: WnType[]
    identicalsOut?: WnType[]
    jwlj?: WnType[]
    jwlk?: WnType[]
    lm: string
    lmjp: string
    lms: string[]
    lmsjp: string[]
    lmspush: string[]
    lmsjppush: string[]
    name?: string
    pos?: string
    princetonLink?: string
    relj?: WnType[]
    relk?: WnType[]
    sep?: string
    seps?: string[]
    sisonSize: number
    spell?: string
    syndex?: number

    updateCount?: number
    //keifu: WnType[]
    createdAt?: string
    lastModified?: string
    // lmspush(where: PushWhere, options: PushOptions, directed: Boolean = true): [Push!]!
    // lmspushAggregate(where: PushWhere, directed: Boolean = true): wnPushLmspushAggregationSelection
    // lmsjppush(where: PushWhere, options: PushOptions, directed: Boolean = true): [Push!]!
    // lmsjppushAggregate(where: PushWhere, directed: Boolean = true): wnPushLmsjppushAggregationSelection
    // jwlk(where: wnWhere, options: wnOptions, directed: Boolean = true): [wn!]!
    // jwlkAggregate(where: wnWhere, directed: Boolean = true): wnwnJwlkAggregationSelection
    // jwlj(where: wnWhere, options: wnOptions, directed: Boolean = true): [wn!]!
    // jwljAggregate(where: wnWhere, directed: Boolean = true): wnwnJwljAggregationSelection
    // lmspushConnection(where: wnLmspushConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnLmspushConnectionSort!]): wnLmspushConnection!
    // lmsjppushConnection(where: wnLmsjppushConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnLmsjppushConnectionSort!]): wnLmsjppushConnection!
    // jwlkConnection(where: wnJwlkConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnJwlkConnectionSort!]): wnJwlkConnection!
    // jwljConnection(where: wnJwljConnectionWhere, first: Int, after: string, directed: Boolean = true, sort: [wnJwljConnectionSort!]): wnJwljConnection!
}
export const defWn: WnType = {
    spell: "",
    sep: "",
    seps: [],
    sisonSize: 0,
    syndex: 0,
    depth: 0,
    dsrc: "",
    lm: "",
    lmjp: "",
    lms: [],
    lmsjp: [],
    lmsjppush: [],
    lmspush: [],
    princetonLink: "",
    ex: "",
    exjp: "",
    exs: [],
    exsjp: [],
    glo: "",
    glojp: "",
    gsrc: "",
    childSize: 0,
    name: "",
    pos: "",
    jwlj: [],
    jwlk: [],
}

export type CreateWnInput = {
    aliases?: string[]
    childSize: number
    createdBy?: string
    depth: number
    dsrc?: string
    ex: string
    exjp: string
    exs: string[]
    exsjp: string[]
    glo: string
    glojp: string
    gsrc?: string
    id?: string
    identicalsIn?: WnType[]
    identicalsOut?: WnType[]
    jwlj?: WnType[]
    jwlk?: WnType[]
    lm: string
    lmjp: string
    lms: string[]
    lmsjp: string[]
    lmspush: string[]
    lmsjppush: string[]
    name: string
    pos?: string
    princetonLink?: string
    relj?: WnType[]
    relk?: WnType[]
    sep: string
    seps: string[]
    sisonSize: number
    spell: string
    syndex?: number
}
export const emptyCreateWnInput: CreateWnInput = {
    childSize: 0
    ,depth: 0
    ,ex: ""
    ,exjp: ""
    ,exs: []
    ,exsjp: []
    ,glo: ""
    ,glojp: ""
    ,lm: ""
    ,lms: []
    ,lmsjp: []
    ,lmjp: ""
    ,lmsjppush: []
    ,lmspush: []
    ,name: ""
    ,sep: ""
    ,seps: []
    ,sisonSize: 0
    ,spell: ""
}

export type FetchedData = {
    wns: WnType[]
}
export const defFetchedData = {
    wns: [],
}
