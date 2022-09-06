import { useState, VFC} from "react"
import { useRouter } from "next/router"
import { Path, useForm, SubmitHandler, UseFormRegister } from "react-hook-form"
import List from "./List"
import HotKeys from "react-hot-keys"
import { PushedOr } from "./Wn"
export type SearchForm = {
    spell: string,
    sep: string,
    glojp: string,
    glo: string,
    lmsjp: string,
    lms: string,
    exjp: string,
    ex: string,
}
enum StrOrBool {
    SubmitQuery,
    Submit
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
interface SubmitQuery {
    lmsjp: string,
    spell: string,
    sep: string,
    glojp: string
}
const Contena = ({ fil }: {fil: any}) => {
    if (
        fil.lm == "" &&
        fil.spell == "" &&
        fil.sep == "" &&
        fil.glojp == ""
    ) return ""
    return (fil.submit ? <>List <List filters={fil} /></> : "")
    // return (fil.duration > 500 ? <>List <List filters={fil} /></> : "")
    return <>List <List filters={fil} /></>
}

const wnzokusei = [
    "spell",
    "sep",
    "glo",
    "glojp",
    "lms",
    "lmsjp",
    "ex",
    "exjp",
] as const
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
    spell: false,
    sep: true,
    glo: false,
    glojp: true,
    lms: false,
    lmsjp: false,
    lmseach: {},
    lmsjpeach: {},
    ex: false,
    exjp: false,
}
interface ViewOption {
    f: {[key in typeof wnzokusei[number]]: boolean}
}
interface CheckboxProps<T> {
    register: UseFormRegister<T>;
    path: Path<T>;
    label: string;
    checked: boolean;
}
interface MetaToggle {
    viewOp: boolean
}
type EachShowOp = {
    [spell: string]: boolean
}
type showListOp = {
    lms: boolean,
    lmsjp: boolean,
}

function Checkbox<T>({ register, path, label, checked }: CheckboxProps<T>) {
    //checked={checked}
    return (
        <label>
            <input type="checkbox"  {...register(path)} />
            {label}
        </label>
    );
}

const ViewOption: VFC = ({setState, view}) => {
    const defaultValues: ViewOption = {
        f: defView,
    }
    const {
        register,
        handleSubmit
    } = useForm<ViewOption>({mode: "onChange", defaultValues})
    const onChange: SubmitHandler<ViewOption> = async(data) => {
        setState(data.f)
    }
    const onChangeX = k => e => {
        const v = e.target.value
        setState({...view, [k]: v})
    }
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
    return(
        <form onChange={handleSubmit(onChange)}>
            {wnzokusei.map(k => <Checkbox
                key={k}
                register={register}
                path={`f.${k}`}
                label={k}
                checked={view[k as keyof RootViewOption]}
            />) }
        </form>
    )
}

