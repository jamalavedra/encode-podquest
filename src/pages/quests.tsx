import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import { ExplorePublicationResult, Post } from '@/types/lens'
import EXPLORE_CROWDFUNDS from '@/graphql/explore/explore-crowdfunds'
import { PlusIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import CrowdfundCard from '@/components/CrowdfundCard'
const QuestPage = () => {
	const { data, loading } = useQuery<{ explorePublications: ExplorePublicationResult }>(EXPLORE_CROWDFUNDS)

	const crowdfunds = useMemo<Post[]>(() => {
		if (loading) return [...new Array(16).keys()].map(() => null)
		return data?.explorePublications?.items?.filter(post => !post.hidden)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.explorePublications, loading])

	return (
		<div className="max-h-[85vh] overflow-x-auto">
			<div className={`my-6 relative mx-6 ${crowdfunds?.length == 0 ? 'flex-1 flex' : ''}`}>
				<section className="mb-8 w-full">
					<header className="flex items-center mb-6">
						<h3 className="text-4xl text-white font-semibold tracking-tight">{'Quests'}</h3>
					</header>
					<div className="relative mb-10">
						<Link
							href="/create/quest"
							className="py-2 flex items-center group text-sm text-link font-semibold hover:text-white"
						>
							<span className="w-6 h-6 flex items-center justify-center mr-2 bg-white bg-opacity-60 group-hover:bg-opacity-100 rounded-sm text-black">
								<PlusIcon />
							</span>
							New Quest
						</Link>
					</div>
					<div className="grid grid-cols-3 gap-6">
						{crowdfunds.map((post, i) => (
							<CrowdfundCard key={post?.id ?? i} post={post} />
						))}
					</div>
				</section>
				{crowdfunds?.length == 0 && (
					<div className="flex-1 flex flex-col items-center justify-center space-y-6">
						<Link className="border border-red-500 text-red-500 rounded-lg px-3 py-1" href="/upload">
							Create crowdfunds
						</Link>
					</div>
				)}
			</div>
		</div>
	)
}

export default QuestPage
