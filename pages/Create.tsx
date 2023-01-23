import React, { FC } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation } from "urql";
import { useAtom, atom } from "jotai"
import { nextchars, reduceToString } from "../type/util";
import { convertif_tonv, nvmode } from "../type/jotai";
import { Box } from "@mui/material";
import { CreateWnInput, emptyCreateWnInput, WnType } from "../type/type";
import { findTwoSuffix } from "../type/spelling";

type Form = {
    // tail: string
    glo: string
    glojp: string
    lms: string
    lmsjp: string
};
type WnInfo = {
    spell: string;
    depth: number
};
type WhatSet<T> = {
    set: (d: T) => void
    state: T
}
type Lemmas = {
    lms: string[]
    lmsjp: string[]
}
const lmswhetherAtom = atom<Lemmas>({
    lms: [],
    lmsjp: [],
})
const lmsjpatom = atom([] as string[])
const lmsatom = atom([] as string[])

type ListFormProps  ={
    lmskey: keyof Lemmas
}
type Word = {
    word: string
}
const ListForm: React.FC<ListFormProps> = ({lmskey}: ListFormProps) => {
    // const [jp, setJp] = useAtom(lmsjpatom)
    // const [lms, setLms] = useAtom(lmsatom)

    const [words, setWords] = useAtom(lmswhetherAtom)

    const {register, handleSubmit} = useForm<Word>()
    const lemmaskey = lmskey as keyof Lemmas
    const submit = (f: Word) => {
        setWords({...words, [lemmaskey]: [f.word, ...words[lemmaskey]] })
    }

    return(<>
        <form onSubmit={handleSubmit(submit)}>
            <label htmlFor={lemmaskey}>{lemmaskey}</label>
            <input type="text" id={lemmaskey} {...register("word")} />
        </form>
        <div>{words[lemmaskey].reduce((before: string, word: string) => before+", "+word, "").substring(2)}</div>
        <div>{
            words[lemmaskey].map((word,i) => <EachWordForm key={i} i={i} word={word} lemmaskey={lemmaskey} />
            )}</div>
    </>)
}
type EachWordFormProps = {
    i: number
    word: string
    lemmaskey: keyof Lemmas
}
const EachWordForm: FC<EachWordFormProps> = ({i,word,lemmaskey}: EachWordFormProps) => {
    const [words, setWords] = useAtom(lmswhetherAtom)
    const {register, handleSubmit} = useForm<Word>({
        defaultValues: {word}
    })
    const update = (i: number) => (f: Word) => {
        words[lemmaskey][1] = f.word
        setWords({...words, [lemmaskey]: words[lemmaskey]})
    }
    const del = (i: number) => () => {
        words[lemmaskey].splice(i,1)
        setWords({...words, [lemmaskey]: words[lemmaskey]})
    }

    return(<form
        onSubmit={handleSubmit(update(i))}>
        <input type="text" {...register("word")} />
        <button onClick={del(i)} />
    </form>)
}

type ParentInfo = {
    seps: string[]
    sep: string
    spell: string
    jwlj: [{
        seps: string[]
    }]
    identicalsIn: [{
        seps: string[]
    }]
    identicalsOut: [{
        seps: string[]
    }]
}

