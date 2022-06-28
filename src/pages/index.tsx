import Link from 'next/link'
import { useMemo } from 'react'
import { useQuery } from '@apollo/client'
import VideoCard from '@/components/VideoCard'
import { ExplorePublicationResult, Post } from '@/types/lens'
import EXPLORE_PUBLICATIONS from '@/graphql/explore/explore-publications'
import { MicrophoneIcon } from '@heroicons/react/solid'

const HomePage = () => {
	const { data, loading } = useQuery<{ explorePublications: ExplorePublicationResult }>(EXPLORE_PUBLICATIONS)

	const videos = useMemo<Post[]>(() => {
		if (loading) return [...new Array(6).keys()].map(() => null)

		return data?.explorePublications?.items?.filter(post => !post.hidden)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data?.explorePublications, loading])

	return (
		<div className={`my-6 relative mx-6 ${videos?.length == 0 ? 'flex-1 flex' : ''}`}>
			<section className="mb-8">
				<header className="flex items-center justify-between mb-6">
					<h3 className="text-4xl text-white font-semibold tracking-tight">{'Welcome'}</h3>
				</header>
				<div className="flex flex-wrap">
					{videos.map((post, i) => (
						<VideoCard key={post?.id ?? i} post={post} expanded />
					))}
				</div>
			</section>
			{videos?.length == 0 && (
				<div className="flex-1 flex flex-col items-center justify-center space-y-6">
					<div className="space-y-2">
						<MicrophoneIcon className="mx-auto h-24 w-24 text-gray-400" />
						<p className="block font-medium text-4xl text-gray-900">No podcasts yet!</p>
					</div>
					<Link className="border border-red-500 text-red-500 rounded-lg px-3 py-1" href="/upload">
						Create something awesome
					</Link>
				</div>
			)}
		</div>
	)
}

export default HomePage
