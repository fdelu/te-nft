import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Link from "next/link";
import { AppProps } from "next/app";
import styles from "./styles.module.scss";

function MyApp({ Component, pageProps }: AppProps) {

  const pageLinksInformation = [
    { text: "Market", href: "/" },
    { text: "Sell New Ticket", href: "/create-and-list-tickets" },
    { text: "Tickets Owned", href: "/my-tickets" },
    { text: "My Tickets on Market", href: "/my-listed-tickets" },
  ]

  const Links = pageLinksInformation.map(el => (
    <Link href={el.href} className={styles.pageLink}>{el.text}</Link>
  ));

  return (
    <div className={styles.page}>
      <nav className={styles.topBarContainer}>
        <p className={styles.title}>NFT Event Tickets</p>
        <div className={styles.pageLinkContainer}>
          {Links}
        </div>
      </nav>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
