import List from "./List"
import urqlClient from "./api/client"
import {Provider} from "urql"
import {useRouter} from "next/router"
import SearchBox from "./SearchBox"
const Result = () => {
    const router = useRouter()
    return(<Provider value={urqlClient}>
        <SearchBox />
        <List filters={filter} view={viewOp} showPush={showPush} setView={setViewOp} filterOp={filterOp} />
        </Provider>)
}