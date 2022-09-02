/* eslint-disable */
import {useQuery} from "urql"
import Wn from "./Wn"
import { Filter } from "./SearchBox"
// import {FixedSizeList} from "react-window"
const List = ({filters}: {filters: Filter}) => {
    const {lmsjp, spell, sep, glojp} = filters
    const query = `
    query Wns($where: wnWhere) {
        wns(where: $where) {
          spell
          seps
          sep
          glojp
          lmsjp
          lms
          depth
          childSize
          sisonSize
        }
      }
    `
    let vars = { where: {
        spell_STARTS_WITH: spell,
        sep_STARTS_WITH: sep,
        glojp_CONTAINS: glojp,
        lmsjp_INCLUDES: lmsjp,
    }}
    // if (lmsjp != "") {
    //     vars.where.
    // }
    console.log("filter: ", filters)
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
    console.log(data)
    return(<>
        spell: {spell}
        <ol>
            {data.wns.map(wn=>(
                <li key={wn.spell} className="wn" style={{"margin-bottom": "1em"}}>
                    <Wn wn={wn} />
                </li>
            ))}
        </ol>

    </>)
}
export default List

















