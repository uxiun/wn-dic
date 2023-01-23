// import { NextApiRequest, NextApiResponse } from 'next';

// export default function handler(
//   request: NextApiRequest,
//   response: NextApiResponse,
// ) {
//   response.status(200).json({
//     body: request.body,
//     query: request.query,
//     cookies: request.cookies,
//   });
// }
import {ApolloServer} from "@apollo/server"
import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';

require("dotenv").config()
// (You may need to replace your connection details, username and password)
const AURA_ENDPOINT = process.env.AURA_ENDPOINT || ""
const USERNAME = process.env.USERNAME || ""
const PASSWORD = process.env.PASSWORD || ""

// Create Neo4j driver instance
const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(USERNAME, PASSWORD));

const typeDefs = `
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
const updCallback = async (root: any) => {
    return root.updateCount + 1
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


const server = await neoSchema.getSchema().then((schema) => {
    // Create ApolloServer instance to serve GraphQL schema
    const server = new ApolloServer({
        schema,
        // context: { driverConfig: { database: 'neo4j' } }
    });
    return server
});
export const graphqlHandler = startServerAndCreateLambdaHandler(server);
const port = 4000
// const {url} = await startStandaloneServer(server, {listen: {port}})

// const handler = server.then(e => e.createHandler())