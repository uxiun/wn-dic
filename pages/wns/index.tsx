import type { NextPage, GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useQuery, Provider } from "urql"
import urqlClient from "../api/graphql"
import List from "../List"
import Wn from "../Wn"


const WnIndex: NextPage = () => {
    const router = useRouter()
    let filter = router.query
    const keys = [
        "spell",
        "lmsjp",
        "lms",
        "sep",
        "glojp",
        "glo"
    ]
    for (const key of keys) {
        if (!filter[key]) {
            filter[key] = ""
        } else {
            console.log(filter[key])
        }
    }
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
    const { spell, sep, glojp, lmsjp } = filter
    const vars = {
        where: {
            spell_STARTS_WITH: spell,
            sep_STARTS_WITH: sep,
            glojp_CONTAINS: glojp,
            lmsjp_INCLUDES: lmsjp
        }
    }
    console.log("spell", spell)
    const [{ data, fetching, error }, redoQuery] = useQuery({ query: query, variables: vars })
    if (fetching) return <p>Loading...</p>;
    if (error) {
        // console.error(error)
        return <p>Oh no... {error.message}</p>;
    }
    return (
        <Provider value={urqlClient}>
            <Link href="/">
                <a>戻る</a>
            </Link>
            <ol>
                {data.wns.map(wn => (
                    <li className="wn" style={{ "margin-bottom": "1em" }}>
                        <Wn wn={wn} />
                    </li>
                ))}
            </ol>
        </Provider>
    )
}
export default WnIndex


// export const getServerSideProps: GetServerSideProps = async (context) => {

//     return {
//         props: {
//             filter
//         },
//     }


//     return {
//         props: {
//             data
//         },
//     }
// }









