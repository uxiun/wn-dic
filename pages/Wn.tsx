import { useState } from "react"
import { useQuery } from "urql"
const Hyp = ({ of, isHypo }: {of: any, isHypo: any}) => {
    const rel = isHypo ? "jwlj" : "jwlk"
    const query = `
        query Wns($where: wnWhere) {
            wns(where: $where) {
                ${rel} {
                    spell
                    seps
                    sep
                    glojp
                    lms
                    lmsjp
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
    return (
        <div className={classname}>
            {data.wns.map((container: any) => { return(<>{
                container[rel].map((wn: any)=> <Wn key={wn.spell} wn={wn} />)
            }</>)
            })}
        </div>
    )
}
type ShowRelType = {
    hyper: boolean,
    hypo: boolean
}
const Wn = ({ wn }: {wn: any}) => {
    const [showRel, setShowRel] = useState<ShowRelType>({
        hyper: false,
        hypo: false
    })
    const toggleShowRel = (d: string) => (e: any) => {
        const s = d as keyof ShowRelType
        const before = showRel[s]
        setShowRel({ ...showRel, [s]: !before })
    }
    return (
        <div key={wn.spell} className="wn">
            <div className="self">
                <div>{wn.depth}.{wn.childSize}.{wn.sisonSize}</div>
                <div>{wn.spell}</div>
                <div>{wn.sep}</div>
                <div>{wn.glojp} </div>
                {/* {if (wn.lms) return <ol>{wn.lms.map(l => <li>{l}</li>)}</ol>}
                {if (wn.lmsjp) return <ol>{wn.lmsjp.map(l => <li>{l}</li>)} </ol>} */}
            </div>
            <div className="control">
                <button onClick={toggleShowRel("hypo")}>{showRel.hypo ? "hide" : "show"} hyponyms</button>
                <button onClick={toggleShowRel("hyper")}>{showRel.hyper ? "hide" : "show"} hypernym</button>
            </div>
            <div className="more" >
                {showRel.hypo ? <Hyp of={wn} isHypo={true} /> : ""}
                {showRel.hyper ? <Hyp of={wn} isHypo={false} /> : ""}
            </div>
        </div>
    )
}
export default Wn