export type FilterOp = {
    spell: {
        compMatch: boolean
    }
}
export const defShowPush = {
    lms: false,
    lmsjp: false,
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

const SearchBox: VFC = ({setView, view, form, setForm, showPush, setShowPush}:{setView:any, view:RootViewOption, form:ShowForm, setForm:any, showPush: PushedOr, setShowPush:any}) => {
    console.log("view", view)
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SearchForm>()
    const [isSubmit, setSubmit] = useState(false)
    const [filter, setFilter] = useState<SearchForm>({
        spell: "",
        sep: "",
        lmsjp: "",
        glojp: "",
        exjp: "",
        lms: "",
        glo: "",
        ex: ""
    })
    const [viewOp, setViewOp] = useState<RootViewOption>(view? view: defView)
    const [showForm, setShowForm] = useState<ShowForm>(form? form: defForm)
    const [showMeta, setShowMeta] = useState<MetaToggle>({viewOp: true})
    let [showPush1, setShowPush1] = useState<PushedOr>(showPush? showPush: defShowPush)
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
        setFilter(data)
        setSubmit(true)
        // let query: Filter = {
        //     duration: 0,
        //     updatedAt: Date.now(),
        //     submit: false,
        //     lmsjp: "",
        //     spell: "",
        //     sep: "",
        //     glojp: ""
        // }
        // const keys = [
        //     "lmsjp",
        //     "spell",
        //     "sep",
        //     "glojp",
        // ]
        // for (const [key, value] of Object.entries(query)) {
        //     const key1 = key as keyof SearchForm

        //     if (data[key1] && data[key1] != ""){
        //         query[key as keyof Filter] = data[key1]
        //         // if (
        //         //     key === "lmsjp" ||
        //         //     key === "glojp" ||
        //         //     key === "sep" ||
        //         //     key === "spell"
        //         // ) {
        //         //     query[key as keyof Filter] = data[key1]
        //         // } else {
        //         //     query[key as keyof Filter] = ""
        //         // }
        //     }
        // }
        // setFilter({...filter, submit: true})
    }
    const toggleViewOption = (input: string) => (e:any) => {
        const before = showMeta[input]
        setShowMeta({...showMeta, [input]: !before})
    }
    const pushOpOut = (key: string) => (e:any) => {
        if (showPush===undefined) {
            console.log("showPush undefined")
            const current = showPush1[key]//ここをe.target.checkedにすると、作動順を考えれば当たり前だが、表示と状態があべこべになる
            setShowPush1({...showPush1, [key]: !current})
        } else {
            const current = showPush[key]//ここをe.target.checkedにすると、作動順を考えれば当たり前だが、表示と状態があべこべになる
            setShowPush({...showPush, [key]: !current})
        }
    }
    const toggleViewSimple = (key: string) => (e:any) => {
        if (view===undefined){
            console.log("view undefined")
            const now = viewOp[key]
            if (key === "lms"|| key==="lmsjp") {
                const setAll = (bool:boolean, o:EachShowOp) => {
                    for (const [key, value] of Object.entries(o)) {
                        o[key] = bool
                    }
                    return o;
                }//setAll(!now, viewOp[key+"each"])
                setViewOp({...viewOp, [key]: !now, [key+"each"]: {}})
            } else {
                setViewOp({...viewOp, [key]: !now})
            }
        } else {
            const now = view[key]
            if (key === "lms"|| key==="lmsjp") {
                const setAll = (bool:boolean, o:EachShowOp) => {
                    for (const [key, value] of Object.entries(o)) {
                        o[key] = bool
                    }
                    return o;
                }//setAll(!now, viewOp[key+"each"])
                setView({...view, [key]: !now, [key+"each"]: {}})
            } else {
                setView({...view, [key]: !now})
            }
        }
        console.log("view", view)
        console.log("viewOp",viewOp)
    }

    const [filterOp, setFilterOp] = useState<FilterOp>({
        spell: {
            compMatch: false,
        },
    })
    const tglFilterOp = (to: string) => (ops: string) => (e:any) => {
        setFilterOp({...filterOp, [to]: {...filterOp.to, [ops]: !filterOp[to][ops]}})
    }
    const [keyState, setKeyState] = useState({
        down: "",
        up: "",
    })
    const keyup = (e:any) => {
        if (keyState.down === e.key){
            setKeyState({...keyState, up: e.key})
        }
    }
    type KeyOrder = {
        keyStroke: string[]
        f: VoidFunction
    }
    type KeyOrders = KeyOrder[]
    const keydown = (keyorders: KeyOrders) => (e:any) => {

        console.log(keyState)
        const lastdown = keyState.down
        const lastup = keyState.up
        for (const keyorder of keyorders) {
            const keyStroke = keyorder.keyStroke
            if (lastdown===keyStroke[0] && lastup!==keyStroke[0] && e.key===keyStroke[1]) {
                console.log("shortcut!")
                keyorder.f()
            }
        }
        setKeyState({...keyState, down: e.key})
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
    const showPushBool = (key) => {
        if (showPush){
            return showPush[key]
        } else {
            return showPush1[key]
        }
    }
    const viewBool = (key) => {
        if (view) {
            return view[key]
        } else {
            return viewOp[key]
        }
    }
    return (
        <div className="main">
            <div className="pin">
                <div className="forms">

                        <form onSubmit={handleSubmit(toggleView)} >
                            {wnzokusei.map(k =>
                                <div className="textsearch">{k} <input {...register(k)} onKeyDown={keydown(
                                    [
                                        {
                                            keyStroke: ["Alt","s"],
                                            f: ()=>tglFilterOp("spell")("compMatch")(),
                                        },{
                                            keyStroke: ["Alt", "k"],
                                            f: ()=>toggleViewSimple(k)(),
                                        },
                                    ]
                                    )} onKeyUp={keyup} /></div>
                            )}
                                <button type="submit" class="search">検索</button>
                        </form>

                    {/* <ViewOption setState={setViewOp} view={viewOp} /> */}
                    <form>
                        <div>
                            <label>
                                <input type="checkbox" onChange={tglFilterOp("spell")("compMatch")} checked={filterOp.spell.compMatch} />
                                spellの完全一致
                            </label>
                        </div>
                    </form>
                    <form>
                        {wnzokusei.map(zokusei=>
                            <div>
                                <label>
                                    <input type="checkbox" onChange={toggleViewSimple(zokusei)} checked={viewBool(zokusei)}

                                    />
                                    {zokusei}
                                </label>
                            </div>
                        )}
                    </form>
                    <form>
                        {["lms", "lmsjp"].map(key=> <div>
                                <input type="checkbox" id={`${key}push-option`} onChange={pushOpOut(key)} checked={showPushBool(key)} />
                                <label for={`${key}push-option`}>{key}push</label>
                            </div>
                        )}
                    </form>
                </div>
                <div className="info">
                    <button onClick={toggleViewOption("viewOp")}>表示設定の表示切替</button>
                    {showMeta.viewOp?
                        <>
                            <div>
                                {Object.entries(viewOp).map(kv=><div key={kv[0]}>{kv[0]}: {kv[1]? "true": "false"}</div> )}
                            </div>
                            <div>
                                {Object.entries(showPush? showPush: showPush1).map(kv=><div key={kv[0]}>{`${kv[0]}push`}: {kv[1]? "true": "false"}</div> )}
                            </div>
                        </>
                    : ""}
                </div>
            </div>
            {isSubmit? <List filters={filter} view={view? view: viewOp} showPush={showPush? showPush: showPush1} setShowPush={setShowPush? setShowPush: setShowPush1} setView={setView? setView: setViewOp} filterOp={filterOp} form={form? form: showForm} setForm={setForm? setForm: setShowForm} />: ""}
        </div>
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