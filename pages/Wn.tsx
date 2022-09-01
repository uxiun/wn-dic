import { useState } from "react"
import { useQuery } from "urql"
const Hyp = ({ of, isHypo }) => {
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
    return (
        <div className={rel}>
            {data.wns.map(container => { return(<>{
                container[rel].map(wn=> <Wn wn={wn} />)
            }</>)
            })}
        </div>
    )
}
const Wn = ({ wn }) => {
    const [showRel, setShowRel] = useState({
        hyper: false,
        hypo: false
    })
    const toggleShowRel = d => e => {
        const before = showRel[d]
        setShowRel({ ...showRel, [d]: !before })
    }
    return (
        <div className="wn">
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
            <div className="more" style={{"margin-left": "1em"}}>
                {showRel.hypo ? <Hyp of={wn} isHypo={true} /> : ""}
                {showRel.hyper ? <Hyp of={wn} isHypo={false} /> : ""}
            </div>
        </div>
    )
}
export default Wn