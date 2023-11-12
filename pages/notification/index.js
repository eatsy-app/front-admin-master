import { Notification } from 'container/update/Notifications'
import Head from 'next/head'
export default function Home() {
  return (
    <div >
      <Head>
        <title>Create Next App</title>
        <meta content='Generated by create next app' name='description' />
        <link href='/favicon.ico' rel='icon' />
      </Head>
      <Notification />
    </div>
  )
}
