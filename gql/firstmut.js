
const fs = require('fs');

function loadYamlFile(filename) {
    const yaml = require('js-yaml');
    const yamlText = fs.readFileSync(filename, 'utf8')
    return yaml.load(yamlText);
}
const { performance } = require('perf_hooks');

(async () => {
    const neo4j = require('neo4j-driver')
    const AURA_ENDPOINT = 'bolt+s://81744192.databases.neo4j.io';
    const USERNAME = 'neo4j';
    const PASSWORD = '9TPfKOB46nT5o6AZ2qHcVzbpEoyyJR_IGwXglE8zJUk';
    const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(USERNAME, PASSWORD));
    // Create Neo4j driver instance

    async function write(wn) {
        const session = driver.session({ database: 'neo4j' })
        try {
            // To learn more about the Cypher syntax, see https://neo4j.com/docs/cypher-manual/current/
            // The Reference Card is also a good resource for keywords https://neo4j.com/docs/cypher-refcard/current/
            const Query1 = `
                MATCH (j:wn)
                WHERE j.spell = $par_spell`
            const Query2 = `
                CREATE (d:wn {
                    syndex: $syndex,
                    spell: $spell,
                    seps: $seper,
                    sep: $seperated,
                    name: $name,
                    glo: $gls,
                    glojp: $glsjp,
                    lm: $lm,
                    lmjp: $lmjp,
                    lms: $lms,
                    lmsjp: $lmsjp,
                    ex: $ex,
                    exjp: $exjp,
                    exs: $exs,
                    exsjp: $exsjp,
                    pos: $pos,
                    depth: $depth,
                    childSize: $childSize,
                    sisonSize: $sisonSize,
                    princetonLink: $princetonLink,
                    gsrc: $gsrc,
                    dsrc: $dsrc
                })`
            const Query3 = `-[:kj]->(j)`
            const y = wn
            let vars = {
                syndex: y.index,
                spell: y.spell,
                seper: [y.spell_seperated],
                seperated: y.spell_seperated,
                name: y.name,
                gls: y.gloss,
                glsjp: y.glossjp,
                pos: "n",
                depth: y.depth,
                childSize: y.children_size,
                sisonSize: y.ruiseki,
                syndex: y.index,
                princetonLink: y.search_link,
                lm: "",
                lms: [],
                lmjp: "",
                lmsjp: [],
                ex: "",
                exs: [],
                exjp: "",
                exsjp: [],
                gsrc: y.gsrc,
                dsrc: y.dsrc
            }
            if (y.lemmas) {
                vars.lm = y.lemmas
                vars.lms = y.lemmas.split(", ")
            }
            if (y.lemmasjp != null) {
                vars.lmjp = y.lemmasjp
                vars.lmsjp = y.lemmasjp.split(", ")
            }
            if (y.examples != null) {
                vars.ex = y.examples
                vars.exs = y.examples.split(", ")
            }
            if (y.examplesjp != null) {
                vars.exjp = y.examplesjp
                vars.exsjp = y.examplesjp.split(", ")
            }

            let writeQuery = Query2
            if (wn.depth != 1) {
                let seper = wn.spell_seperated
                let sp = seper.split("-")
                vars.seper = [...sp] //spだとこのあとのpopが作用する
                sp.pop()
                vars.par_spell = sp.reduce((f, d) => f + d, "")
                writeQuery = Query1+Query2+Query3
            }
            // Write transactions allow the driver to handle retries and transient errors
            await session.writeTransaction(tx =>
                tx.run(writeQuery, vars)
            )
            // writeResult.records.forEach(record => {
            //     console.log(
            //         `wrote`
            //     )
            // })
        } catch (error) {
            console.error('Something went wrong: ', error)
        } finally {
            await session.close()
            // console.log(`wrote ${wn.spell}`)
        }
    }

    const sleep = ms => new Promise(res => setTimeout(res, ms))
    const dir = "/home/uxiun/w/wn-anki-parser/"
    const path = require("path")
    var files = fs.readdirSync(dir)
    const re = /^anki\..*/i
    let targets = []
    for (filename of files) {
        if (re.test(filename)) {
            const fullpath = path.join(dir, filename)
            targets.push(fullpath)
        }
    }
    // console.log(targets)
    const targets_tameshi = [
        "/home/uxiun/w/wn-anki-parser/anki.action.n.01.yaml"
    ]
    const restart_targets = [
        // '/home/uxiun/w/wn-anki-parser/anki.location.n.01.yaml',
        // '/home/uxiun/w/wn-anki-parser/anki.measure.n.02.yaml',
        // '/home/uxiun/w/wn-anki-parser/anki.motivation.n.01.yaml',
        // '/home/uxiun/w/wn-anki-parser/anki.natural_object.n.01.yaml',

        // '/home/uxiun/w/wn-anki-parser/anki.matter.n.03.yaml',
        // '/home/uxiun/w/wn-anki-parser/anki.group.n.01.yaml',

        // '/home/uxiun/w/wn-anki-parser/anki.object.n.01.yaml',
        // '/home/uxiun/w/wn-anki-parser/anki.organism.n.01.yaml',
        // '/home/uxiun/w/wn-anki-parser/anki.person.n.01.yaml', organismと接頭辞が被っているので使わない

        // '/home/uxiun/w/wn-anki-parser/anki.process.n.06.yaml',
        // '/home/uxiun/w/wn-anki-parser/anki.set.n.02.yaml',

        // '/home/uxiun/w/wn-anki-parser/anki.thing.n.12.yaml',

        '/home/uxiun/w/wn-anki-parser/anki.relation.n.01.yaml',
    ]
    // return 0
    for (const filename of restart_targets) {
        const startTime = performance.now();
        const dic = loadYamlFile(filename)
        let counter = 0
        for (const [key, value] of Object.entries(dic)) {
            const isok = await write(value)
            // if (counter%1000 == 0) {console.log(counter)}
            counter += 1
            // await sleep(60)
        }
        console.log("len "+counter)
        // Don't forget to close the driver connection when you're finished with it
        const endTime = performance.now()
        console.log(filename)
        console.log(endTime-startTime)
    }
    // await sleep(5000)
    await driver.close()
})();