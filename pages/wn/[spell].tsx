import {Provider, useQuery} from "urql"
import urqlClient from "../api/client"
import SearchBox, { defForm } from "../SearchBox"
import {useRouter} from "next/router"
import {useState} from "react"
import Wn from "../Wn"
import Link from "next/link"
import { RootViewOption, defView, defShowPush, ShowForm } from "../SearchBox"
import { PushedOr } from "../Wn"
const Direct = ({spell}) => {
    const [view, setView] = useState<RootViewOption>(defView)
    const [form, setForm] = useState<ShowForm>(defForm)
    const [showPush, setShowPush] = useState<PushedOr>(defShowPush)
    const query = `
    query Wns($where: wnWhere) {
        wns(where: $where) {
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
    const [{data, fetching, error}, redoQuery] = useQuery({query: query, variables: {where: {spell: spell}}})
    if (fetching) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;
    console.log("view", view)

    return (<>
        {data.wns.map(wn=><Wn
            wn={wn}
            view={view}
            setView={setView}
            showPush={showPush}
            setShowPush={setShowPush}
            showHyper={false}
            form={form}
            setForm={setForm}
        /> )}
        <SearchBox setView={setView} view={view} form={form} setForm={setForm} showPush={showPush} setShowPush={setShowPush} />
        <div>view {JSON.stringify(view)}</div>
        <div>form {JSON.stringify(form)}</div>
        <div>showPush {JSON.stringify(showPush)}</div>

    </>)
}
const Child1 = ({state}) => <h1>tameshi state: {state? "true": "false"}</h1>
const Child2 = ({state, setState}) => {
    return <button onClick={()=>setState(!state)}>button</button>
}
const Tameshi = () => {
    const [state, setState] = useState(false)
    return(<>
        <Child1 state={state}/>
        <Child2 state={state} setState={setState} />
        </>)
}
const Koko = () => {
    const router = useRouter()
    let query = {}
    for(const[key,value] of Object.entries(router.query)){
        if (key!=="spell"){
            query[key] = JSON.parse(value)
        }
    }
    const [view, setView] = useState<RootViewOption>(query.view)
    const [form, setForm] = useState<ShowForm>(query.form)
    const [showPush, setShowPush] = useState<PushedOr>(query.showPush)
    console.log("view", view)
    return(<>
    <Provider value={urqlClient}>
        <Link href="/">
            <a><h3>clear</h3></a>
        </Link>
        {query.wn ?
        <>
            <div className="list">
                <Wn wn={query.wn} view={view} setView={setView} showHyper={query.showHyper} showPush={showPush} setShowPush={setShowPush} form={form} setForm={setForm}  />
            </div>
            <SearchBox setView={setView} view={view} form={form} setForm={setForm} showPush={showPush} setShowPush={setShowPush} />
        </>
        : <Direct spell={router.query.spell} />}
        <Tameshi />
    </Provider>
    </>)
}
export default Koko