type CreateProps = {
    hyper: WnInfo
}
const Create: React.FC<CreateProps> = ({ hyper }: { hyper: WnInfo }) => {
    // const [lmsjp, setLmsjp] = useAtom(lmsjpatom)
    const [nvmodeOn] = useAtom(nvmode)
    const [lemmas, setLemmas] = useAtom(lmswhetherAtom)
    const nextCharKouho = nextchars(hyper.spell)
    const { register, handleSubmit } = useForm<Form>();
    type Message = {
        tail: string
        result: string
    };
    const defMessage: Message = {
        tail: "",
        result: "",
    };
    const [message, setMessage] = React.useState<Message>(defMessage);
    const query = `
    query Wns($where: wnWhere) {
        wns(where: $where) {
            identicalsIn: {
                seps
            }
            identicalsOut: {
                seps
            }
            alias
            aliaseps
            seps
            sep
            spell
            jwlj {
                seps
                alias
                aliaseps
            }
        }
      }
    `;
    const [{ data, fetching, error }, redo] = useQuery({
        query,
        variables: {
            where: { spell: hyper.spell },
        },
    });
    return fetching
    ? <>fetching...</>
    : error ? <>hypernym error</>
    : (() => {
    console.log("data", data)
    const parent: ParentInfo = data.wns[0]

    const used_tails: string[] = parent.jwlj.map(
        (wn: { seps: string[] } ) => wn.seps[wn.seps.length-1]
    ).filter((tail: string|undefined) => tail !== undefined)
    console.log("used_tails:", used_tails)

    const notUsedAvailableChars = nextCharKouho.filter(c => !used_tails.includes(c))
    const selectedTail = notUsedAvailableChars.length > 0 ? notUsedAvailableChars[0] : findTwoSuffix(parent.spell)

    const validateTail = (tail: string) => {
        let status = false;
        if (tail==="") {
            setMessage(defMessage)
            return status
        }
        const range = tail.match(/^[wersdfzxcuiojklmnv]+$/);
        console.log(range)
        const availableCharMessage = `使える文字は次の何れかです: ` + notUsedAvailableChars.reduce((s, word)=> `${s} ${convertif_tonv (word, nvmodeOn)}`, "").slice(1)
        if (range === null) setMessage({...message, tail: "使えない文字が含まれています。" + availableCharMessage});
        else {
            let match = ""
            const notused = used_tails.every(t => {
                const r = new RegExp(`^${t}`)
                const m = tail.match(r)
                if (m !== null) {
                    match = m[0]
                    return false
                } else return true
            })
            if (!notused) setMessage({...message, tail: `-${match}が既に使われています。` + availableCharMessage});
            else {
                if (nextCharKouho.includes(tail)){
                    setMessage(defMessage);
                    status = true;
                } else {
                    setMessage({...message, tail: availableCharMessage})
                }
            }
        }
        return status;
    };
    const checkTail = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log("onchane")
        validateTail(e.target.value)
    }
    const getAliases = (identicals: WnType[], parentAliaseps: string[][]) => {

    }
    

    const submit = (f: Form) => {
        const query = `
        mutation CreateWns($input: [wnCreateInput!]!) {
            createWns(input: $input) {
              wns {
                childSize
                depth
                createdAt
                keifu {
                  lms
                }
                lmsjp
                lms
                pos
              }
            }
          }
        `
        const input: CreateWnInput = {
            ...emptyCreateWnInput,
            ...{
                childSize: 0
                ,spell: parent.spell + selectedTail
                ,seps: [...parent.seps, selectedTail]
                ,sep: parent.sep + "-" + selectedTail
                ,depth: hyper.depth+1
                ,glo: f.glo
                ,glojp: f.glojp
                ,lmsjp: lemmas.lmsjp
                ,lms: lemmas.lms
                ,name: lemmas.lms.length > 0 ? lemmas.lms[0] : ""
                ,createdBy: "uxiun"
            }
            // ...getAliases([...parent.identicalsIn, ...parent.identicalsOut])
        }
        const variables = { input: [
            input
        ]}
        const [{ data, fetching, error}, requery] = useQuery({query, variables})
        if (fetching) setMessage({...message, result: "追加中"}); else {
            if (error) setMessage({...message, result: "追加できませんでした。\n" + error})
            else {
                setMessage({...message, result: "追加しました。"})
                console.log("追加しました:", data)
            }
        }

    };

    return (
        <>
            <form onSubmit={handleSubmit(submit)}>
                <div>
                    <label htmlFor="tail">spell: </label>
                    <span>{hyper.spell + selectedTail}</span>
                    {/* <input
                        type="text"
                        id="tail"
                        {...register("tail", {
                            validate: validateTail,
                            onChange: checkTail,
                        })} /> */}
                </div>
                <div className="tail-status">{message.tail}</div>
                <ListFormWrapper lmskey="lmsjp" />
                <ListFormWrapper lmskey="lms" />
                {/* <div>
                    <label htmlFor="lms">lms</label>
                    <input type="text" id="lms"
                        {...register("lms")}
                    />
                </div> */}
                <div>
                    <label htmlFor="glojp">glojp</label>
                    <input
                        type="text"
                        id="glojp"
                        {...register("glojp")}
                    />
                </div>
                <div>
                    <label htmlFor="glo">glo</label>
                    <input
                        type="text"
                        id="glo"
                        {...register("glo")}
                    />
                </div>
            </form>
            <div>{message.result}</div>
        </>
    );
    })()
};

const ListFormWrapper: React.FC<{lmskey: string}> = ({lmskey}: {lmskey: string}) => {
    return ["lmsjp", "lms"].includes(lmskey)
    ? <ListForm lmskey={lmskey as keyof Lemmas} />
    : <>listformwrapper</>
}


export default Create;
