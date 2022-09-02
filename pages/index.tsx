import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import urqlClient from './api/client'
import {Provider} from "urql"
import Main from "./Main"

const Home: NextPage = () => {
  return(
    <Provider value={urqlClient}>
        <Main />
    </Provider>
  )
}

export default Home
