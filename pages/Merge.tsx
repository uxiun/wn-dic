import { Autocomplete, Box, Button, SelectProps, TextField } from "@mui/material";
import { useAtom } from "jotai";
import { NextPage } from "next";
import { FC, MouseEventHandler, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "urql";
import { selectedSynsetsAtom } from "../type/jotai";
import { assertSynsetIdentical } from "../type/spelling";
import { WnType } from "../type/type";
import { toBool } from "../type/util";


type Message = {
  selecting: string
  result: string
}
type ActionForm = {
  action: string

}

const SuperSelect: NextPage = () => {
  const [selectedSynsets, setSelectedSynsets] = useAtom(selectedSynsetsAtom)
  const [message, setMessage] = useState<Message>({
    selecting: `${selectedSynsets.length}個選択中`,
    result: "",
  })


  const diselect = (i: number): MouseEventHandler<HTMLButtonElement> => e => {
    console.log("SuperSelectにて選択解除")
    selectedSynsets.splice(i,1)
    setSelectedSynsets([...selectedSynsets])
  }
  const allDiselect: MouseEventHandler<HTMLButtonElement> = e => {
    console.log("選択全解除")
    setSelectedSynsets([])
  }
  const merge = (cos: WnType[]) => {
    if (assertSynsetIdentical(cos)) {
      const wn = cos[0]
      const rem = cos.slice(1)
      wn.aliaseps = [...new Set ([
        wn.seps
        ,...(wn.aliaseps ?? [])
        , ...rem.flatMap(w => w.aliaseps ?? [] )
        , ...rem.map(w => w.seps)
        ].map(e => JSON.stringify(e)))].map(e => JSON.parse(e)) as string[][]
      wn.aliases = [...new Set ([
        wn.spell
        ,...(wn.aliases ?? [])
        , ...rem.flatMap(w => w.aliases)]
        .filter(k => k !== undefined) as string[])]

      const query = `
      mutation UpdateWns($update: wnUpdateInput, $where: wnWhere) {
        updateWns(update: $update, where: $where) {
          wns {
            aliaseps
            aliases
            lastModified
          }
        }
      }
      `
      const childQuery = ``

      const [{data, fetching, error}, redoQuery] = useQuery<{
        aliaseps: string[][]
        aliases: string[]
        lastModified: string
      }>({query, variables: wn})
      if (error) console.error(error)
      else {
        console.log("merge result:", data)
        setMessage({...message, result: `合併しました。`})
      }
    } else {
      setMessage({...message, result: `同一でないため合併できません。`})
    }
  }
  const showAllConsole = (ns: WnType[]) => console.log(ns)

  const actionWithNames: [string, (s: WnType[])=>void ][] = [
    ["合併 merge", merge],
    ["出力 show on console.log", showAllConsole],
  ]
  const actionAndName = new Map(actionWithNames)
  const doAction = (f: ActionForm) => {
    const action = actionAndName.get(f.action)
    if (action !== undefined) action(selectedSynsets)
  }
  const { control, setValue, handleSubmit } = useForm<ActionForm>({
    defaultValues: {
      action: actionWithNames[0][0]
    }
  })
  return(<>
    <Box component="form" onSubmit={handleSubmit(doAction)} >
      <Controller control={control} name="action"
        render={()=>
          <Autocomplete
            options={actionWithNames.map(([name,_])=>name)}
            renderInput={(ks)=> <TextField {...ks} label="操作" /> }
            onChange={(e, v)=>{
              setValue("action", v ?? "", {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
              })
            }}
          />
        }
      />
      <Button type="submit">実行</Button>
    </Box>
    <Button onClick={allDiselect}>全て選択解除</Button>
    <ol>{selectedSynsets.map((s,i)=>
      <li key={s.spell}>
        <>
          {JSON.stringify(s)}
          <Button onClick={diselect(i)}>選択解除</Button>
        </>
      </li>
    )}</ol>
  </>)
}


export default SuperSelect