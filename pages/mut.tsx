const {useQuery, useMutation} = require("urql")
const spelltown = (spell) => {
    const m = `
    query Wns($where: wnWhere) {
        wns(where: $where) {

        }
      }
    `
    const vars = { where: { spell }}
    const [{data, fetching, error}, redoQuery] = useQuery({query: m, variables: vars})
    if (error) {console.error(error)}
    return data.wns[0]
}
const connect_par = (spell) => {

}
function loadYamlFile(filename) {
    const fs = require('fs');
    const yaml = require('js-yaml');
    const yamlText = fs.readFileSync(filename, 'utf8')
    return yaml.load(yamlText);
  }
const format = (yml) => {
    let seper = yml.spell_seperated
    let sp = seper.split("-")
    yml.spell_seperated = sp
    sp.pop()
    const par_spell = sp.reduce((f,d)=> f+d , "")
    yml.par_spell = par_spell
    //const par = spelltown(par_spell)
    //yml.keifu = [...par.keifu, par]
    const list = ["lemmas", "lemmasjp"]
    for (const key of list) {
        var s = yml[key]
        const l = s.split(", ")
        yml.jwlk =
        yml[key] = l
    }
    return yml
}
const mut = (yml, index) => {
    const y = format(yml)
    const mutQuery = `
    mutation CreateWns($input: [wnCreateInput!]!) {
        createWns(input: $input) {
          info {
            nodesCreated
          }
        }
      }
    `
    const vars = {
        input: [
          {
            index,
            spell: y.spell,
            seper: y.spell_seperated,
            name: y.name,
            gls: y.gloss,
            glsjp: y.glossjp,
            lms: y.lemmas,
            lmsjp: y.lemmasjp,
            keifu: y.keifu,
            exs: y.examples,
            exsjp: y.examplesjp,
            depth: y.depth,
            childSize: y.children_size,
            sisonSize: y.ruiseki,
            syndex: y.index,
            princetonLink: y.search_link,
            jwlk: {
              connect: [
                {
                  where: {
                    node: {
                      spell: y.par_spell
                    }
                  }
                }
              ]
            }
          }
        ]
      }
      const [{error, fetching, data}, doMut] = useMutation(mutQuery)
      doMut(vars).then(r=>{
        if (r.error){
            console.error(r.error)
            return false
        }
      })
      return true
}


const attribute = loadYamlFile("/home/uxiun/w/wn-anki-parser/anki.attribute.n.02.yaml")
console.log("attribute", attribute.kj)
let counter = 0
for (const [key, value] of Object.entries(attribute)) {
    console.log(`key: ${key}`)
    const ok = mut(value, counter)
    if (!ok) {break}
    counter += 1
}

