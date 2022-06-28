import LensHubProxy from '@/abis/LensHubProxy.json'
import { gql, useMutation } from '@apollo/client'
import { LensterPost } from '@/types/lenstertypes'
import { CreateMirrorBroadcastItemResult } from '@/types/lens'
import { HeartIcon } from '@heroicons/react/solid'
import { HeartIcon as HeartIconOutlined } from '@heroicons/react/outline'
import omit from '@/lib/omit'
import splitSignature from '@/lib/splitSignature'
import { motion } from 'framer-motion'
import { FC, useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { CHAIN_ID, CONNECT_WALLET, ERROR_MESSAGE, RELAY_ON, LENSHUB_PROXY, WRONG_NETWORK } from 'src/constants'
import { useAccount, useContractWrite, useNetwork, useSignTypedData } from 'wagmi'
import { BROADCAST_MUTATION } from '@/graphql/BroadcastMutation'

import HAS_MIRRORED from '@/graphql/has-mirrored'
import { useQuery } from '@apollo/client'
import { HasMirroredResult } from '@/types/lens'
import Spinner from './Spinner'
import { useProfile } from '@/context/ProfileContext'

const CREATE_MIRROR_TYPED_DATA_MUTATION = gql`
	mutation CreateMirrorTypedData($request: CreateMirrorRequest!) {
		createMirrorTypedData(request: $request) {
			id
			expiresAt
			typedData {
				types {
					MirrorWithSig {
						name
						type
					}
				}
				domain {
					name
					chainId
					version
					verifyingContract
				}
				value {
					nonce
					deadline
					profileId
					profileIdPointed
					pubIdPointed
					referenceModule
					referenceModuleData
					referenceModuleInitData
				}
			}
		}
	}
`

interface Props {
	post: LensterPost
}

const Mirror: FC<Props> = ({ post }) => {
	const [count, setCount] = useState<number>(0)
	const { profile } = useProfile()
	const { activeChain } = useNetwork()
	const { data: account } = useAccount()
	const [isMirroring, setMirroring] = useState<boolean>(false)

	useQuery<{ hasMirrored: HasMirroredResult[] }>(HAS_MIRRORED, {
		variables: { profileId: post.profile?.id, publicationIds: [post.id] },
		skip: !post.profile?.id,
		onCompleted(data) {
			setMirroring(
				data.hasMirrored?.[0]?.results?.find(mirroredPost => mirroredPost.publicationId === post?.id)
					?.mirrored ?? false
			)
		},
	})

	useEffect(() => {
		if (post?.stats?.totalAmountOfMirrors) {
			setCount(post?.stats?.totalAmountOfMirrors)
		}
	}, [post?.stats?.totalAmountOfMirrors])

	const { isLoading: signLoading, signTypedDataAsync } = useSignTypedData({
		onError(error) {
			toast.error(error?.message)
		},
	})
	const onCompleted = () => {
		setMirroring(true)
		setCount(count + 1)
		toast.success('Post has been mirrored!')
	}
	const { isLoading: writeLoading, write } = useContractWrite(
		{
			addressOrName: LENSHUB_PROXY,
			contractInterface: LensHubProxy,
		},
		'mirrorWithSig',
		{
			onSuccess() {
				onCompleted()
			},
			onError(error: any) {
				toast.error(error?.data?.message ?? error?.message)
			},
		}
	)

	const [broadcast, { loading: broadcastLoading }] = useMutation(BROADCAST_MUTATION, {
		onCompleted({ broadcast }) {
			if (broadcast?.reason !== 'NOT_ALLOWED') {
				onCompleted()
			}
		},
		onError(error) {
			console.log('Relay Error', '#ef4444', error.message)
		},
	})

	const [createMirrorTypedData, { loading: typedDataLoading }] = useMutation(CREATE_MIRROR_TYPED_DATA_MUTATION, {
		onCompleted({ createMirrorTypedData }: { createMirrorTypedData: CreateMirrorBroadcastItemResult }) {
			console.log('Mutation', '#4ade80', 'Generated createMirrorTypedData')
			const { id, typedData } = createMirrorTypedData
			const {
				profileId,
				profileIdPointed,
				pubIdPointed,
				referenceModule,
				referenceModuleData,
				referenceModuleInitData,
			} = typedData?.value

			signTypedDataAsync({
				domain: omit(typedData?.domain, '__typename'),
				types: omit(typedData?.types, '__typename'),
				value: omit(typedData?.value, '__typename'),
			}).then(signature => {
				const { v, r, s } = splitSignature(signature)
				const inputStruct = {
					profileId,
					profileIdPointed,
					pubIdPointed,
					referenceModule,
					referenceModuleData,
					referenceModuleInitData,
					sig: {
						v,
						r,
						s,
						deadline: typedData.value.deadline,
					},
				}
				if (RELAY_ON) {
					broadcast({ variables: { request: { id, signature } } }).then(({ data: { broadcast }, errors }) => {
						if (errors || broadcast?.reason === 'NOT_ALLOWED') {
							write({ args: inputStruct })
						}
					})
				} else {
					write({ args: inputStruct })
				}
			})
		},
		onError(error) {
			toast.error(error.message ?? ERROR_MESSAGE)
		},
	})

	const createMirror = () => {
		if (!account?.address) {
			toast.error(CONNECT_WALLET)
		} else if (activeChain?.id !== CHAIN_ID) {
			toast.error(WRONG_NETWORK)
		} else {
			createMirrorTypedData({
				variables: {
					request: {
						profileId: profile?.id,
						publicationId: post?.id,
						referenceModule: {
							followerOnlyReferenceModule: false,
						},
					},
				},
			})
		}
	}

	return (
		<motion.button
			whileTap={{ scale: 0.9 }}
			onClick={createMirror}
			disabled={typedDataLoading || writeLoading || isMirroring}
		>
			<div className="flex items-center space-x-1 text-brand">
				<div>
					{typedDataLoading || signLoading || broadcastLoading || writeLoading ? (
						<div className="m-3">
							<Spinner />
						</div>
					) : (
						<div className="flex items-center space-x-1 hover:bg-gray-100 text-gray-500 rounded-full p-2">
							{isMirroring ? (
								<HeartIcon className="w-6 h-6" />
							) : (
								<HeartIconOutlined className="w-6 h-6" />
							)}
						</div>
					)}
				</div>
			</div>
		</motion.button>
	)
}

export default Mirror
