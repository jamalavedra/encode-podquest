import Loader from '@/components/Shared/Loader'
import { Modal } from '@/components/UI/Modal'
import { LensterPost } from '@/types/lenstertypes'
import { getModule } from '@/lib/getModule'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { FC, useEffect, useState } from 'react'

const CollectModule = dynamic(() => import('./CollectModule'), {
	loading: () => <Loader message="Loading collect" />,
})

interface Props {
	post: LensterPost
}

const Collect: FC<Props> = ({ post }) => {
	const [count, setCount] = useState<number>(0)
	const [showCollectModal, setShowCollectModal] = useState<boolean>(false)
	const isFreeCollect = post?.collectModule?.__typename === 'FreeCollectModuleSettings'

	useEffect(() => {
		if (post?.mirrorOf?.stats?.totalAmountOfCollects || post?.stats?.totalAmountOfCollects) {
			setCount(
				post.__typename === 'Mirror'
					? post?.mirrorOf?.stats?.totalAmountOfCollects
					: post?.stats?.totalAmountOfCollects
			)
		}
	}, [post])

	return (
		<motion.button whileTap={{ scale: 0.9 }} onClick={() => setShowCollectModal(true)} aria-label="Collect">
			<div className="hover:border-white hover:border-2 border-1 border border-gray-100 rounded p-2">
				<p className="hover:text-white text-gray-200 font-medium text-md">Collect NFT</p>
			</div>
			<Modal
				title={isFreeCollect ? 'Free Collect' : getModule(post?.collectModule?.type).name}
				icon={<div className="text-brand"></div>}
				show={showCollectModal}
				onClose={() => setShowCollectModal(!showCollectModal)}
			>
				<CollectModule post={post} count={count} setCount={setCount} />
			</Modal>
		</motion.button>
	)
}

export default Collect
