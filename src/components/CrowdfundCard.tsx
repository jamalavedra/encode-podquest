import CrowdfundShimmer from '@/components/Shared/Shimmer/CrowdfundShimmer'
import dynamic from 'next/dynamic'
import React, { FC } from 'react'

const Crowdfund = dynamic(() => import('./Crowdfund'), {
	loading: () => <CrowdfundShimmer />,
})

interface Props {
	post: any
}

const PostBody: FC<Props> = ({ post }) => {
	const postType = post?.metadata?.attributes[0]?.value

	return <div className="break-words mr-2 mb-2">{postType === 'crowdfund' && <Crowdfund fund={post} />}</div>
}

export default PostBody
