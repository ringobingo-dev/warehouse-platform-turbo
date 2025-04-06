import type { AppProps } from "next/app"
import { BoxProvider } from "@/contexts/BoxContext"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BoxProvider>
      <Component {...pageProps} />
    </BoxProvider>
  )
}

export default MyApp

