
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
const neo4j = require("neo4j-driver");
require("dotenv").config()
// (You may need to replace your connection details, username and password)
const AURA_ENDPOINT = process.env.AURA_ENDPOINT
const USERNAME = process.env.USERNAME
const PASSWORD = process.env.PASSWORD

// Create Neo4j driver instance
const driver = neo4j.driver(AURA_ENDPOINT, neo4j.auth.basic(USERNAME, PASSWORD));

const typeDefs = `
type tameshi {
    spell: String!
    lists: [String!]!
    from: [tameshi!]! @relationship(type: "tameshi", direction: IN)
}
type User {
    name: String!
    id: ID! @id
    push: [Push!]! @relationship(type: "byuser", direction: OUT)
    synsets: [wn!]! @relationship(type: "create-synset", direction: OUT)
}

type Push {
    pusher: User! @relationship(type: "byuser", direction: IN)
    push: String!
    lang: String!
    id: ID! @id
    lms: [wn!]! @relationship(type: "lms", direction: OUT)
    lmsjp: [wn!]! @relationship(type: "lmsjp", direction: OUT)
}
type wn {
    id: ID! @id
    spell: String
    seps: [String!]
    sep: String
    name: String
    glo: String!
    glojp: String!
    lm: String
    lmjp: String
    lms: [String]
    lmsjp: [String]
    lmspush: [Push!]! @relationship(type: "lms", direction: IN)
    lmsjppush: [Push!]! @relationship(type: "lmsjp", direction: IN)
    keifu: [wn!]!
    ex: String
    exjp: String
    exs: [String]
    exsjp: [String]
    pos: String
    depth: Int!
    childSize: Int!
    sisonSize: Int!
    syndex: Int
    princetonLink: String
    gsrc: String
    dsrc: String
    identicalsOut: [wn!]! @relationship(type: "identical", direction: OUT)
    identicalsIn: [wn!]! @relationship(type: "identical", direction: IN)
    aliases: [String!]
    aliaseps: [[String!]!]
    jwlk: [wn!]! @relationship(type: "kj", direction: OUT, properties: "Rel")
    jwlj: [wn!]! @relationship(type: "kj", direction: IN, properties: "Rel")
    relk: [wn!]! @relationship(type: "j", direction: OUT, properties: "Rel")
    relj: [wn!]! @relationship(type: "j", direction: IN, properties: "Rel")
    createdBy: User @relationship(type: "create-synset", direction: IN)
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

// Generate schema
neoSchema.getSchema().then((schema) => {
    // Create ApolloServer instance to serve GraphQL schema
    const server = new ApolloServer({
        schema,
        context: { driverConfig: { database: 'neo4j' } }
    });

    // Start ApolloServer
    server.listen().then(({ url }) => {
        console.log(`GraphQL server ready at ${url}`);
    });
});