import '@/styles/app.css'
import client from '@/lib/apollo'
import Layout from '@/components/Layout'
import { ApolloProvider } from '@apollo/client'
import { APP_NAME, IS_MAINNET } from '@/lib/consts'
import { SkeletonTheme } from 'react-loading-skeleton'
import { chain, createClient, WagmiConfig } from 'wagmi'
import { ProfileProvider } from '@/context/ProfileContext'
import { apiProvider, configureChains, getDefaultWallets, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import stores from '@/stores'
import { Provider } from 'react-redux'
import Script from 'next/script'
import { IS_PRODUCTION } from '@/constants'

const { chains, provider } = configureChains(
	[IS_MAINNET ? chain.polygon : chain.polygonMumbai],
	[apiProvider.infura(process.env.NEXT_PUBLIC_INFURA_ID), apiProvider.fallback()]
)

const { connectors } = getDefaultWallets({ appName: APP_NAME, chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })

const App = ({ Component, pageProps }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<Provider store={stores}>
				<RainbowKitProvider chains={chains} theme={lightTheme({ accentColor: 'red' })}>
					<ApolloProvider client={client}>
						<SkeletonTheme baseColor="#00000010" highlightColor="#00000040" width={100}>
							<ProfileProvider>
								<Layout>
									<Component {...pageProps} />
								</Layout>
							</ProfileProvider>
						</SkeletonTheme>
					</ApolloProvider>
				</RainbowKitProvider>
			</Provider>
			{IS_PRODUCTION && (
				<Script
					data-website-id="b157d8e8-cfc3-47ef-8707-1abbd798ca04"
					src="https://unami-eight.vercel.app/umami.js"
					async
					defer
				/>
			)}
		</WagmiConfig>
	)
}

export default App
