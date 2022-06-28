import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { APP_ID } from '@/lib/consts'
import { useRouter } from 'next/router'
import { trimIndentedSpaces } from '@/lib/utils'
import { useProfile } from '@/context/ProfileContext'
import useCreatePost from '@/hooks/lens/useCreatePost'
import { FC, FormEventHandler, useEffect, useState } from 'react'
import { MetadataVersions } from '@/types/metadata'
import { DEFAULT_COLLECT_TOKEN } from '@/constants'
import { gql, useQuery } from '@apollo/client'
import { Erc20 } from '@/types/lens'
import getTokenImage from '@/lib/getTokenImage'
import { useAccount } from 'wagmi'
import generateSnowflake from '@/lib/generateSnowflake'

const MODULES_CURRENCY_QUERY = gql`
	query EnabledCurrencyModules {
		enabledModuleCurrencies {
			name
			symbol
			decimals
			address
		}
	}
`

const UploadPage: FC = () => {
	const router = useRouter()
	const { profile, isAuthenticated } = useProfile()

	const { data: account } = useAccount()

	useEffect(() => {
		if (isAuthenticated) return

		router.push('/login?next=create/podcast')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])
	const [referral, setReferral] = useState<string>('')
	const [goal, setGoal] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const [recipient, setRecipient] = useState<string>(account?.address)
	const [title, setTitle] = useState<string>('')
	const [description, setDescription] = useState<string>('')

	const [selectedCurrency, setSelectedCurrency] = useState<string>(DEFAULT_COLLECT_TOKEN)
	const [selectedCurrencySymobol, setSelectedCurrencySymobol] = useState<string>('WMATIC')

	const { data: currencyData } = useQuery(MODULES_CURRENCY_QUERY, {})
	const { createPost } = useCreatePost()

	const uploadVideo: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()

		await createPost(
			{
				version: MetadataVersions.one,
				metadata_id: uuidv4(),
				description: trimIndentedSpaces(description),
				content: trimIndentedSpaces(description),
				external_url: null,
				image: `https://avatar.tobi.sh/${generateSnowflake()}.png`,
				imageMimeType: 'image/jpeg',
				name: title,
				attributes: [
					{
						traitType: 'string',
						key: 'type',
						value: 'crowdfund',
					},
					{
						traitType: 'string',
						key: 'goal',
						value: goal,
					},
				],
				media: [],
				appId: `${APP_ID} Crowdfund`,
			},
			{
				selectedCurrency: selectedCurrency,
				recipient: recipient,
				referralFee: referral,
				amount: amount,
			}
		)

		setTitle('')
		setDescription('')
		router.push(`/channel/${profile.handle}`)
		toast.success('Published!')
	}

	return (
		<div className="max-h-[85vh] overflow-x-auto">
			<div className="container mx-auto py-12 px-8">
				<div className="max-w-xl">
					<h3 className="text-4xl mb-5 leading-6 font-medium text-white">Podquest Request</h3>
					<p className="mt-2 text-md text-gray-400">
						{'Uploaded crowdfund requests will be visible on your profile, search and explore pages.'}
						<br />
						{'Other Lens-powered sites may choose to show them as well.'}
					</p>
				</div>
				<form onSubmit={uploadVideo} className="space-y-8 max-w-xl divide-y divide-gray-200">
					<div className="space-y-8 divide-y divide-gray-200">
						<div>
							<div className="mt-6 max-w-xl">
								<div>
									<label htmlFor="title" className="block text-sm font-medium text-gray-300">
										Title
									</label>
									<div className="mt-1">
										<input
											id="title"
											name="title"
											type="text"
											className="text-white shadow-sm bg-gray-600 block w-full sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
											required
											placeholder="Badgers : animated music video : MrWeebl"
											value={title}
											onChange={event => setTitle(event.target.value)}
										/>
									</div>
								</div>
								<div className="mt-5">
									<label htmlFor="description" className="block text-sm font-medium text-gray-300">
										Description
									</label>
									<div className="mt-1">
										<textarea
											id="description"
											name="description"
											rows={4}
											required
											className="text-white shadow-sm bg-gray-600 block w-full sm:text-sm border border-gray-300 rounded-md placeholder:text-gray-400"
											placeholder="badger badger badger badger"
											value={description}
											onChange={event => setDescription(event.target.value)}
										/>
									</div>
								</div>

								<div className="mt-5">
									<label htmlFor="description" className="block text-sm font-medium text-gray-300">
										Select Currency
									</label>
									<div className="mt-1">
										<select
											className="text-white w-full rounded bg-gray-600 border sm:text-sm border-gray-300 outline-none disabled:bg-gray-500 placeholder:text-gray-400 disabled:bg-opacity-20 disabled:opacity-60 focus:border-brand-500 focus:ring-brand-400"
											onChange={e => {
												const currency = e.target.value.split('-')
												setSelectedCurrency(currency[0])
												setSelectedCurrencySymobol(currency[1])
											}}
										>
											{currencyData?.enabledModuleCurrencies?.map((currency: Erc20) => (
												<option
													key={currency.address}
													value={`${currency.address}-${currency.symbol}`}
												>
													{currency.name}
												</option>
											))}
										</select>
									</div>
								</div>

								<div className="mt-5">
									<label htmlFor="title" className="block text-sm font-medium text-gray-300">
										Contribution amount
									</label>
									<div className="mt-1 h-full flex items-center justify-center w-full space-x-1">
										<img
											className="w-6 h-6"
											height={24}
											width={24}
											src={getTokenImage(selectedCurrencySymobol)}
											alt={selectedCurrencySymobol}
										/>
										<input
											id="title"
											name="title"
											step="0.0001"
											min="0"
											max="100000"
											type="number"
											className="text-white shadow-sm bg-gray-600 block w-full sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
											required
											placeholder="5"
											value={amount}
											onChange={event => setAmount(event.target.value)}
										/>
									</div>
								</div>
								<div className="mt-5">
									<label htmlFor="title" className="block text-sm font-medium text-gray-300">
										Funding Goal
									</label>
									<div className="mt-1 h-full flex items-center justify-center w-full space-x-1">
										<img
											className="w-6 h-6"
											height={24}
											width={24}
											src={getTokenImage(selectedCurrencySymobol)}
											alt={selectedCurrencySymobol}
										/>
										<input
											id="goal"
											name="goal"
											type="number"
											step="0.0001"
											min="0"
											max="100000"
											className="text-white shadow-sm bg-gray-600 block w-full sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
											required
											placeholder="420"
											value={goal}
											onChange={event => setGoal(event.target.value)}
										/>
									</div>
								</div>
								<div className="mt-5">
									<label htmlFor="title" className="block text-sm font-medium text-gray-300">
										Funds recipient
									</label>
									<div className="mt-1 ">
										<input
											id="recipient"
											name="recipient"
											type="text"
											className="text-white shadow-sm bg-gray-600 block w-full sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
											required
											placeholder="0x3A5bd...5e3"
											value={recipient}
											onChange={event => setRecipient(event.target.value)}
										/>
									</div>
								</div>
								<div className="mt-5 max-w-xl">
									<label htmlFor="title" className="block text-sm font-medium text-gray-300">
										Referral Fee
									</label>
									<div className="mt-1">
										<input
											id="referral"
											name="referral"
											type="number"
											min="0"
											max="100"
											className="text-white shadow-sm bg-gray-600 block w-full sm:text-sm border-gray-300 rounded-md placeholder:text-gray-400"
											required
											placeholder="5%"
											value={referral}
											onChange={event => setReferral(event.target.value)}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="pt-5">
						<div className="flex justify-end">
							<button
								type="submit"
								className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
							>
								Create
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export default UploadPage
