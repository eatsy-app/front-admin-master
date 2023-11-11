import {
  Banners,
  Card,
  CategoriesStore,
  Kit,
  Location,
  Notification,
  Offers,
  Pqr,
  PromoBannerDashboard,
  PromosBanner,
  Stores
} from 'container'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Login ({ ...args }) {
  const router = useRouter()
  const { name } = router.query || {}
  const props = {
    args
  }
  const rutesUpdate = {
    location: <Location {...props} />,
    banners: <Banners {...props} />,
    notification: <Notification {...props} />,
    promos: <PromosBanner {...props} />,
    stores: <Stores {...props} />,
    Pqr: <Pqr {...props} />,
    categories: <CategoriesStore {...props} />,
    offers: <Offers {...props} />,
    kit: <Kit {...props} />,
    card: <Card {...props} />,
    'promos-dashboard': <PromoBannerDashboard {...props} />
  }
  return (
    <div>
      <Head>
        <title>{process.env.NEXT_NAME_APP}</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {name && name[0] && rutesUpdate[name[0]]}
    </div>
  )
}
