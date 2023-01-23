/* eslint-disable */
import { useQuery } from "urql"
import { useState } from "react"
import Wn from "./Wn"
// import {FixedSizeList} from "react-window"
import { PushedOr } from "./Wn"
import { defFetchedData, defShowPush, FetchedData, FilterOp, InheritSearchOp, RootViewOption, SearchForm, ShowForm, WnType } from "../type/type"
import { useAtom } from "jotai"
import { convertif_tonv, convert_spell_fromnv, filterOpAtom, isSearchSubmitAtom, nvmode, pushedOrAtom, rootViewOptionAtom, searchFormAtom, showFormAtom } from "../type/jotai"
import {  asciiSortFn, objectPropertyASCIIsort, objectSortBy } from "../type/util"
const Ko = ({ show, setShow }: { show: any, setShow: any }) => {
  const toggle = (_: any) => {
    setShow(!show)
  }
  const state = () => {
    return show
  }
  return (<>
    <h1>{state() ? "show!" : "hide..."}</h1>
    <button onClick={toggle}>button</button>
  </>)
}
const Tameshi = () => {
  const [show, setShow] = useState(false)
  return (<>
    <Ko setShow={setShow} show={show} />
  </>)
}
const SearchResultList = ({
  // filters
  // , view
  // , setView
  // , showPush
  // , setShowPush
  // , filter
  // , setFilter
  // , form
  // , setForm
  searchop
}
  : {
    // filters: SearchForm
    // , view: RootViewOption
    // , setView: any
    // , showPush: PushedOr
    // , setShowPush: any
    // , form: ShowForm
    // , setForm: any
    // , filter: FilterOp
    // , setFilter: any
    searchop: InheritSearchOp
  }
) => {
  const [isSubmit] = useAtom(isSearchSubmitAtom)
  const [filters] = useAtom(searchFormAtom)
  // const [view, setView] = useAtom(rootViewOptionAtom)
  // const [showPush, setShowPush] = useAtom(pushedOrAtom)
  // const [form, setForm] = useAtom(showFormAtom)
  const [filter] = useAtom(filterOpAtom)
  const [spellnv, setSpellnv] = useAtom(nvmode)

  // if (!isSubmit) return <div className="list side" />
  // error message: rendered more hooks than previous render, useQueryする前に早めのreturnは不可能

  const filters_trimmed = Object.entries(filters).reduce((d, [key, value]) => {
    const value_trimmed = ([
      "spell"
    ].includes(key)) ? value.trim() : value
    d[key as keyof SearchForm] = value_trimmed
    return d
  }, {
    spell: ""
    , sep: ""
    , glojp: ""
    , glo: ""
    , lmsjp: ""
    , lms: ""
    , exjp: ""
    , ex: ""
    , childSize: ""
  })
  const { lmsjp, spell, sep, glojp, exjp, lms, glo, ex, childSize } = filters_trimmed

  const query = searchop.deeper ?
    `
      query Wns($where: wnWhere, $options: wnOptions) {
        wns(where: $where, options: $options) {
          createdAt
          spell
          seps
          sep
          glo
          glojp
          lmsjp
          lms
          lmspush {
            push
            pusher {
              name
              id
            }
            lang
            id
          }
          lmsjppush {
            push
            pusher {
              name
              id
            }
            lang
            id
          }
          ex
          exjp
          depth
          childSize
          sisonSize
          jwlj {
            createdAt
            spell
            seps
            sep
            glo
            glojp
            lmsjp
            lms
            lmspush {
              push
              pusher {
                name
                id
              }
              lang
              id
            }
            lmsjppush {
              push
              pusher {
                name
                id
              }
              lang
              id
            }
            ex
            exjp
            depth
            childSize
            sisonSize
          }
          jwlk {
            createdAt
            spell
            seps
            sep
            glo
            glojp
            lmsjp
            lms
            lmspush {
              push
              pusher {
                name
                id
              }
              lang
              id
            }
            lmsjppush {
              push
              pusher {
                name
                id
              }
              lang
              id
            }
            ex
            exjp
            depth
            childSize
            sisonSize
          }
        }
      }
      `
    :
    `
      query Wns($where: wnWhere, $options: wnOptions) {
        wns(where: $where, options: $options) {
          createdAt
          spell
          seps
          sep
          glo
          glojp
          lmsjp
          lms
          lmspush {
            push
            pusher {
              name
              id
            }
            lang
            id
          }
          lmsjppush {
            push
            pusher {
              name
              id
            }
            lang
            id
          }
          ex
          exjp
          depth
          childSize
          sisonSize
        }
      }
      `
  const multi = {
    glojp
    , glo
    , lmsjp
    , lms
    , exjp
    , ex
  }
  type Variables = {
    where: {
      sep_CONTAINS: string
      AND: any[]
      spell?: string
      spell_CONTAINS?: string
    },
    options: {
      sort: any[]
    },
  }
  let vars: Variables = {
    where: {
      sep_CONTAINS: sep,
      // glojp_CONTAINS: glojp,
      // glo_CONTAINS: glo,
      AND: [] as any[],
    },
    options: {
      sort: [
        // {
        //   spell: "ASC"
        // }
        // めっちゃ重くなったが……
      ]
    }
  }
  if (childSize !== '' && childSize !== undefined) {
    const int = parseInt(childSize)
    if (typeof int === 'number') {
      vars.where.AND.push({
        childSize: int
      })
    }
  }
  if (spell.length > 0) {
    const converted_spell = spellnv ? convert_spell_fromnv(spell) : spell
    if (filter.spell.compMatch) {
      vars.where.spell = converted_spell
    } else {
      vars.where.spell_CONTAINS = converted_spell
    }
  }
  const glos = { glojp, glo }
  for (const [key, g] of Object.entries(glos)) {
    if (g === "") continue
    const trimmed = g.trim()
    const words = trimmed.split(/\s+/)
    if (words.length === 1) {
      if (g.startsWith(" ")) words[0] = " " + words[0]
      if (g.endsWith(" ")) words[0] = words[0] + " "
    }
    const ands: any = { AND: [] }
    words.forEach(word => {
      const o: any = {}
      o[`${key}_CONTAINS`] = word
      ands.AND.push(o)
    })
    vars.where.AND.push(ands)
  }
  if (lmsjp != "") {
    const words = lmsjp.split(/\s+/)
    const ands: {
      and: ({ lmsjp_INCLUDES: string } | { lmjp_CONTAINS: string })[]
      andsome: { lmsjppush_SOME: { push: string } }[]
    } = { and: [], andsome: [] }
    words.forEach(word => {
      const x = filter.lmsjp.compMatch ? { lmsjp_INCLUDES: word } : { lmjp_CONTAINS: word }
      ands.and.push(x)
      const y = { lmsjppush_SOME: { push: word } }
      ands.andsome.push(y)
    })
    const push_obj = {
      OR: [
        { AND: ands.and }
        , { AND: ands.andsome }
      ]
    }
    vars.where.AND.push(push_obj)
  }

  type LmsCompMatch = { OR: ({ lms_INCLUDES: string } | { lm_CONTAINS: string })[] }
  type LmspushCompMatch = { OR: { lmspush_SOME: { push: string } }[] }

  if (lms != "") {
    const words = lms.split(/\s+/)
    const ands: {
      and: LmsCompMatch[]
      andsome: LmspushCompMatch[]
    } = { and: [], andsome: [] }
    words.forEach(word => {
      const capital_variants = [word, word.toLowerCase(), word[0].toUpperCase() + word.slice(1)]
      const or: LmsCompMatch = { OR: [] }
      const ors: LmspushCompMatch = { OR: [] }
      for (const word of capital_variants) {
        const x = filter.lms.compMatch ? { lms_INCLUDES: word } : { lm_CONTAINS: word }
        or.OR.push(x)
        const y = { lmspush_SOME: { push: word } }
        ors.OR.push(y)
      }
      ands.and.push(or)
      ands.andsome.push(ors)
    })
    // console.log("ands",ands)
    const push_obj = {
      OR: [
        { AND: ands.and }
        , { AND: ands.andsome }
      ]
    }
    vars.where.AND.push(push_obj)
  }

  const [{ data, fetching, error }, redoQuery] = useQuery({ query, variables: vars })
  if (fetching) return <div className="list side">Loading...</div>;
  if (error) return <div className="list side">Oh no... {error.message}</div>;

  // <FixedSizeList
  //     itemCount={1000}
  //     height={100}
  //     width={window.innerWidth}
  //     layout="vertical"
  //     itemSize={100}
  //     direction="ltr"
  //     >
  const datatyped = (data ?? defFetchedData) as FetchedData

  console.log("rendered List, filterOp: ", filter)
  return (<div className="list side">
    <h2>検索結果({data.wns.length})</h2>
    <ol>
      {datatyped.wns.length === 0 ? "見つかりませんでした" :
        <>{objectSortBy(asciiSortFn)<WnType>(wn => convertif_tonv(wn.spell, spellnv))(datatyped.wns).map(wn => (
          <li key={wn.spell} className="wn">
            <Wn
              wn={wn}
              // view={view}
              // setView={setView}
              showHyper={false}
              // showPush={showPush??defShowPush}
              // setShowPush={setShowPush}
              // form={form}
              // setForm={setForm}
              // filter={filter}
              // setFilter={setFilter}
              searchop={searchop}
            />
          </li>
        ))}</>
      }
    </ol>
  </div>)
}
export default SearchResultList

















