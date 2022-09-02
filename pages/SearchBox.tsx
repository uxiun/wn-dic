import { useState, VFC} from "react"
import { useRouter } from "next/router"
import { useForm, SubmitHandler } from "react-hook-form"
import List from "./List"
export type SearchForm = {
    lmsjp: string,
    spell: string,
    sep: string,
    glojp: string
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
const SearchBox: VFC = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<SearchForm>()
    const [isSubmit, setSubmit] = useState(false)
    // const [filter, setFilter] = useState<Filter>({
    //     duration: 0,
    //     updatedAt: Date.now(),
    //     submit: false,
    //     lmsjp: "",
    //     spell: "",
    //     sep: "",
    //     glojp: "",
    // })
    const [filter, setFilter] = useState<SearchForm>({
        lmsjp: "",
        spell: "",
        sep: "",
        glojp: "",
    })
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
    return (
        <div>
            <form onSubmit={handleSubmit(toggleView)} >
                <input {...register("spell")} />
                <button type="submit">検索</button>
            </form>
            {isSubmit? <List filters={filter} />: ""}
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