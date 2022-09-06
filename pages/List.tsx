/* eslint-disable */
import {useQuery} from "urql"
import {useState} from "react"
import Wn from "./Wn"
import { FilterOp, SearchForm } from "./SearchBox"
import { SimpleViewOption, RootViewOption, ShowForm, } from "./SearchBox"
// import {FixedSizeList} from "react-window"
import { PushedOr } from "./Wn"
const Ko = ({show, setShow}) => {
    const toggle = e => {
        setShow(!show)
    }
    const state = () => {
        return show
    }
    return(<>
        <h1>{state()?"show!":"hide..."}</h1>
        <button onClick={toggle}>button</button>
    </>)
}
const Tameshi = () => {
    const [show, setShow] = useState(false)
    return(<>
    <Ko setShow={setShow} show={show} />
    </>)
}
const List = ({filters, view, setView, showPush, setShowPush, filterOp, form, setForm}: {filterOp: FilterOp, filters: SearchForm, view: RootViewOption, setView: any, showPush: PushedOr, setShowPush:any, form: ShowForm, setForm: any, }) => {
    const {lmsjp, spell, sep, glojp, exjp, lms, glo, ex} = filters
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

    let vars = { where: {
        sep_STARTS_WITH: sep,
        glojp_CONTAINS: glojp,
        glo_CONTAINS: glo,
        AND: [],
    }}
    if (filterOp.spell.compMatch) {
        vars.where.spell = spell
    } else {
        vars.where.spell_STARTS_WITH = spell
    }
    if (lmsjp != "") {
        vars.where.AND.push(
            {
                OR: [
                    {
                        lmsjp_INCLUDES: lmsjp
                    },
                    {
                        lmsjppush_SOME: {
                            push: lmsjp
                        }
                    }
                ]
            })
    }
    if (lms != "") {
        vars.where.AND.push({
            OR: [
                {
                    lms_INCLUDES: lms
                },
                {
                    lmspush_SOME: {
                        push: lms
                    }
                }
            ]
        })
    }
    const [{data, fetching, error}, redoQuery] = useQuery({query: query, variables: vars})
    if (fetching) return <p>Loading...</p>;
    if (error) return <p>Oh no... {error.message}</p>;

    // <FixedSizeList
    //     itemCount={1000}
    //     height={100}
    //     width={window.innerWidth}
    //     layout="vertical"
    //     itemSize={100}
    //     direction="ltr"
    //     >
    return(<div className="list">
        <h2>検索結果({data.wns.length})</h2>
        <ol>
            {data.wns.length===0 ? "見つかりませんでした" :
                <>{data.wns.map((wn: any)=>(
                    <li key={wn.spell} className="wn">
                        <Wn wn={wn} view={view} setView={setView} showHyper={false} showPush={showPush} setShowPush={setShowPush} form={form} setForm={setForm} />
                    </li>
                ))}</>
            }
        </ol>

    </div>)
}
export default List

















