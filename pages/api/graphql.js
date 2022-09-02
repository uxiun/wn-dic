
// const { Neo4jGraphQL } = require("@neo4j/graphql");
// const { ApolloServer, gql } = require("apollo-server");
// const neo4j = require("neo4j-driver");
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { ApolloServer, gql } from "apollo-server"

require("dotenv").config()
// (You may need to replace your connection details, username and password)
const AURA_ENDPOINT = process.env.AURA_ENDPOINT
const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD

// Create Neo4j driver instance
const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(USERNAME, PASSWORD));

const typeDefs = gql`
type tameshi {
    spell: String!
    lists: [String!]!
    from: [tameshi!]! @relationship(type: "tameshi", direction: IN)
}
type wn {
    id: String
    spell: String!
    seps: [String!]!
    sep: String!
    name: String!
    glo: String!
    glojp: String!
    lm: String
    lmjp: String
    lms: [String]
    lmsjp: [String]
    keifu: [wn!]!
    ex: String
    exjp: String
    exs: [String]
    exsjp: [String]
    pos: String
    depth: Int!
    childSize: Int!
    sisonSize: Int!
    syndex: Int!
    princetonLink: String!
    gsrc: String!
    dsrc: String!
    jwlk: [wn!]! @relationship(type: "kj", direction: OUT, properties: "Rel")
    jwlj: [wn!]! @relationship(type: "kj", direction: IN, properties: "Rel")
    createdAt: DateTime @timestamp(operations: [CREATE])
    lastModified: DateTime @timestamp(operations: [CREATE, UPDATE])
    updateCount: Int @callback(operations: [UPDATE], name: "upd")
}
interface Rel @relationshipProperties {
    k: [String!]
}
`
const updCallback = async(root) =>{
    return root.updateCount+1
}

// Create instance that contains executable GraphQL schema from GraphQL type definitions
const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    config: {
        callbacks: {
            upd: updCallback
        }
    }
});

// // Generate schema
// neoSchema.getSchema().then((schema) => {
//     // Create ApolloServer instance to serve GraphQL schema
//     const server = new ApolloServer({
//         schema,
//         context: { driverConfig: { database: 'neo4j' } }
//     });

//     // Start ApolloServer
//     server.listen().then(({ url }) => {
//         console.log(`GraphQL server ready at ${url}`);
//     });
// });

// const startServer = () => {
//     neoSchema.getSchema().then((schema) => {
//         // Create ApolloServer instance to serve GraphQL schema
//         const server = new ApolloServer({
//             schema,
//             context: { driverConfig: { database: 'neo4j' } }
//         });
//         server.listen().then(({url}) => {
//             console.log(`GraphQL server ready at ${url}`);
//         })
//     });
// }


// export const url_export = startServer()
export default async function handler(req, res) {
    if (req.method === "OPTIONS") {
        res.end()
        return false
    }
    neoSchema.getSchema().then(async(schema) => {
        // Create ApolloServer instance to serve GraphQL schema
        const server = new ApolloServer({
            schema,
            context: { driverConfig: { database: 'neo4j' } },
            playground: true
        });

        server.listen().then(({url}) => {
            console.log(`GraphQL server ready at ${url}`);
        })
        await server.createHandler({
            path: "/api/graphql",
        })(req, res);
    });
}
export const config = {
    api: {
        bodyParser: false,
    }
}