import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { APP_ID } from '@/lib/consts'
import { useRouter } from 'next/router'
import { trimIndentedSpaces } from '@/lib/utils'
import { useProfile } from '@/context/ProfileContext'
import useCreatePost from '@/hooks/lens/useCreatePost'
import { FC, FormEventHandler, useEffect, useState } from 'react'
import { MetadataVersions, VideoMimeTypes } from '@/types/metadata'
import { MediaPickerWithThumbnails } from '@/components/MediaPicker'
import ChooseFile from '@/components/ChooseFile'
import React, { ChangeEvent } from 'react'
import uploadAssetsToIPFS from '@/lib/uploadAssetsToIPFS'
import Spinner from '@/components/Spinner'
import dynamic from 'next/dynamic'
import { defaultFeeData, defaultModuleData, FEE_DATA_TYPE, getModule } from '@/lib/getModule'
import { EnabledModule } from '@/types/lens'

const SelectCollectModule = dynamic(() => import('@/components/Shared/SelectCollectModule'), {
	loading: () => <div className="mb-1 w-5 h-5 rounded-lg shimmer" />,
})
const UploadPage: FC = () => {
	const router = useRouter()
	const { profile, isAuthenticated } = useProfile()
	const { createPost } = useCreatePost()

	useEffect(() => {
		if (isAuthenticated) return

		router.push('/login?next=create/podcast')
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isAuthenticated])

	const [title, setTitle] = useState<string>('')
	const [videoCID, setVideoCID] = useState<string>(null)
	const [videoType, setVideoType] = useState<string>(null)
	const [description, setDescription] = useState<string>('')
	const [thumbnailCID, setThumbnailCID] = useState<string>(null)
	const [thumbnail, setThumbnail] = useState<string>()
	const [uploading, setUploading] = useState<boolean>(false)
	const [thumbnailType, setThumbnailType] = useState<string>()
	const [feeData, setFeeData] = useState<FEE_DATA_TYPE>(defaultFeeData)
	const [selectedModule, setSelectedModule] = useState<EnabledModule>(defaultModuleData)
	const handleUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
		evt.preventDefault()
		setUploading(true)
		try {
			const attachment = await uploadAssetsToIPFS(evt.target.files)
			if (attachment[0]?.item) {
				setThumbnail(attachment[0].item)
				setThumbnailType(attachment[0].type)
			}
		} finally {
			setUploading(false)
		}
	}

	const uploadVideo: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()
		if (!videoCID) return toast.error('Please wait for the video to finish uploading.')
		if (!thumbnailCID) return toast.error('Please wait for the thumbnail to finish uploading.')
		console.log(getModule(selectedModule.moduleName).config, feeData)
		await createPost(
			{
				version: MetadataVersions.one,
				metadata_id: uuidv4(),
				description: trimIndentedSpaces(description),
				content: trimIndentedSpaces(description),
				external_url: null,
				image: `ipfs://${thumbnail}`,
				imageMimeType: 'image/jpeg',
				animation_url: `ipfs://${videoCID}`,

				name: title,
				attributes: [
					{
						traitType: 'string',
						key: 'type',
						value: 'post',
					},
				],
				media: [
					{ item: `ipfs://${videoCID}`, type: videoType as VideoMimeTypes },
					{ item: `ipfs://${thumbnail}`, type: 'image/jpeg' },
				],
				appId: APP_ID,
			},
			{},
			{
				collectModules: feeData.recipient
					? {
							[getModule(selectedModule.moduleName).config]: feeData,
					  }
					: getModule(selectedModule.moduleName).config,
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
				<div>
					<h3 className="text-4xl mb-5 leading-6 font-medium text-white">Upload to Podquest</h3>
					<p className="mt-2 text-md text-gray-400">
						{'Uploaded videos will be visible on your profile, search and explore pages.'}
						<br />
						{'Other Lens-powered sites may choose to show them as well.'}
					</p>
				</div>
				<form onSubmit={uploadVideo} className="space-y-8 divide-y max-w-xl divide-gray-200">
					<div className="space-y-8 divide-y divide-gray-200">
						<div>
							<div className="mt-6">
								<MediaPickerWithThumbnails
									className="h-full"
									name="Audio"
									cover
									label="Choose or drag and drop podcast file"
									maxSize={100}
									onThumbnailChange={setThumbnailCID}
									onChange={(CID, mimeType) => {
										setVideoCID(CID)
										setVideoType(mimeType)
									}}
									required
								/>
								<div className="mt-3 max-w-xl">
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
											placeholder="Badgers : podcast : MrWeebl"
											value={title}
											onChange={event => setTitle(event.target.value)}
										/>
									</div>
								</div>

								<div className="mt-3 max-w-xl">
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
									<p className="mt-2 text-sm text-gray-400">
										Will be shown below the audio, across Lens sites, and on the collected NFT.
									</p>
								</div>

								<div className="mt-3 max-w-xl">
									<label htmlFor="description" className="block text-sm font-medium text-gray-300">
										Thumbnail
									</label>
									<div className="mt-1">
										<div className="space-y-3">
											{thumbnail && (
												<img
													className="w-60 h-60 rounded-lg"
													height={240}
													width={240}
													src={'https://ipfs.infura.io/ipfs/' + thumbnail}
													alt={'https://ipfs.infura.io/ipfs/' + thumbnail}
												/>
											)}
											<div className="flex items-center space-x-3">
												<ChooseFile
													onChange={(evt: ChangeEvent<HTMLInputElement>) => handleUpload(evt)}
												/>
												{uploading && <Spinner />}
											</div>
										</div>
									</div>
								</div>
								<div className="mt-3 max-w-xl">
									<label htmlFor="description" className="block text-sm font-medium text-gray-300">
										NFT options
									</label>
									<div className="mt-1">
										<SelectCollectModule
											feeData={feeData}
											setFeeData={setFeeData}
											selectedModule={selectedModule}
											setSelectedModule={setSelectedModule}
										/>
									</div>
								</div>
							</div>
							<fieldset className="mt-4">
								<legend className="block text-sm font-medium text-gray-300">Terms</legend>
								<div className="mt-2 space-y-5">
									<label className="relative flex items-start">
										<div className="flex items-center h-5">
											<input
												id="rights"
												aria-describedby="rights-description"
												name="rights"
												type="checkbox"
												required
												className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
											/>
										</div>
										<div className="ml-3 text-sm">
											<span className="sr-only">Rights</span>
											<p id="rights-description" className="text-gray-300">
												I own the rights for the uploaded content, and allow Podquest (and other
												Lens-powered sites) to host and display it
											</p>
										</div>
									</label>
									<label className="relative flex items-start">
										<div className="flex items-center h-5">
											<input
												id="sensitive"
												aria-describedby="sensitive-description"
												name="sensitive"
												type="checkbox"
												className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
												required
											/>
										</div>
										<div className="ml-3 text-sm">
											<span className="sr-only">Sensitive</span>
											<p id="sensitive-description" className="text-gray-300">
												The uploaded content is suitable for all audiences, and does not contain
												illegal or sensitive media
											</p>
										</div>
									</label>
								</div>
							</fieldset>
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
