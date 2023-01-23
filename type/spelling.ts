import { defWn, WnType, WnTypeSpellAbolished } from "./type"
import { assertEqualList, isListItemAllSame, toBool } from "./util"

export const assertSynsetIdentical = (synsets: WnType[]) => {
  const chain = synsets as (WnType | undefined)[]
  return toBool(chain.reduce((j, k) => j ? (j.glojp === k?.glojp
    && j.createdAt === k.createdAt
    && assertEqualList(synsets.map(s => s.aliaseps ?? []))
    && isListItemAllSame(synsets.map(s => s.spell ?? ""))
    ? k : undefined) : j
  ))
}

export const findTwoSuffix = (spell: string) => {
  return ""
}

export const convert_spellAbolishing = (wn: WnType): WnTypeSpellAbolished => ({
  aliaseps: wn.aliaseps,
  aliases: wn.aliases,
  childSize: wn.childSize,
  createdAt: wn.createdAt,
  createdBy: wn.createdBy,
  depth: wn.depth,
  dsrc: wn.dsrc,
  ex: wn.ex,
  exjp: wn.exjp,
  exs: wn.exs,
  exsjp: wn.exsjp,
  glo: wn.glo,
  glojp: wn.glojp,
  gsrc: wn.gsrc,
  id: wn.id,
  identicalsIn: wn.identicalsIn,
  identicalsOut: wn.identicalsOut,
  jwlj: wn.jwlj,
  jwlk: wn.jwlk,
  lm: wn.lm,
  lmjp: wn.lmjp,
  lms: wn.lms,
  lmsjp: wn.lmsjp,
  lmspush: wn.lmspush,
  lmsjppush: wn.lmsjppush,
  lastModified: wn.lastModified,
  name: wn.name,
  pos: wn.pos,
  princetonLink: wn.princetonLink,
  relj: wn.relj,
  relk: wn.relk,
  sisonSize: wn.sisonSize,
  sep: wn.sep,
  seps: wn.seps,
  spell: wn.spell,
  syndex: wn.syndex,
  updateCount: wn.updateCount,

})

export const convert_fromAbolished = (wn: WnTypeSpellAbolished): WnType => {
  const re: WnType = {
    ...defWn,
    aliaseps: wn.aliaseps,
    aliases: wn.aliases,
    childSize: wn.childSize,
    createdAt: wn.createdAt,
    createdBy: wn.createdBy,
    depth: wn.depth,
    dsrc: wn.dsrc,
    ex: wn.ex,
    exjp: wn.exjp,
    exs: wn.exs,
    exsjp: wn.exsjp,
    glo: wn.glo,
    glojp: wn.glojp,
    gsrc: wn.gsrc,
    id: wn.id,
    identicalsIn: wn.identicalsIn,
    identicalsOut: wn.identicalsOut,
    jwlj: wn.jwlj,
    jwlk: wn.jwlk,
    lm: wn.lm,
    lmjp: wn.lmjp,
    lms: wn.lms,
    lmsjp: wn.lmsjp,
    lmspush: wn.lmspush,
    lmsjppush: wn.lmsjppush,
    lastModified: wn.lastModified,
    name: wn.name,
    pos: wn.pos,
    princetonLink: wn.princetonLink,
    relj: wn.relj,
    relk: wn.relk,
    spell: wn.spell ?? (wn.aliases ?? [""])[0],
    sep: wn.sep ?? (wn.aliaseps ?? [[""]])[0].reduce((j,k)=>j+"-"+k).slice(1),
    seps: wn.seps ?? (wn.aliaseps ?? [[]])[0],
    sisonSize: wn.sisonSize,
    updateCount: wn.updateCount,

  }
  return re

}
export type AggregateCount = {
  count: number
}
export type jwljAggregateCount = {
  jwljAggregate: AggregateCount
}