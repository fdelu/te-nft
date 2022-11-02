import '../styles/globals.css'
import Link from 'next/link'
import { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div>
      <nav className="border-b p-6">
        <p className="text-4xl font-bold">Bored Pet Marketplace</p>
        <div className="flex mt-4">
          <Link href="/">
            <a className="mr-4 text-teal-400">
              Home
            </a>
          </Link>
          <Link href="/create-and-list-nft">
            <a className="mr-6 text-teal-400">
              Sell a new NFT
            </a>
          </Link>
          <Link href="/my-nfts">
            <a className="mr-6 text-teal-400">
              My NFTs
            </a>
          </Link>
          <Link href="/my-listed-nfts">
            <a className="mr-6 text-teal-400">
              My Listed NFTs
            </a>
          </Link>
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  )
}

export default MyApp