// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createClient } from 'urql';

const urqlClient = createClient({url: "http://localhost:4000/"})
// const urqlClient = createClient({url: "http://localhost:3000/api/graphql"})
export default urqlClient