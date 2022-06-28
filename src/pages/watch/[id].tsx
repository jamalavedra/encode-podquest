import Link from 'next/link'
import Meta from '@/components/Meta'
import { APP_NAME } from '@/lib/consts'
import { useQuery } from '@apollo/client'
import { nodeClient } from '@/lib/apollo'
import Spinner from '@/components/Spinner'
import { FC, useMemo, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import NewComment from '@/components/NewComment'
import LensAvatar from '@/components/LensAvatar'
import { linkify, shareLink } from '@/lib/utils'
import ReportModal from '@/components/ReportModal'
import FollowButton from '@/components/FollowButton'
import { formatDistanceToNowStrict } from 'date-fns'
import { GetStaticPaths, GetStaticProps } from 'next'
import GET_PUBLICATION from '@/graphql/publications/get-publication'
import LensVideoDescription from '@/components/LensVideoDescription'
import useReactToPublication from '@/hooks/lens/useReactToPublication'
import { Comment, Maybe, PaginatedPublicationResult } from '@/types/lens'
import { LensterPost } from '@/types/lenstertypes'
import GET_PUBLICATION_COMMENTS from '@/graphql/publications/get-publication-comments'
import { FlagIcon, ShareIcon, ThumbDownIcon, ThumbUpIcon } from '@heroicons/react/outline'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrent } from '@/stores/player'
import { PauseIcon, PlayIcon } from '@heroicons/react/solid'
import { getImageUrl, includesImage, normalizeUrl } from '@/lib/media'
import Collect from '@/components/Collect'
import Mirror from '@/components/Mirror'

