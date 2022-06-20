import { ethers } from 'ethers'
import { omit } from '@/lib/utils'
import toast from 'react-hot-toast'
import { useCallback } from 'react'
import { toastOn } from '@/lib/toasts'
import { uploadJSON } from '@/lib/ipfs'
import { Mutation } from '@/types/lens'
import { Metadata } from '@/types/metadata'
import { useMutation } from '@apollo/client'
import LensHubProxy from '@/abis/LensHubProxy.json'
import { useProfile } from '@/context/ProfileContext'
import BROADCAST_MUTATION from '@/graphql/broadcast/broadcast'
import { ERROR_MESSAGE, LENSHUB_PROXY, RELAYER_ON } from '@/lib/consts'
import CREATE_POST_SIG from '@/graphql/publications/create-post-request'
import { useAccount, useContractWrite, useNetwork, useSignTypedData } from 'wagmi'

type CreatePost = { createPost: (post: Metadata, crowdfund?: any) => Promise<unknown>; loading: boolean; error?: Error }
type CreatePostOptions = { onSuccess?: () => void }

const useCreatePost = ({ onSuccess }: CreatePostOptions = {}): CreatePost => {
	const { profile } = useProfile()
	const { activeChain } = useNetwork()
	const { data: account } = useAccount()

	//#region Data Hooks
	const [getTypedData, { loading: dataLoading, error: dataError }] = useMutation<{
		createPostTypedData: Mutation['createPostTypedData']
	}>(CREATE_POST_SIG, {
		onError: error => toast.error(error.message ?? ERROR_MESSAGE),
	})
	const {
		signTypedDataAsync: signRequest,
		isLoading: sigLoading,
		error: sigError,
	} = useSignTypedData({
		onError: error => {
			toast.error(error.message ?? ERROR_MESSAGE)
		},
	})
	const {
		writeAsync: sendTx,
		isLoading: txLoading,
		error: txError,
	} = useContractWrite(
		{
			addressOrName: LENSHUB_PROXY,
			contractInterface: LensHubProxy,
		},
		'postWithSig',
		{
			onError(error: any) {
				toast.error(error?.data?.message ?? error?.message)
			},
			onSuccess() {
				onSuccess && onSuccess()
			},
		}
	)
	const [broadcast, { loading: gasslessLoading, error: gasslessError }] = useMutation<{
		broadcast: Mutation['broadcast']
	}>(BROADCAST_MUTATION, {
		onCompleted({ broadcast }) {
			if ('reason' in broadcast) return toast.error(broadcast.reason)

			onSuccess && onSuccess()
		},
		onError() {
			toast.error(ERROR_MESSAGE)
		},
	})
	//#endregion

	const createPost = useCallback(
		async (post: Metadata, crowdfund: any) => {
			if (!account?.address) throw toast.error('Please connect your wallet first.')
			if (activeChain?.unsupported) throw toast.error('Please change your network.')
			if (!profile?.id) throw toast.error('Please create a Lens profile first.')

			const { id, typedData } = await toastOn(
				async () => {
					const ipfsCID = await uploadJSON(post)

					const {
						data: { createPostTypedData },
					} = await getTypedData({
						variables: {
							request: {
								profileId: profile.id,
								contentURI: `ipfs://${ipfsCID}`,
								collectModule:
									crowdfund && crowdfund.referralFee
										? {
												feeCollectModule: {
													amount: {
														currency: crowdfund.selectedCurrency,
														value: crowdfund.amount,
													},
													recipient: crowdfund['recipient'],
													referralFee: parseInt(crowdfund.referralFee),
													followerOnly: false,
												},
										  }
										: {
												freeCollectModule: {
													followerOnly: false,
												},
										  },
							},
						},
					})

					return createPostTypedData
				},
				{
					loading: 'Getting signature details...',
					success: 'Signature is ready!',
					error: 'Something went wrong! Please try again later',
				}
			)

			const {
				profileId,
				contentURI,
				collectModule,
				collectModuleInitData,
				referenceModule,
				referenceModuleInitData,
				deadline,
			} = typedData.value

			const signature = await signRequest({
				domain: omit(typedData?.domain, '__typename'),
				types: omit(typedData?.types, '__typename'),
				value: omit(typedData?.value, '__typename'),
			})

			const { v, r, s } = ethers.utils.splitSignature(signature)

			if (RELAYER_ON) {
				return toastOn(
					async () => {
						const {
							data: { broadcast: result },
						} = await broadcast({
							variables: {
								request: { id, signature },
							},
						})

						if ('reason' in result) throw result.reason
					},
					{ loading: 'Sending transaction...', success: 'Transaction sent!', error: ERROR_MESSAGE }
				)
			}

			await toastOn(
				() =>
					sendTx({
						args: {
							profileId,
							contentURI,
							collectModule,
							collectModuleInitData,
							referenceModule,
							referenceModuleInitData,
							sig: { v, r, s, deadline },
						},
					}),
				{ loading: 'Sending transaction...', success: 'Transaction sent!', error: ERROR_MESSAGE }
			)
		},
		[account?.address, activeChain?.unsupported, profile?.id, getTypedData, signRequest, broadcast, sendTx]
	)

	return {
		createPost,
		loading: dataLoading || sigLoading || txLoading || gasslessLoading,
		error: dataError || sigError || txError || gasslessError,
	}
}

export default useCreatePost
