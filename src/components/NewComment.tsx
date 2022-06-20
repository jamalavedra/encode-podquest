import { v4 as uuidv4 } from 'uuid'
import { APP_ID } from '@/lib/consts'
import LensAvatar from './LensAvatar'
import { useRouter } from 'next/router'
import { MetadataVersions } from '@/types/metadata'
import { useProfile } from '@/context/ProfileContext'
import useCreateComment from '@/hooks/lens/useCreateComment'
import { classNames, trimIndentedSpaces } from '@/lib/utils'
import { FC, FocusEventHandler, FormEventHandler, useState } from 'react'

const NewComment: FC<{ videoId: number; onChange?: () => void }> = ({ videoId, onChange }) => {
	const router = useRouter()
	const { profile, isAuthenticated } = useProfile()
	const { createComment, loading } = useCreateComment(videoId)

	const [comment, setComment] = useState<string>('')
	const [inputExpanded, setInputExpanded] = useState<boolean>(false)

	const handleInputFocus: FocusEventHandler<HTMLInputElement> = () => {
		if (!isAuthenticated) return router.push('/login')

		setInputExpanded(true)
	}

	const handleFormSubmit: FormEventHandler<HTMLFormElement> = async event => {
		event.preventDefault()

		await createComment({
			metadata_id: uuidv4(),
			version: MetadataVersions.one,
			content: trimIndentedSpaces(comment),
			name: `Comment by @${profile?.handle}`,
			description: trimIndentedSpaces(comment),
			attributes: [
				{
					traitType: 'string',
					key: 'type',
					value: 'comment',
				},
			],
			media: [],
			appId: APP_ID,
		})

		onChange && onChange()

		setComment('')
		setInputExpanded(false)
	}

	const handleFormReset: FormEventHandler<HTMLFormElement> = event => {
		setComment('')
		setInputExpanded(false)
	}

	return (
		<div className="flex items-start space-x-4">
			<LensAvatar width={40} height={40} profile={profile} />
			<form onSubmit={handleFormSubmit} onReset={handleFormReset} className="w-full max-w-4xl">
				<input
					required
					type="text"
					value={comment}
					onFocus={handleInputFocus}
					placeholder="Add a comment…"
					onChange={event => setComment(event.target.value)}
					className={classNames(
						inputExpanded
							? 'border-black focus:border-black focus:border-b-2 transition-[border]'
							: 'border-gray-200 focus:border-gray-400',
						'w-full border-0 bg-gray-600 rounded focus:ring-0 border-b focus:outline-none'
					)}
				/>
				{inputExpanded && (
					<div className="mt-8 flex justify-end space-x-2">
						<button
							type="reset"
							className="px-3 py-2 uppercase text-white font-medium text-sm rounded-md transition"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={!comment && loading}
							className={classNames(
								loading
									? 'disabled:cursor-wait disabled:animate-pulse'
									: 'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
								'px-3 py-2 bg-gray-500 uppercase text-white font-medium text-sm rounded-md transition-all'
							)}
						>
							Comment
						</button>
					</div>
				)}
			</form>
		</div>
	)
}

export default NewComment