const VideoPage: FC<{ video: Maybe<LensterPost> }> = ({ video }) => {
	const [reportOpen, setReportOpen] = useState<boolean>(false)
	const { upvotePublication, downvotePublication, loading: reactionLoading } = useReactToPublication()

	const dispatch = useDispatch()
	const { current, playing, controls } = useSelector((state: any) => state.player)

	const updateCurrent = () => {
		if (current.id === video.id) {
			if (playing) {
				controls.pause()
			} else {
				controls.play()
			}
		} else {
			dispatch(setCurrent(video))
		}
	}

	const coverImg = useMemo(() => {
		if (!video) return
		if (includesImage(video.metadata.media)) return getImageUrl(video.metadata.media)
		if (video.metadata.cover) {
			return normalizeUrl(video.metadata.cover.original.url)
		}

		return `https://avatar.tobi.sh/${video.id}.png`
	}, [video])

	const {
		data: commentData,
		loading: commentsLoading,
		refetch: refetchComments,
	} = useQuery<{ comments: PaginatedPublicationResult }>(GET_PUBLICATION_COMMENTS, {
		variables: { id: video?.id },
		skip: !video,
	})

	const comments = useMemo<Comment[] | null>(() => {
		return commentData?.comments?.items?.filter(comment => !comment.hidden) as Comment[] | null
	}, [commentData])

	return (
		<>
			<Meta
				title={video && `${video.metadata.name} | ${APP_NAME}`}
				description={video && video.metadata.description}
			/>
			<ReportModal open={reportOpen} onClose={() => setReportOpen(false)} videoId={video?.id} />
			<div className="-mt-1 bg-gray-600">
				<div className="">
					<div className="flex flex-col md:flex-row justify-between items-center py-4 px-4 md:px-16 space-y-6 md:space-y-0">
						<div className="flex items-center space-x-6">
							{coverImg ? (
								<Image
									height={176}
									width={176}
									objectFit="cover"
									className="rounded-lg"
									src={coverImg}
									alt={coverImg}
								/>
							) : (
								<Skeleton width={176} className="h-44" />
							)}
							<div className="space-y-1">
								<div className="flex items-baseline space-x-1">
									<p className="text-6xl text-white font-extrabold">
										{video?.metadata.name ?? <Skeleton width={450} />}
									</p>
								</div>
								<LensVideoDescription description={video?.metadata?.description} loading={!video} />
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className="pb-10 max-w-4xl">
				{/* <LensVideoRenderer video={video} /> */}
				<div className="mb-6 pb-4 border-b mx-6">
					<div className="mt-5 pb-2 border-b">
						<div className="flex">
							<div className="flex flex-grow flex-col md:flex-row items-start md:items-center md:justify-between space-y-2 md:space-y-0 text-gray-500">
								<div className="flex items-center md:space-x-6 justify-between md:justify-start w-full md:w-auto">
									<div className="flex items-center md:space-x-1">
										<button onClick={updateCurrent} className="hover:scale-[1.06] rounded-full p-2">
											{video && current.id === video.id && playing ? (
												<PauseIcon className="w-24 h-24 fill-green-400" />
											) : (
												<PlayIcon className="w-24 h-24 fill-green-400" />
											)}
										</button>

										<button
											onClick={() => upvotePublication(video?.id)}
											className="hover:bg-gray-100 rounded-full p-2"
										>
											{reactionLoading ? (
												<Spinner className="w-5 md:w-6 h-5 md:h-6" />
											) : (
												<ThumbUpIcon className="w-5 md:w-6 h-5 md:h-6" />
											)}
										</button>
										<span>
											{video ? (
												video.stats.totalUpvotes - video.stats.totalDownvotes
											) : (
												<Skeleton width={15} inline />
											)}
										</span>
										<button
											onClick={() => downvotePublication(video?.id)}
											className="hover:bg-gray-100 rounded-full p-2"
										>
											{reactionLoading ? (
												<Spinner className="w-5 md:w-6 h-5 md:h-6" />
											) : (
												<ThumbDownIcon className="w-5 md:w-6 h-5 md:h-6" />
											)}
										</button>
									</div>

									{video && <Mirror post={video} />}

									<div className="flex items-center md:space-x-6">
										<div className="flex items-center space-x-1">
											<button
												onClick={() => shareLink(window.location.href)}
												className="hover:bg-gray-100 rounded-full p-2"
											>
												<ShareIcon className="w-5 md:w-6 h-5 md:h-6" />
											</button>
											<span className="hidden md:inline">Share</span>
										</div>
										<div className="flex items-center space-x-1">
											<button
												onClick={() => setReportOpen(true)}
												className="hover:bg-gray-100 rounded-full p-2"
											>
												<FlagIcon className="w-5 md:w-6 h-5 md:h-6" />
											</button>
											<span className="hidden md:inline">Report</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex items-center space-x-1">
								{/* <button
									onClick={() => collectPublication(video?.id)}
									className="hover:border-white hover:border-2 border-1 border border-gray-100 rounded p-2"
								>
									{collectLoading ? (
										<Spinner className="w-5 md:w-6 h-5 md:h-6" />
									) : (
										<p className="hover:text-white text-gray-200 font-medium text-md">
											Collect NFT
										</p>
									)}
								</button> */}
								<Collect post={video} />
								{/* <span>
											{video?.stats?.totalAmountOfCollects ?? <Skeleton width={15} inline />}
										</span> */}
							</div>
						</div>
					</div>
					{video ? (
						<div className="flex items-start space-x-4 pt-4">
							<Link href={`/channel/${video?.profile?.handle}`}>
								<LensAvatar width={48} height={48} profile={video?.profile} />
							</Link>
							<div className="space-y-3 flex-1">
								<div className="flex items-center justify-between">
									<div>
										<Link
											href={`/channel/${video?.profile?.handle}`}
											className="flex items-center space-x-1"
										>
											<p className="font-medium text-white">
												{video?.profile?.name ?? video?.profile?.handle ?? (
													<Skeleton width={150} />
												)}
											</p>
										</Link>
										<p className="text-xs text-gray-500">
											{(video && `${video?.profile?.stats?.totalFollowers} subscribers`) ?? (
												<Skeleton width={80} />
											)}
										</p>
									</div>
									<div>
										<FollowButton profile={video?.profile} />
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="flex items-start space-x-4 pt-4">
							<Skeleton width={48} height={48} />
						</div>
					)}
				</div>
				{!video || commentsLoading ? (
					<div className="mt-6 flex items-center justify-center">
						<Spinner className="w-8 h-8" />
					</div>
				) : (
					<div className="mx-6">
						<div className="mt-6 mb-8">
							<div className="mb-6 text-white">
								{commentData?.comments && (
									<p>
										{commentData.comments.pageInfo.totalCount} Comment
										{commentData.comments.pageInfo.totalCount == 1 ? '' : 's'}
									</p>
								)}
							</div>
							{video && (
								<div>
									<NewComment videoId={video?.id} onChange={refetchComments} />
								</div>
							)}
						</div>
						<div className="space-y-6">
							{comments?.map(comment => (
								<div className="flex items-start space-x-4" key={comment.id}>
									<LensAvatar profile={comment.profile} width={40} height={40} />
									<div>
										<div className="flex items-center space-x-2">
											<Link
												href={`/channel/${comment.profile.handle}`}
												className="font-medium text-white text-sm flex items-center space-x-1"
											>
												<span>{comment.profile.name ?? comment.profile.handle}</span>
											</Link>
											<p className="text-xs text-gray-500">
												{formatDistanceToNowStrict(new Date(comment.createdAt))} ago
											</p>
										</div>
										<div>
											<p
												className="text-sm text-white"
												dangerouslySetInnerHTML={{ __html: linkify(comment.metadata.content) }}
											/>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
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

export const getStaticProps: GetStaticProps = async ({ params: { id } }) => {
	const {
		data: { video },
	} = await nodeClient.query<{ video: Maybe<LensterPost> }>({ query: GET_PUBLICATION, variables: { id } })

	if (!video) return { notFound: true }

	return {
		props: { video },
	}
}

export default VideoPage
