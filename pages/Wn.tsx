import { SetStateAction, useState } from "react"
import { useQuery, useMutation } from "urql"
// import { SimpleViewOption, RootViewOption, ShowForm, FilterOp } from "./SearchBox"
import Link from "next/link"
import Create from "./Create"
import { AttrShowForm_EachShowOp, defFetchedData, defWn, EachShowOp, FetchedData, FilterOp, InheritSearchOp, RootViewOption, ShowForm, SimpleViewOption, URLQuery, WnType, WnTypeSpellAbolished } from "../type/type"
import { useAtom } from "jotai"
import { convertif_tonv, convert_spell_tonv, filterOpAtom, nvmode, pushedOrAtom, rootViewOptionAtom, searchFormAtom, selectedSynsetsAtom, showFormAtom } from "../type/jotai"
import { FetchEventResult } from "next/dist/server/web/types"
import { Button } from "@mui/material"
import { toBool } from "../type/util"
import { assertSynsetIdentical, convert_fromAbolished } from "../type/spelling"

type HypOf = {
  jwlj: WnType[]
  jwlk: WnType[]
}

type HypWrapperType = {
  of: WnType, isHypo: boolean, showHyper: boolean, view: RootViewOption, setView: any, showPush: PushedOr, setShowPush: any, form: ShowForm, setForm: any, operoot: OpeRoot, filter: FilterOp, setFilter: any
  , derives?: DeriveCloses
  , searchop: InheritSearchOp
}
const HypWrapperforUseQuery: React.FC<HypWrapperType> = (x: HypWrapperType) => {
  const rel = x.isHypo ? "jwlj" : "jwlk"
  const ofrel = x.of[rel] ?? []
  return ofrel.length > 0
    ? <>{
      ofrel.map((wn, wn_i) => <Wn
        key={"wn-component" + wn_i}
        wn={wn}
        // view={x.view}
        // setView={x.setView}
        // showPush={x.showPush}
        showHyper={x.showHyper}
        // form={x.form}
        // setForm={x.setForm}
        // setShowPush={x.setShowPush}
        operoot={x.operoot}
        // filter={x.filter}
        // setFilter={x.setFilter}
        derives={x.derives ?? []}
        searchop={x.searchop}
      />)
    }</>
    : <Hyp {...x} />
}

