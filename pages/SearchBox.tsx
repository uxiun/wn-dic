import { useState, FC } from "react"
import React from "react"
import { Path, useForm, SubmitHandler, UseFormRegister, FieldValues } from "react-hook-form"
import List from "./List"
import HotKeys from "react-hot-keys"
import { PushedOr } from "./Wn"
import {
  CheckboxProps, defFilterOp, defForm, defShowPush, defView, defxsearchxop, EachShowOp, emptySearchForm, FilterOp, FilterOpMatch, InheritSearchOp, MetaToggle, RootViewOption, SearchForm, ShowForm, ViewOption, WnType, wnzokusei
} from "../type/type"
import Wn from "./Wn"
import { useAtom } from "jotai"
import { filterOpAtom, isSearchSubmitAtom, nvmode, pushedOrAtom, rootViewOptionAtom, searchFormAtom, showFormAtom } from "../type/jotai"
import { toBool } from "../type/util"
import { NextPage } from "next"

enum StrOrBool {
  SubmitQuery,
  Submit
}

interface SubmitQuery {
  lmsjp: string,
  spell: string,
  sep: string,
  glojp: string
}

function Checkbox<T extends FieldValues>({ register, path, label, checked }: CheckboxProps<T>) {
  //checked={checked}
  return (
    <label>
      <input type="checkbox"  {...register(path)} />
      {label}
    </label>
  );
}
type ViewOptionProps = {
  setState: any
  view: any
}
const ViewOption: FC<ViewOptionProps> = ({ setState, view }: ViewOptionProps) => {
  const defaultValues: ViewOption = {
    f: defView,
  }
  const {
    register,
    handleSubmit
  } = useForm<ViewOption>({ mode: "onChange", defaultValues })
  const onChange: SubmitHandler<ViewOption> = async (data: ViewOption) => {
    setState(data.f)
  }
  // const onChangeX = k => e => {
  //     const v = e.target.value
  //     setState({ ...view, [k]: v })
  // }

  // return(
  //     <form>
  //         {wnzokusei.map(k =>
  //             <label key={k}>
  //                 <input type="checkbox" onChange={onChangeX(k)} />
  //                 {k}
  //             </label>
  //         )}
  //     </form>
  // )
  return (
    <form onChange={handleSubmit(onChange)}>
      {wnzokusei.map(k => <Checkbox
        key={k}
        register={register}
        path={`f.${k}`}
        label={k}
        checked={view[k as keyof RootViewOption]}
      />)}
    </form>
  )
}

