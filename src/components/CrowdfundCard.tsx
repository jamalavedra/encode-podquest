import CrowdfundShimmer from '@/components/Shared/Shimmer/CrowdfundShimmer'
import { LensterPost } from '@/types/lenstertypes'
import { UserAddIcon, UsersIcon } from '@heroicons/react/outline'
import imagekitURL from '@/lib/imagekitURL'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { FC } from 'react'

const Crowdfund = dynamic(() => import('./Crowdfund'), {
	loading: () => <CrowdfundShimmer />,
})

interface Props {
	post: any
}

const PostBody: FC<Props> = ({ post }) => {
	const postType = post?.metadata?.attributes[0]?.value

	return (
		<div className="break-words mr-2 mb-2">
			{postType === 'community' ? (
				<div className="block items-center space-y-2 space-x-0 sm:flex sm:space-y-0 sm:space-x-2 linkify">
					<span className="flex items-center space-x-1.5">
						{post?.collectedBy ? (
							<UserAddIcon className="w-4 h-4 text-brand" />
						) : (
							<UsersIcon className="w-4 h-4 text-brand" />
						)}
						{post?.collectedBy ? <span>Joined</span> : <span>Launched a new community</span>}
					</span>
					<Link href={`/communities/${post?.id}`} prefetch={false}>
						<a href={`/communities/${post?.id}`} className="flex items-center space-x-1.5 font-bold">
							<img
								src={imagekitURL(
									post?.metadata?.cover?.original?.url
										? post?.metadata?.cover?.original?.url
										: `https://avatar.tobi.sh/${post?.id}.png`,
									'avatar'
								)}
								className="bg-gray-200 rounded ring-2 ring-gray-50 w-[19px] h-[19px]"
								height={19}
								width={19}
								alt={post?.id}
							/>
							<div>{post?.metadata?.name}</div>
						</a>
					</Link>
				</div>
			) : (
				postType === 'crowdfund' && <Crowdfund fund={post} />
			)}
		</div>
	)
}

export default PostBody