const Hyp = ({ of, isHypo, view, setView, showPush, setShowPush, showHyper, form, setForm, operoot, filter, setFilter
  , derives
  , searchop
}: {
  of: WnType, isHypo: boolean, showHyper: boolean, view: RootViewOption, setView: any, showPush: PushedOr, setShowPush: any, form: ShowForm, setForm: any, operoot: OpeRoot, filter: FilterOp, setFilter: any
  , derives?: DeriveCloses
  , searchop: InheritSearchOp
}) => {
  const rel = isHypo ? "jwlj" : "jwlk"
  const hoko = isHypo ? "hyper" : "hypo"
  const query = searchop.deeper ?
    `
        query Wns($where: wnWhere, $options: wnOptions) {
            wns(where: $where, options: $options) {
                ${rel} {
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
                    jwlk {
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
                    jwlj {
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
        }
    `
    :
    `
        query Wns($where: wnWhere, $options: wnOptions) {
            wns(where: $where, options: $options) {
                ${rel} {
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
  const vars = {
    where: {
      spell: of.spell
    },
    options: {
      sort: [
        {
          sisonSize: "ASC"
        }
      ],
    }
  }
  console.log("in <Hyp/> variables:", vars)
  const [{ data, fetching, error }, redoQuery] = useQuery({ query: query, variables: vars })
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  const classname = `rel ${rel}`
  // console.log(`${of.spell} showHyper: ${showHyper}`)
  const datatyped = (data ?? defFetchedData) as FetchedData
  return (
    <div className={classname}>
      {datatyped.wns.map((container, container_i: number) => {
        return (<ol key={`ol${container_i}`}>{
          container[rel]?.sort((j,k) => k.sisonSize - j.sisonSize) .map((wn, wni) => <li key={"li" + wni} >
            <Wn key={wn.spell}
              wn={wn}
              // view={view}
              // setView={setView}
              // showPush={showPush}
              showHyper={showHyper}
              // form={form}
              // setForm={setForm}
              // setShowPush={setShowPush}
              operoot={operoot}
              // filter={filter}
              // setFilter={setFilter}
              derives={derives}
              searchop={searchop}
            />
          </li>)
        }</ol>)
      })}
    </div>
  )
}


type OpeRoot = {
  hyper: any
  hypo: any
}
const defOpeRoot = {
  hyper: {},
  hypo: {},
}

const PushWord = ({ wn, push }: { wn: WnType, push: any }) => {
  const [deletedOr, setDeletedOr] = useState(false)
  const deleter = `
    mutation DeletePushes($where: PushWhere) {
        deletePushes(where: $where) {
          nodesDeleted
        }
      }
    `
  const varis = {
    where: { id: push.id }
  }
  const [{ error, data, fetching }, deletePush] = useMutation(deleter)
  const deleteSubmit = async (e: any) => {
    const { error, data } = await deletePush(varis)
    if (error) { console.error(error) } else {
      console.log(`deleted ${data.deletePushes.nodesDeleted} item`)
      setDeletedOr(true)
    }
  }
  return (<>{deletedOr ? "" :
    <div className="push word">
      <span>{push.push}</span>
      <button onClick={(e) => deleteSubmit(e)}>削除</button>
    </div>
  }</>)
}

type showMoreType = {
  hyper: boolean,
  hypo: boolean,
  inherited: boolean,
}
export interface PushedOr {
  lms: boolean
  lmsjp: boolean
}
const toggleWord = (d: boolean) => d ? "閉" : "展"

const LmsList = ({ view, wn, key, setView }: { view: RootViewOption, wn: WnType, key: string, setView: any }) => {
  // console.log("key:", key)

  // console.log(`wn[${key}]`, wn[key])



}

const expandtype = {
  hyper: "hyper"
  , hypo: "hypo"
  , inh: "inherited"
} as const
type ExpandType = typeof expandtype[keyof typeof expandtype]
type DeriveClose = {
  type: ExpandType
  , from: {
    spell: string
  }
  , function: (s: string) => (e: any) => void
}
type DeriveCloses = DeriveClose[]

const Wn = ({ wn
  // ,filter
  // ,setFilter
  // , view
  // , setView
  // , form
  // , setForm
  // , showPush
  , showHyper
  // , setShowPush
  , operoot
  , derives
  , searchop
}: {
  wn: WnTypeSpellAbolished
  // , view: RootViewOption
  // , setView: any
  // , showPush: PushedOr
  , showHyper: boolean
  // , form: ShowForm
  // , setForm: React.Dispatch<SetStateAction<ShowForm>>
  // , setShowPush: any
  , operoot?: OpeRoot
  // , filter: FilterOp
  // , setFilter: any
  , derives?: DeriveCloses
  , searchop: InheritSearchOp
}) => {
  // console.log("searchop", searchop)
  const [filters] = useAtom(searchFormAtom)
  const [view, setView] = useAtom(rootViewOptionAtom)
  const [showPush, setShowPush] = useAtom(pushedOrAtom)
  const [form, setForm] = useAtom(showFormAtom)
  const [filter, setFilter] = useAtom(filterOpAtom)
  const listtypes = ["lms", "lmsjp"]
  const pushes = ["lmspush", "lmsjppush"]
  // const wn_never_null = wn
  const wnconverted = convert_fromAbolished(wn ?? defWn)
  const push_query = `
    mutation UpdateWns($update: wnUpdateInput, $where: wnWhere) {
        updateWns(update: $update, where: $where) {
          info {
            nodesCreated
            relationshipsCreated
          }
          wns {
            lmspush {
              push
              lang
              pusher {
                name
              }
            }
            lmsjppush {
              push
              lang
              pusher {
                name
              }
            }
          }
        }
      }
    `
  const [{ data, fetching, error }, updWns] = useMutation(push_query)
  const [showCreate, setShowCreate] = useState(false)
  const [showForm, setShowForm] = useState<SimpleViewOption>({
    spell: false,
    sep: false,
    glo: false,
    glojp: false,
    lms: false,
    lmsjp: false,
    ex: false,
    exjp: false,
  })

  const [selectedSynsets, setSelectedSynsets] = useAtom(selectedSynsetsAtom)
  const switchSelect = () => {
    if (toBool (selectedSynsets.find(s => assertSynsetIdentical([s, wnconverted])))) {
      console.log("Wn個別項目にて選択解除")
      setSelectedSynsets(selectedSynsets.filter(s => !assertSynsetIdentical([s,wnconverted])))
    } else {
      console.log("Wnにて選択")
      setSelectedSynsets([...selectedSynsets, wnconverted])
    }
  }

  const [operot, setOperot] = useState<OpeRoot>(operoot ? operoot : defOpeRoot)
  const showAddForm = (key: string, spell: string) => (e: any) => {
    const c = showForm[key as keyof SimpleViewOption]
    setShowForm({ ...showForm, [key]: !c })
    const keyeach = (key + "each") as keyof ShowForm
    const eachop = form[keyeach] as EachShowOp
    const k = form[keyeach as AttrShowForm_EachShowOp][spell]
    if (k === undefined) {
      setForm({ ...form, [keyeach]: { ...eachop, [spell]: form[key as keyof ShowForm] } })
    } else {
      setForm({ ...form, [keyeach]: { ...eachop, [spell]: !k } })
    }
  }
  const pushFormOnChange = (key: string) => (e: any) => {
    setFormText({ ...formText, [key]: e.target.value })
  }
  const pushSubmit = (key: string) => async (e: any) => { //=>e は必須 asyncは後ろに
    e.preventDefault()
    const pushwords = formText[key as keyof FormText].split("\n")


    switch (key) {
      case "lmsjp": {
        for (const pushword of pushwords) {
          let variables = {
            where: {
              spell: wnconverted.spell
            },
            update: {
              lmsjppush: [
                {
                  connect: [
                    {
                      where: {
                        node: {
                          push: pushword,
                          pusher: {
                            name: "uxiun"
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
          const { error, data } = await updWns(variables)
          if (error) { console.error(error); break }
          if (data.updateWns.info.relationshipsCreated === 0) {
            let create = {
              where: {
                spell: wnconverted.spell
              },
              update: {
                lmsjppush: [
                  {
                    create: [
                      {
                        node: {
                          push: pushword,
                          lang: "ja",
                          pusher: {
                            connect: {
                              where: {
                                node: {
                                  name: "uxiun"
                                }
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
            const { error, data } = await updWns(create)
            if (error) { console.error(error); break }
          }
          setFormText({ lms: formText.lms, [key]: "" })
          setPushedOr({ ...pushedOr, [key]: true })
        }
        break
      }
      case "lms": {
        for (const pushword of pushwords) {
          let variables = {
            where: {
              spell: wn.spell
            },
            update: {
              lmspush: [
                {
                  connect: [
                    {
                      where: {
                        node: {
                          push: pushword,
                          pusher: {
                            name: "uxiun"
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          }
          const { error, data } = await updWns(variables)
          if (error) { console.error(error); break }
          if (data.updateWns.info.relationshipsCreated === 0) {
            let create = {
              where: {
                spell: wn.spell
              },
              update: {
                lmspush: [
                  {
                    create: [
                      {
                        node: {
                          push: pushword,
                          lang: "en",
                          pusher: {
                            connect: {
                              where: {
                                node: {
                                  name: "uxiun"
                                }
                              }
                            }
                          }
                        }
                      }
                    ]
                  }
                ]
              }
            }
            const { error, data } = await updWns(create)
            if (error) { console.error(error); break }
          }
          setFormText({ lmsjp: formText.lmsjp, [key]: "" })
          setPushedOr({ ...pushedOr, [key]: true })
        }
        break
      }
    }
  }
  const tglKokono = (key: string) => (e: any) => {

    if (key === "lms") {
      let each = view.lmseach[wnconverted.spell]
      if (each === undefined) {
        const n = { ...view, lmseach: { ...view.lmseach, [wnconverted.spell]: view.lms } }
        setView(n)
      } else {
        setView({ ...view, lmseach: { ...view.lmseach, [wnconverted.spell]: !each } })
      }
    } else if (key === "lmsjp") {
      let each = view.lmsjpeach[wnconverted.spell]
      if (each === undefined) {
        const n = { ...view.lmsjpeach, [wnconverted.spell]: view.lmsjp }
        setView({ ...view, lmsjpeach: n })
      } else {
        setView({ ...view, lmsjpeach: { ...view.lmsjpeach, [wnconverted.spell]: !each } })
      }
    }

    // console.log("after toggle view:", view)

  }

  type Kokomore = {
    [spell: string]: showMoreType
  }

  const [kokomore, setKokomore] = useState<Kokomore>({
    [wnconverted.spell]: {
      hyper: showHyper,
      hypo: false,
      inherited: showHyper,
    }
  })

  const [showMore, setshowMore] = useState<showMoreType>({
    hyper: showHyper,
    hypo: false,
    inherited: showHyper,
  })

  interface FormText {
    lms: string,
    lmsjp: string
  }
  const [formText, setFormText] = useState<FormText>({
    lms: "",
    lmsjp: ""
  })
  const [pushedOr, setPushedOr] = useState<PushedOr>({
    lms: false,
    lmsjp: false,
  })
  const [onceClicked, setOnceClicked] = useState<SimpleViewOption>({
    spell: false,
    sep: false,
    glo: false,
    glojp: false,
    lms: false,
    lmsjp: false,
    ex: false,
    exjp: false,
  })
  const tglkokomore = (d: string) => (e: any) => {
    const s = d as keyof showMoreType
    const rev = (s: string) => s === "hypo" ? "hyper" : "hypo"
    if (s === "inherited") {
      const koko = kokomore[wnconverted.spell]
      const before = koko[s]
      const before2 = koko.hyper
      const before_hypo = koko.hypo
      setOperot({ ...operot, hypo: wn })
      setKokomore({ ...kokomore, [wnconverted.spell]: { inherited: !before, hyper: !before2, hypo: before_hypo } }) //ここで.hyperも同時に更新するのが要。toggleshowMore("hyper")などで順番にやると上手くいかない。
    } else {
      const before = showMore[s]
      setshowMore({ ...showMore, [s]: !before })
      if (operot[s]) {

      } else {
        setOperot({ ...operot, [rev(s)]: wn })
      }
      // if (s==="hypo") {
      //     setshowMore({...showMore, hyper})
      // } hypoを見たいのだからinheritedで祖先が表示されてしまっているwnのshowMoreを遡及的に操作して非表示にしたい
    }
  }
  //async really need?
  const toggleshowMore = (d: string) => (e: any) => {
    // console.log(d, showMore)
    const s = d as keyof showMoreType
    const rev = (s: string) => s === "hypo" ? "hyper" : "hypo"
    const before = showMore[s]
    if (s === "inherited" && showMore.hyper === before) {
      // console.log("conflict 4")
      const before = showMore[s]
      // const before2 = showMore.hyper
      setOperot({ ...operot, hypo: wn })
      setshowMore({ ...showMore, [s]: !before, hyper: !before }) //ここで.hyperも同時に更新するのが要。toggleshowMore("hyper")などで順番にやると上手くいかない。
    } else if (s === "inherited" && !before && showMore.hyper !== before) {
      // console.log("confilction")
      // toggleshowMore("hyper")(e) //>> hyper:false, inhe:false
      // console.log("conflict 3")
      // toggleshowMore("inherited")(e)
      // console.log("conflict 5")
      setshowMore({ ...showMore, hyper: false, inherited: true }) //意味なかった
    } else {
      if (s === "hyper" && before && showMore.inherited) {
        setshowMore({ ...showMore, hyper: false, inherited: false })
      } else {
        // console.log("conflict 2")
        setshowMore({ ...showMore, [s]: !before })
      }
      if (operot[s as keyof OpeRoot]) {

      } else {
        setOperot({ ...operot, [rev(s)]: wn })
      }
      // if (s==="hypo") {
      //     setshowMore({...showMore, hyper})
      // } hypoを見たいのだからinheritedで祖先が表示されてしまっているwnのshowMoreを遡及的に操作して非表示にしたい
    }
  }

  const get_newderives = (type: ExpandType, derives: DeriveCloses | undefined) => {
    const newderive: DeriveClose = {
      function: (s: string) => toggleshowMore(s)
      , type
      , from: {
        spell: wnconverted.spell
      }
    }
    const newderives = (derives === undefined)
      ? [
        newderive
      ]
      : [...derives,
        newderive
      ]
    return newderives
  }

  const getEachKey = (s: string) => {
    switch (s) {
      case "lms": return "lmseach"
    }
  }
  type Kokoquerysrc = {
    view: RootViewOption
    wn: any
    showPush: PushedOr
    showMore: showMoreType
    showHyper: boolean
    form: ShowForm
    filter: FilterOp
    searchop: InheritSearchOp
  }
  type Kokoquery = {
    view: string
    wn: string
    showPush: string
    showMore: string
    showHyper: string
    form: string
    filter: string
    searchop: string
  }
  const kokoquerysrc: Kokoquerysrc = {
    view: view,
    wn: wn,
    showPush: showPush,
    showMore: showMore,
    showHyper: showHyper,
    form: form,
    filter: filter,
    searchop: searchop,
  }
  let kokoquery: Kokoquery = {
    view: "",
    wn: "",
    showHyper: "",
    showMore: "",
    showPush: "",
    searchop: "",
    filter: "",
    form: "",
  }
  for (const [key, value] of Object.entries(kokoquerysrc)) {
    kokoquery[key as keyof Kokoquery] = JSON.stringify(value)
  }
  // console.log(`wn.spell=${wn.spell}`)
  const [nvspell] = useAtom(nvmode)
  return (
    <div key={wn.spell} className="wn">
      <div className="self">
        <div>
          <Link as={`/wn/${wn.spell}`} href={{ pathname: `/wn/[spell]`, query: kokoquery }}>
            <span className="leftlink" >{`${wn.depth} ${wnconverted.spell.length}`}</span><span>{` ${wn.childSize} ${wn.sisonSize}`}</span>
          </Link>
        </div>
        {/* {operoot?
                <div>
                    {operoot.hyper? <span>上 {operoot.hyper.spell} </span> : ""}
                    {operoot.hypo? <span>下 {operoot.hypo.spell} </span> : ""}
                </div>
                    : "" } */}
        {Object.entries(view).map((kv, kvi) => {
          const [key, showOr] = kv;
          if (key === "lmseach" || key === "lmsjpeach") return ""
          else if (key === "spell" || key === "sep") {
            const con = " " + convertif_tonv(wnconverted[key], nvspell)
            return showOr ? <div key={key}>{" " + con}</div> : ""
          } else if (key === "lms" || key === "lmsjp") {
            const keyeach = (key + "each") as keyof RootViewOption
            const realState = () => {
              if (view[keyeach] === undefined) {
                return view[key]
              } else {
                let each = view[keyeach] as EachShowOp
                if (each[wnconverted.spell] === undefined) {
                  return view[key]
                } else {
                  return each[wnconverted.spell]
                }
              }
            }
            const pushed_words = wn[(key + "push") as keyof WnType] as string[]
            // const formRealState = () => {
            //     if (form[keyeach] === undefined) {
            //         return form[key]
            //     } else {
            //         if (form[keyeach][wn.spell] === undefined) {
            //             return form[key]
            //         } else {
            //             return form[keyeach][wn.spell]
            //         }
            //     }
            // }
            return (
              <div className={key} key={"words" + kvi} >
                <button onClick={tglKokono(key)} className={realState() ? "open" : "close"}>{toggleWord(realState())}</button>
                <button onClick={showAddForm(key, wnconverted.spell)} className={showForm[key] ? "open" : "close"}>{toggleWord(showForm[key])}追加欄</button>
                {/* <button onClick={showAddForm(key)} className={formRealState()?"open":"close"}>{toggleWord(formRealState())}追加欄</button> */}
                {wn[key] ? wn[key].length : "0"}<span className="usu"> {key}</span>
                {showForm[key] ?
                  <form onSubmit={pushSubmit(key)}>
                    <input type="text" value={formText[key]} onChange={pushFormOnChange(key)} />
                    <input type="submit" value="追加" />
                    {pushedOr[key] ? "追加しました！" : ""}
                  </form>
                  : ""}
                {/* {formRealState() ?
                                    <form onSubmit={pushSubmit(key)}>
                                        <input type="text" value={formText[key]} onChange={pushFormOnChange(key)} />
                                        <input type="submit" value="追加" />
                                        {pushedOr[key] ? "追加しました！" : ""}
                                    </form>
                                    : ""} */}
                {
                  realState() ?
                    <div className="words">
                      {wn[key].map((word: string) => <div className="word" key={word}>{word}</div>)}
                      {showPush[key] ?
                        pushed_words.map((push: any, i) => <PushWord key={"push" + i} push={push} wn={wnconverted} />)
                        : ""}
                    </div>
                    : ""}
              </div>
            )
            // return <LmsList key={newkey} view={view} wn={wn} setView={setView} />
          } else {
            return showOr ? <div>{" "+wn[key as keyof WnType] as string | number}</div> : ""
          }
        })}
        {/* <div>{wn.spell}</div>
                <div>{wn.sep}</div>
                <div>{wn.glojp} </div> */}
        {/* {if (wn.lms) return <ol>{wn.lms.map(l => <li>{l}</li>)}</ol>}
                {if (wn.lmsjp) return <ol>{wn.lmsjp.map(l => <li>{l}</li>)} </ol>} */}
      </div>
      <div className="control">
        <button onClick={toggleshowMore("hypo")} className={showMore.hypo ? "open" : "close"}>{toggleWord(showMore.hypo)}下</button>
        <button onClick={toggleshowMore("hyper")} className={showMore.hyper ? "open" : "close"}>{toggleWord(showMore.hyper)}上</button>
        <button onClick={toggleshowMore("inherited")} className={showMore.inherited ? "open" : "close"}>{toggleWord(showMore.inherited)}遡上</button>
        {derives ? <>{
          derives.map((deriveclose, i) =>
            <button
              onClick={deriveclose.function(deriveclose.type)}
              className="open"
              key={`derive${deriveclose.from.spell}${i}`}
            >
              {/* {toggleWord(true)}遡上 */}
              {convertif_tonv(deriveclose.from.spell, nvspell)}</button>
          )
        }</>

          : ""}
      </div>


      <div className="buttons">
        <Button onClick={()=> switchSelect()}>{
          toBool (selectedSynsets.find(s => assertSynsetIdentical([s,wnconverted])))
          ? "選択解除"
          : "選択"
        }</Button>
        <button onClick={() => setShowCreate(!showCreate)} >{toggleWord(showCreate)}新規</button>
        {showCreate ?
          <Create hyper={wnconverted} />
          : ""
        }
      </div>

      <div className="more" >
        {showMore.hypo ?
          <div className="hypo">
            <HypWrapperforUseQuery of={wnconverted} isHypo={true} view={view} setView={setView} showPush={showPush} setShowPush={setShowPush} showHyper={false} form={form} setForm={setForm} operoot={operot} filter={filter} setFilter={setFilter}
              derives={get_newderives("hypo", derives)}
              searchop={searchop}
            />
          </div>
          : ""}
        {showMore.hyper ?
          <div className="hyper">
            <HypWrapperforUseQuery of={wnconverted} isHypo={false} view={view} setView={setView} showPush={showPush} setShowPush={setShowPush} showHyper={showMore.inherited} form={form} setForm={setForm} operoot={operot} filter={filter} setFilter={setFilter}
              derives={get_newderives("hyper", derives)}
              searchop={searchop}
            />
          </div>
          : ""}

      </div>

    </div>
  )
}
export default Wn