type SearchBoxProps = {
  setView?: any
  , view?: RootViewOption
  , form?: ShowForm
  , setForm?: any
  , showPush?: PushedOr
  , setShowPush?: any
  , filterop?: FilterOp
  , setFilterop?: any
  , searchop?: InheritSearchOp
  , wn?: WnType
}
const SearchBox: NextPage<SearchBoxProps> = ({
  setView
  , view
  // , form
  // , setForm
  // , showPush
  // , setShowPush
  , filterop
  , setFilterop
  , searchop
  , wn
}: SearchBoxProps) => {
  // console.log("searchop", searchop)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SearchForm>({
    defaultValues: emptySearchForm
  })
  const [isSubmit, setSubmit] = useAtom(isSearchSubmitAtom)
  // const [filter, setFilter] = useState<SearchForm>({
  //     spell: "",
  //     sep: "",
  //     lmsjp: "",
  //     glojp: "",
  //     exjp: "",
  //     lms: "",
  //     glo: "",
  //     ex: "",
  //     childSize: '',
  // })
  const [viewOp, setViewOp] = useAtom(rootViewOptionAtom)
  const [showPush, setShowPush] = useAtom(pushedOrAtom)
  const [form, setForm] = useAtom(showFormAtom)
  const [searchForm, setSearchForm] = useAtom(searchFormAtom)
  const [filterOp, setFilterOp] = useAtom(filterOpAtom)
  const [spellnv, setSpellnv] = useAtom(nvmode)
  // const [viewOp, setViewOp] = useState<RootViewOption>(view ? view : defView)
  // const [showForm, setShowForm] = useState<ShowForm>(form ? form : defForm)
  const [showMeta, setShowMeta] = useState<MetaToggle>({ viewOp: true })
  let [showPush1, setShowPush1] = useState<PushedOr>(showPush ? showPush : defShowPush)

  const [SearchOp, setSearchOp] = useState<InheritSearchOp>(searchop ?? defxsearchxop)

  // const change = (k: string) => (e: React.FormEvent<HTMLInputElement>) => {
  //     const duration = Date.now() - filter.updatedAt
  //     setFilter({ ...filter, [k]: e.target.value, updatedAt: Date.now(), duration })
  // }

  // const router = useRouter()
  // const onSubmit: SubmitHandler<SearchForm> = (data) => {
  //     let query: SubmitQuery = {}
  //     const keys: String[] = [
  //         "lmsjp",
  //         "spell",
  //         "sep",
  //         "glojp",
  //     ]
  //     for (const key of keys) {
  //         if (data[key] && data[key] != ""){query[key] = data[key]}
  //     }
  //     router.push({
  //         pathname: "/wns",
  //         query,
  //     })
  //     console.log("data: ", data)
  //     reset()
  // }


  const toggleView: SubmitHandler<SearchForm> = (data: SearchForm) => {
    setSearchForm(data)
    setSubmit(true)
  }
  const toggleViewOption = (input: keyof MetaToggle) => (e: any) => {
    const before = showMeta[input]
    setShowMeta({ ...showMeta, [input]: !before })
  }
  const pushOpOut = (key: string) => (e: any) => {
    if (showPush === undefined) {
      // console.log("showPush undefined")
      const current = showPush1[key as keyof PushedOr]//ここをe.target.checkedにすると、作動順を考えれば当たり前だが、表示と状態があべこべになる
      setShowPush1({ ...showPush1, [key]: !current })
    } else {
      const current = showPush[key as keyof PushedOr]//ここをe.target.checkedにすると、作動順を考えれば当たり前だが、表示と状態があべこべになる
      setShowPush({ ...showPush, [key]: !current })
    }
  }
  type DeepFormState = boolean

  const toggleDeepSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log("before toggle, SearchOp.deeper=", SearchOp.deeper)
    const before: boolean = SearchOp.deeper
    setSearchOp({ ...SearchOp, deeper: !before })
  }

  const toggleViewSimple = (key: string) => (e: any) => {
    if (view === undefined) {
      // console.log("view undefined")
      const now = viewOp[key as keyof RootViewOption]
      if (key === "lms" || key === "lmsjp") {
        const setAll = (bool: boolean, o: EachShowOp) => {
          for (const [key, value] of Object.entries(o)) {
            o[key] = bool
          }
          return o;
        }//setAll(!now, viewOp[key+"each"])
        setViewOp({ ...viewOp, [key]: !now, [key + "each"]: {} })
      } else {
        setViewOp({ ...viewOp, [key]: !now })
      }
    } else {
      const now = view[key as keyof RootViewOption]
      if (key === "lms" || key === "lmsjp") {
        const setAll = (bool: boolean, o: EachShowOp) => {
          for (const [key, value] of Object.entries(o)) {
            o[key] = bool
          }
          return o;
        }//setAll(!now, viewOp[key+"each"])
        setView({ ...view, [key]: !now, [key + "each"]: {} })
      } else {
        setView({ ...view, [key]: !now })
      }
    }
    // console.log("view", view)
    // console.log("viewOp", viewOp)
  }

  // const [filterOp, setFilterOp] = useAtom(filterOpAtom)
  // useState<FilterOp>(filterop ? filterop : defFilterOp)
  const tglFilterOp = (to: keyof FilterOp) => (ops: string) => (e: any) => {
    if (
      to === "lms" ||
      to === "lmsjp" ||
      to === "spell"
    ) {

      if (filterop) {
        setFilterop({ ...filterop, [to]: { ...filterop[to], [ops]: !filterop[to][ops as keyof FilterOpMatch] } })
      } else {
        setFilterOp({ ...filterOp, [to]: { ...filterOp[to], [ops]: !filterOp[to][ops as keyof FilterOpMatch] } })
      }
    }
  }
  const [keyState, setKeyState] = useState({
    down: "",
    up: "",
  })
  const keyup = (e: any) => {
    if (keyState.down === e.key) {
      setKeyState({ ...keyState, up: e.key })
    }
  }
  type KeyOrder = {
    keyStroke: string[]
    f: (e: any) => void
  }
  type KeyOrders = KeyOrder[]
  const keydown = (keyorders: KeyOrders) => (e: any) => {

    // console.log(keyState)
    const lastdown = keyState.down
    const lastup = keyState.up
    for (const keyorder of keyorders) {
      const keyStroke = keyorder.keyStroke
      if (lastdown === keyStroke[0] && lastup !== keyStroke[0] && e.key === keyStroke[1]) {
        console.log("shortcut!")
        keyorder.f(e)
      }
    }
    setKeyState({ ...keyState, down: e.key })
  }
  const shortcutMap = {
    "spell": "d",
    "sep": "e",
    "glo": "g",
    "glojp": "t",
    "lms": "h",
    "lmsjp": "j",
    "ex": "x",
    "exjp": "c",
  }
  const showPushBool = (key: keyof PushedOr) => {
    if (showPush) {
      return showPush[key]
    } else {
      return showPush1[key]
    }
  }
  const viewBool = (key: keyof RootViewOption): boolean => {
    if (view) {
      return toBool(view[key])
    } else {
      return toBool(viewOp[key])
    }
  }
  return (
    <>
      <div className="left side">
        <div className="forms">

          <form onSubmit={handleSubmit(toggleView)} >
            {[...wnzokusei, 'childSize'].map(k =>
              <div key={k} className="textsearch" id={`input${k}`} >
                <label htmlFor={k}>{k}</label>
                <input {...register(k as keyof SearchForm)}
                  onKeyDown={keydown(
                    [
                      {
                        keyStroke: ["Alt", "s"],
                        f: (e: any) => tglFilterOp(k as keyof FilterOp)("compMatch")(e),
                      }, {
                        keyStroke: ["Alt", "k"],
                        f: (e: any) => toggleViewSimple(k)(e),
                      },
                    ]
                  )}
                  onKeyUp={keyup}

                />
              </div>
            )}
            <button type="submit" className="search">検索</button>
          </form>

          {/* <ViewOption setState={setViewOp} view={viewOp} /> */}
          <form>
            {Object.entries(filterop ? filterop : filterOp).map(opt => {
              const [key, value] = opt
              return (
                <div key={key}>
                  <label>
                    <input type="checkbox" onChange={tglFilterOp(key as keyof FilterOp)("compMatch")} checked={value.compMatch} />
                    {key}の完全一致
                  </label>
                </div>
              )
            })}
          </form>
          <form>
            {wnzokusei.map(zokusei =>
              <div key={zokusei}>
                <label>
                  <input type="checkbox" onChange={toggleViewSimple(zokusei)} checked={viewBool(zokusei as keyof RootViewOption)}

                  />
                  {zokusei}
                </label>
              </div>
            )}
          </form>
          <form>
            <div>
              <input type="checkbox" id="nvmode-switch" onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setSpellnv(!spellnv) }} checked={spellnv}
              />
              <label htmlFor="nvmode-switch">{`,. を nv に変換`}</label>
            </div>
            <div>
              <input
                type="checkbox"
                id="deepsearch"
                onChange={toggleDeepSearch}
                checked={SearchOp.deeper}
              />
              <label htmlFor="deepsearch">予取得展</label>
            </div>
          </form>
          <form>
            {["lms", "lmsjp"].map(key => <div key={key}>
              <input type="checkbox" id={`${key}push-option`} onChange={pushOpOut(key)} checked={showPushBool(key as keyof PushedOr)} />
              <label htmlFor={`${key}push-option`}>{key}push</label>
            </div>
            )}
          </form>
        </div>
        <div className="info">
          <button onClick={toggleViewOption("viewOp")}>表示設定の表示切替</button>
          {showMeta.viewOp ?
            <>
              <div>
                {Object.entries(viewOp).map(kv => <div key={kv[0]}>{kv[0]}: {kv[1] ? "true" : "false"}</div>)}
              </div>
              <div>
                {Object.entries(showPush ? showPush : showPush1).map(kv => <div key={kv[0]}>{`${kv[0]}push`}: {kv[1] ? "true" : "false"}</div>)}
              </div>
            </>
            : ""}
        </div>
      </div>
      {wn ?
        <div className="right side ">
          <Wn
            wn={wn}
            // filter={filterop?? filterOp}
            // view={view?? viewOp}
            // setView={setView??setViewOp}
            showHyper={false}
            // showPush={showPush?? showPush1}
            // setShowPush={setShowPush?? setShowPush1}
            // form={form?? showForm}
            // setForm={setForm?? setShowForm}
            // setFilter={setFilterOp}
            searchop={SearchOp}
          />
        </div>
        : ""
      }
    </>
  )
  // return (
  //     <div>
  //         searchbox
  //         <form>
  //             lm
  //             <input type="text" className="lm" onChange={change("lmsjp")} value={filter.lmsjp}></input>
  //             spell
  //             <input type="text" className="lm" onChange={change("spell")} value={filter.spell}></input>
  //             sep
  //             <input type="text" className="lm" onChange={change("sep")} value={filter.sep}></input>
  //             glojp
  //             <input type="text" className="lm" onChange={change("glojp")} value={filter.glojp}></input>
  //             <button onClick={()=>{}}>検索</button>
  //         </form>
  //         {/* {filter.submit ? <List filters={filter} /> : ""} */}
  //         <Contena fil={filter} />
  //     </div>
  // )

}
export default SearchBox