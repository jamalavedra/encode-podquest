import { FC, useMemo } from 'react'
import Meta from '@/components/Meta'
import { APP_NAME } from '@/lib/consts'
import { nodeClient } from '@/lib/apollo'
import { useQuery } from '@apollo/client'
import Skeleton from 'react-loading-skeleton'
import VideoCard from '@/components/VideoCard'
import LensAvatar from '@/components/LensAvatar'
import FollowButton from '@/components/FollowButton'
import { GetStaticPaths, GetStaticProps } from 'next'
import GET_PROFILE from '@/graphql/profiles/get-profile'
import { Post, Profile, Query, SingleProfileQueryRequest } from '@/types/lens'
import GET_USER_PUBLICATIONS from '@/graphql/publications/get-user-publications'

const ChannelPage: FC<{ profile: Profile }> = ({ profile }) => {
	const { data: videoData, loading: loadingVideos } = useQuery<{ videos: Query['publications'] }>(
		GET_USER_PUBLICATIONS,
		{
			variables: { profileId: profile?.id },
			skip: !profile?.id,
		}
	)

	const videos = useMemo<Post[]>(() => {
		if (loadingVideos || !profile) return [...new Array(12).keys()].map(() => null)

		return videoData?.videos?.items?.filter(post => !post.hidden)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [videoData?.videos, loadingVideos])

	return (
		<>
			<Meta title={profile && `${profile?.name ?? profile?.handle}'s channel | ${APP_NAME}`} />

			<div className="-mt-1 bg-gray-600">
				<div className="">
					<div className="flex flex-col md:flex-row justify-between items-center py-4 px-4 md:px-16 space-y-6 md:space-y-0">
						<div className="flex items-center space-x-6">
							<LensAvatar profile={profile} className="rounded-full bg-cover" width={200} height={200} />
							<div className="space-y-1">
								<div className="flex items-baseline space-x-1">
									<p className="text-6xl text-white font-extrabold">
										{profile?.name ?? profile?.handle ?? <Skeleton />}
									</p>
								</div>
								<p className="text-xs md:text-sm max-w-prose text-gray-200">
									{profile ? profile.bio : <Skeleton count={2} width={230} />}
								</p>
							</div>
						</div>
						<div className="text-gray-600 flex flex-row-reverse md:flex-col justify-start w-full md:w-auto">
							<FollowButton profile={profile} />
							<p className="mt-2 font-hairline text-sm text-center md:text-right mr-2 md:mr-0">
								{profile ? `${profile?.stats?.totalFollowers} subscribers` : <Skeleton width={80} />}
							</p>
						</div>
					</div>
				</div>
			</div>
			<div className="px-4 md:px-16 flex pb-10">
				{videos?.length > 0 ? (
					<div className="lg:mx-16 w-full">
						<h3 className="py-6 text-white font-bold text-2xl">Uploads</h3>
						<div className="grid grid-cols-6 gap-6">
							{videos.map((video, i) => (
								<VideoCard key={video?.id ?? i} post={video} />
							))}
						</div>
					</div>
				) : (
					<p className="text-sm text-center mt-6 w-full">This channel doesn&apos;t have any content.</p>
				)}
			</div>
		</>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: true,
	}
}

export const getStaticProps: GetStaticProps = async ({ params: { handle } }) => {
	const {
		data: { profile },
	} = await nodeClient.query<{ profile: Query['profile'] }, SingleProfileQueryRequest>({
		query: GET_PROFILE,
		variables: { handle },
	})

	if (!profile) return { notFound: true }

	return {
		props: { profile },
	}
}

export default ChannelPage
