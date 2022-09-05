import { useState } from "react"
import { useQuery, useMutation } from "urql"
import { SimpleViewOption, RootViewOption } from "./SearchBox"
const Hyp = ({ of, isHypo, view, setView, showPush, showHyper }: { of: any, isHypo: boolean, showHyper: boolean, view: RootViewOption, setView: any, showPush: PushedOr }) => {
    const rel = isHypo ? "jwlj" : "jwlk"
    const query = `
        query Wns($where: wnWhere) {
            wns(where: $where) {
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
        }
    }
    const [{ data, fetching, error }, redoQuery] = useQuery({ query: query, variables: vars })
    if (fetching) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;
    const classname = `rel ${rel}`
    // console.log(`${of.spell} showHyper: ${showHyper}`)
    return (
        <div className={classname}>
            {data.wns.map((container: any) => {
                return (<>{
                    container[rel].map((wn: any) => <Wn key={wn.spell} wn={wn} view={view} setView={setView} showPush={showPush} showHyper={showHyper} />)
                }</>)
            })}
        </div>
    )
}


const PushWord = ({ wn, push }: { wn: any, push: any }) => {
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
            <button onClick={() => deleteSubmit()}>削除</button>
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

const LmsList = ({view, wn, key, setView}:{view:RootViewOption, wn:any, key:string, setView:any}) => {
    console.log("key:", key)

    console.log(`wn[${key}]`, wn[key])



}


const Wn = ({ wn, view, setView, showPush, showHyper }: { wn: any, view: RootViewOption, setView:any, showPush: PushedOr, showHyper: boolean }) => {

    const listtypes = ["lms", "lmsjp"]
    const pushes = ["lmspush", "lmsjppush"]

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
    const [kokonoViewOp, setKokonoViewOp] = useState<SimpleViewOption>({
        spell: view.spell,
        sep: view.sep,
        glo: view.glo,
        glojp: view.glojp,
        lms: view.lms,
        lmsjp: view.lmsjp,
        ex: view.ex,
        exjp: view.exjp,
    })
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
    interface FormText {
        lms: string,
        lmsjp: string
    }

    const showAddForm = (key: string) => (e: any) => {
        const c = showForm[key as keyof SimpleViewOption]
        setShowForm({ ...showForm, [key]: !c })
    }
    const pushFormOnChange = (key: string) => (e: any) => {
        setFormText({ ...formText, [key]: e.target.value })
    }
    const pushSubmit = (key: string) => async (e: any) => { //=>e は必須 asyncは後ろに
        e.preventDefault()
        const pushwords = formText[key].split("\n")


        switch (key) {
            case "lmsjp": {
                for (const pushword of pushwords) {
                    let variables = {
                        where: {
                            spell: wn.spell
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
                                spell: wn.spell
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
                        const { error2, data2 } = await updWns(create)
                        if (error2) { console.error(error); break }
                    }
                    setFormText({ ...showForm, [key]: "" })
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
                        const { error2, data2 } = await updWns(create)
                        if (error2) { console.error(error); break }
                    }
                    setFormText({ ...showForm, [key]: "" })
                    setPushedOr({ ...pushedOr, [key]: true })
                }
                break
            }
        }
    }
    const tglKokono = (key:string) => (e:any) => {

        if (key === "lms") {
            let each = view.lmseach[wn.spell]
            if (each === undefined) {
                const n = {...view, lmseach: {...view.lmseach, [wn.spell]: view.lms} }
                setView(n)
            } else {
                setView({...view, lmseach: {...view.lmseach, [wn.spell]: !each} })
            }
        } else if (key === "lmsjp") {
            let each = view.lmsjpeach[wn.spell]
            if (each === undefined) {
                const n = {...view.lmsjpeach, [wn.spell]: view.lmsjp}
                setView({...view, lmsjpeach: n})
            } else {
                setView({...view, lmsjpeach: {...view.lmsjpeach, [wn.spell]: !each}})
            }
        }

        console.log("after toggle view:", view)

    }


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
    const toggleshowMore = (d: string) => (e: any) => {
        const s = d as keyof showMoreType
        if (s === "inherited") {
            const before = showMore[s]
            const before2 = showMore.hyper
            setshowMore({ ...showMore, [s]: !before, hyper: !before2 }) //ここで.hyperも同時に更新するのが要。toggleshowMore("hyper")などで順番にやると上手くいかない。
        } else {
            const before = showMore[s]
            setshowMore({ ...showMore, [s]: !before })
        }
    }


    const getEachKey = (s: string) => {
        switch (s) {
            case "lms": return "lmseach"
        }
    }
    return (
        <div key={wn.spell} className="wn">
            <div className="self">
                <div>{wn.depth}.{wn.childSize}.{wn.sisonSize}</div>
                {Object.entries(view).map(kv => {
                    const [key, showOr] = kv;
                    if (key === "lmseach" || key==="lmsjpeach") return ""
                    if (key === "lms" || key === "lmsjp") {
                        const realState = () => {
                            if (view[key+"each"] === undefined) {
                                return view[key]
                            } else {
                                if (view[key+"each"][wn.spell] === undefined){
                                    return view[key]
                                } else {
                                    return view[key+"each"][wn.spell]
                                }
                            }
                        }
                        return (
                            <div className={key}>
                                <button onClick={tglKokono(key)} className={realState()?"open":"close"}>{toggleWord(realState())}</button>
                                <button onClick={showAddForm(key)} className={showForm[key]?"open":"close"}>{toggleWord(showForm[key])}追加欄</button>
                                {wn[key] ? wn[key].length : "0"}<span className="usu"> {key}</span>
                                {showForm[key] ?
                                    <form onSubmit={pushSubmit(key)}>
                                        <input type="text" value={formText[key]} onChange={pushFormOnChange(key)} />
                                        <input type="submit" value="追加" />
                                        {pushedOr[key] ? "追加しました！" : ""}
                                    </form>
                                    : ""}
                                {
                                realState()?
                                    <div className="words">
                                        {wn[key].map(word => <div className="word" key={word}>{word}</div>)}
                                        {showPush[key] ?
                                            wn[key + "push"].map(push => <PushWord push={push} wn={wn} />)
                                            : ""}
                                    </div>
                                    : ""}
                            </div>
                        )
                        return <LmsList key={newkey} view={view} wn={wn} setView={setView} />
                    } else {
                        return showOr ? <div><span>{wn[key]}</span></div> : ""
                    }
                })}
                {/* <div>{wn.spell}</div>
                <div>{wn.sep}</div>
                <div>{wn.glojp} </div> */}
                {/* {if (wn.lms) return <ol>{wn.lms.map(l => <li>{l}</li>)}</ol>}
                {if (wn.lmsjp) return <ol>{wn.lmsjp.map(l => <li>{l}</li>)} </ol>} */}
            </div>
            <div className="control">
                <button onClick={toggleshowMore("hypo")} className={showMore.hypo?"open":"close"}>{toggleWord(showMore.hypo)}下</button>
                <button onClick={toggleshowMore("hyper")} className={showMore.hyper?"open":"close"}>{toggleWord(showMore.hyper)}上</button>
                <button onClick={toggleshowMore("inherited")} className={showMore.inherited?"open":"close"}>{toggleWord(showMore.inherited)}遡上</button>
            </div>
            <div className="more" >
                {showMore.hypo ? <Hyp of={wn} isHypo={true} view={view} setView={setView} showPush={showPush} /> : ""}
                {showMore.hyper ? <Hyp of={wn} isHypo={false} view={view} setView={setView} showPush={showPush} showHyper={showMore.inherited} /> : ""}
            </div>
        </div>
    )
}
export default Wn