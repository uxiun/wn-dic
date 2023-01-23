export const objectSortBy = <U>(compareFn: ([j, ij]: [U, number], [k, il]: [U, number]) => number) => <T>(target: (t: T) => U) =>  (objects: T[]) => {
  let order = objects.map((o,i) => [target(o), i] as [U, number]).sort(compareFn)
  // console.log("objectPropertySort() order =", order)
  return order.map(([u, i])=> objects[i])
}
export const objectPropertySort = <U>(compareFn: ([j, ij]: [U, number], [k, il]: [U, number]) => number) => <T>(property: keyof T) =>  (objects: T[]) => {
  let order = objects.map((o,i) => [o[property], i] as [U, number]).sort(compareFn)
  // console.log("objectPropertySort() order =", order)
  return order.map(([u, i])=> objects[i])
}
// const rev = <T,U,K>(f: (t: T) => (u: U) => K) => (paramLast: U) => f(paramLast)
export const asciiSortFn = ([j,id]: [string, number], [k,il]: [string, number]) => {
  if ([j,k].sort()[0] === j) return -1
  else return 0
}
export const objectPropertyASCIIsort = objectPropertySort(asciiSortFn)
console.log((()=>{
  type sn = {
    s: string
    n: number
  }
  const os: sn[] = [{s: "hello", n: 5}, {s: "konnichiwa", n: 10}, {s: "break", n: 5}, {s: "b", n: 1}, {s: "ano", n: 3}]
  return objectSortBy(asciiSortFn)<sn>(t => t.s.replace("b", "a"))(os)
})())
export const asciiSortFaster = (i: number, sortedStringlistIndexed: [string, number][]) => {
  return sortedStringlistIndexed.findIndex(([e, j]) => j === i)
}
const sortStringListIndexed = (list: string[]) =>
  list.map((e,i) => [e,i]).sort()
export const toBool = (d:any) => d? true: false
export const routerQueryfold = (value: string | string[] | undefined): string =>
value
? (typeof value === "string")
? value
: (value as string[]).reduce((d,f) => d+f )
: ""

export const transposeLists = <T>(lists: T[][]) => {
  if (lists.length > 0 && lists.every(list => list.length === lists[0].length)) {
    return lists[0].map((e,i)=> [e, ...lists.slice(1).map(list => list[i]) ])
  }
}
export const isListItemAllSame = <T>(list: T[]) => {
  let before = undefined
  for (const k of list) {
    if (before === undefined) before = k
    else {
      if (JSON.stringify(before) !== JSON.stringify(k) ) return false
    }
  }
  return true
}
export const assertEqualList = <T>(lists: T[][]) => {
  const transposed = transposeLists(lists)
  if (transposed) {
    return transposed.every(es => isListItemAllSame(es))
  }
  return false
}

function keyscore(key: KeyInfo): number {
  let score = 0
  switch (key.yubi) {
    case 1: score += 1; break;
    case 3: score += 5; break;
    case 4: score += 100; break;
  }
  switch (key.dan) {
    case 1: score += 10; break;
    case -1: if ("cm".includes(key.char)) {score += 9} else score += 11; break;
  }
  return score
}
function smoothWithLast(lastChar: string){
  // if (lastChar.length == 1){
  const info = keyinfo_list.find(k=>k.char === lastChar)
  if (info === undefined) return []
  const oks = keyinfo_list.filter(k=> !(
    (k.left === info?.left && (
      k.yubi === info.yubi
      || Math.abs(k.dan - info?.dan) > 1
      )))
      && [1,2,3].includes(k.yubi)
      )
      console.log("yet sorted", oks.map(k => k.char))
      const r = sortKeys(oks)
      console.log("after sort", r.map(k => k.char))
      return r
      // }
    }
    // function smoothWithPenultimate(penultimateChar: string){
    //     if (penultimateChar.length == 1){
    //         const info = keyinfo_list.find(k=>k.char === penultimateChar)
    //         const oks = keyinfo_list.filter(k=> !(
    //             (k.left === info?.left && (
    //                 k.yubi === info.yubi
    //                 || Math.abs(k.dan - info?.dan) > 1
    //             )
    //         ))

    //     }
    // }
    const sortKeys = (keys: KeyInfo[]) => {
      const scored = keys
      .map(k=> [k, keyscore(k)] as [KeyInfo, number]);
      console.log("scored", scored)
      return scored.sort(([_,j],[i,k])=> j - k)
      .map(([key,_])=>key)
    }

    export function nextchars(spell: string) {
      const target = spell.slice(-2)
      return mapreduce(target.split(""), smoothWithLast, (j,k)=>{
        return k?.filter(key => j?.includes(key))
      }, keyinfo_list).map(key => key.char)
    }

    const mapreduce = <T,U>(iter: T[], f: (arg0: T)=>U, comp: (j: U, k: U)=>U, initial: U) => {
      let last = initial
      for (const t of iter) {
        last = comp(last, f(t))
      }
      return last
    }
    const flatReduce = <T,U>(iter: U[], f: (t: T, u: U)=>T[], initial: T[]) => {
      let last = initial
      for (const t of iter) {
        last = last.flatMap(k => f(k,t))
      }
      return last
    }
    export const multiSplit = (src: string, delemeters: string[]): string[] => {
      return flatReduce(delemeters, (src, del)=> src.split(del), [src])
    }
    export const reduceToString = (stringList: string[]) => stringList.reduce((j,k)=>j+k, "")

    export type KeyInfo = {
      char: string,
      left: boolean,
      yubi: number, //親指から順に0..5
      dan: number, //上から1 0 -1
    }
    export const keyinfo_list: KeyInfo[] = [
      {
        char: "w",
        yubi: 3,
        dan: 1,
        left: true,
      },
      {
        char: "e",
        yubi: 2,
        dan: 1,
        left: true,
      },
      {
        char: "r",
        yubi: 1,
        dan: 1,
        left: true,
      },
      {
        char: "s",
        yubi: 3,
        dan: 0,
        left: true,
      },
      {
        char: "d",
        yubi: 2,
        dan: 0,
        left: true,
      },
      {
        char: "f",
        yubi: 1,
        dan: 0,
        left: true,
      },
      {
        char: "z",
        yubi: 3,
        dan: -1,
        left: true,
      },
      {
        char: "x",
        yubi: 2,
        dan: -1,
        left: true,

      },
      {
        char: "c",
        yubi: 1,
        dan: -1,
        left: true,
      },
      {
        char: "a",
        yubi: 4,
        dan: 0,
        left: true,
      },
      {
        char: "o",
        yubi: 3,
        dan: 1,
        left: false,
      },
      {
        char: "i",
        yubi: 2,
        dan: 1,
        left: false,
      },
      {
        char: "u",
        yubi: 1,
        dan: 1,
        left: false,
      },
      {
        char: "l",
        yubi: 3,
        dan: 0,
        left: false,
      },
      {
        char: "k",
        yubi: 2,
        dan: 0,
        left: false,
      },
      {
        char: "j",
        yubi: 1,
        dan: 0,
        left: false,
      },
      {
        char: ".",
        yubi: 3,
        dan: -1,
        left: false,
      },
      {
        char: ",",
        yubi: 2,
        dan: -1,
        left: false,
      },
      {
        char: "m",
        yubi: 1,
        dan: -1,
        left: false,
      },
      {
        char: ";",
        yubi: 4,
        dan: 0,
        left: false,
      },
    ]
