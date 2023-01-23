import { useAtom } from "jotai"
import { isSearchSubmitAtom } from "../type/jotai"
import { defxsearchxop } from "../type/type"
import AmiAdd from "./ami/add"
import SearchResultList from "./List"
import SuperSelect from "./Merge"
import SearchBox from "./SearchBox"

export default function Main() {
    const [isSubmit] = useAtom(isSearchSubmitAtom)
    return(
        <>
            <AmiAdd spell="spell" />
            <div>
                <div className="main">
                    <SearchBox />
                    {isSubmit?
                        <SearchResultList searchop={defxsearchxop}
                        />
                    : <div className="side list" />
                    }
                </div>
                <div id="superselect">
                    <SuperSelect />
                </div>
            </div>
        </>
    )
}