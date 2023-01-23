import { Provider, useQuery } from "urql"
import urqlClient from "../api/client"
import SearchBox from "../SearchBox"
import { useRouter } from "next/router"
import { useState } from "react"
import Wn from "../Wn"
import Link from "next/link"
import { PushedOr } from "../Wn"
import { defFilterOp, defForm, defShowPush, defURLQuery, defView, defxsearchxop, FilterOp, InheritSearchOp, RootViewOption, ShowForm, URLQuery } from "../../type/type"
import { routerQueryfold } from "../../type/util"
import SuperSelect from "../Merge"
const Direct = ({ spell }: { spell: string }) => {
  const [view, setView] = useState<RootViewOption>(defView)
  const [form, setForm] = useState<ShowForm>(defForm)
  const [showPush, setShowPush] = useState<PushedOr>(defShowPush)
  const [filter, setFilter] = useState<FilterOp>(defFilterOp)
  const [SearchOp, setSearchOp] = useState<InheritSearchOp>(defxsearchxop)
  const query = `
  query Wns($where: wnWhere) {
    wns(where: $where) {
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
  const [{ data, fetching, error }, redoQuery] = useQuery({ query: query, variables: { where: { spell: spell } } })
  if (fetching) return <p>Loading...</p>;
  if (error) return <p>Oh no... {error.message}</p>;
  // console.log("view", view)

  return (<>
    {/* {data.wns.map(wn=><Wn
      wn={wn}
      view={view}
      setView={setView}
      showPush={showPush}
      setShowPush={setShowPush}
      showHyper={false}
      form={form}
      setForm={setForm}
      filter={filter} setFilter={setFilter}
    /> )} */}
    <SearchBox
      setView={setView}
      view={view}
      form={form}
      setForm={setForm}
      showPush={showPush}
      setShowPush={setShowPush}
      filterop={filter}
      setFilterop={setFilter}
      wn={data.wns[0]}
      searchop={SearchOp}
    />
  </>)
}
const Child1 = ({ state }: { state: any }) => <h1>tameshi state: {state ? "true" : "false"}</h1>
const Child2 = ({ state, setState }: { state: any, setState: any }) => {
  return <button onClick={() => setState(!state)}>button</button>
}
const Tameshi = () => {
  const [state, setState] = useState(false)
  return (<>
    <Child1 state={state} />
    <Child2 state={state} setState={setState} />
  </>)
}
const Koko = () => {
  const router = useRouter()

  console.log("router=", router)
  let query: URLQuery = defURLQuery
  for (const [key, value] of Object.entries(router.query)) {
    if (key !== "filter" && key !== "spell") {
      query[key as keyof URLQuery] = JSON.parse(routerQueryfold(value))
      // console.log("query now=", query)
      // query[key] = value
    }
  }
  // console.log("query.wn=", query.wn)
  const [view, setView] = useState<RootViewOption>(query.view)
  const [form, setForm] = useState<ShowForm>(query.form)
  const [showPush, setShowPush] = useState<PushedOr>(query.showPush)
  const [filter, setFilter] = useState<FilterOp>(query.filter)
  const [SearchOp, setSearchOp] = useState<InheritSearchOp>(query.searchop ?? defxsearchxop)
  // console.log("view", view)
  return (
    <Provider value={urqlClient}>
      <div className="jouge">
        <div className="ue">
          <Link href="/">
            clear
          </Link>
        </div>
        {query.wn ?
          <>
            {/* <div className="list">
          <Wn wn={query.wn} view={view} setView={setView} showHyper={query.showHyper} showPush={showPush} setShowPush={setShowPush} form={form} setForm={setForm} filter={filter} setFilter={setFilter} />
        </div> */}
            <SearchBox
              setView={setView}
              view={view}
              form={form}
              setForm={setForm}
              showPush={showPush}
              setShowPush={setShowPush}
              filterop={filter}
              setFilterop={setFilter}
              wn={query.wn}
              searchop={SearchOp}
            />
          </>
          : <Direct spell={routerQueryfold(router.query.spell)} />}
      </div>
      <SuperSelect />
    </Provider>
  )
}
export default Koko