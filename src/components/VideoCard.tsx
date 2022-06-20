import Link from 'next/link'
import Image from 'next/image'
import { Post } from '@/types/lens'
import { FC, useMemo } from 'react'
import LensAvatar from './LensAvatar'
import Skeleton from 'react-loading-skeleton'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrent } from '@/stores/player'
import { PauseIcon, PlayIcon } from '@heroicons/react/solid'

const VideoCard: FC<{ post?: Post; expanded?: boolean }> = ({ post, expanded = false }) => {
	const dispatch = useDispatch()
	const { current, playing, controls } = useSelector((state: any) => state.player)

	const updateCurrent = () => {
		if (current.id === post.id) {
			if (playing) {
				controls.pause()
			} else {
				controls.play()
			}
		} else {
			dispatch(setCurrent(post))
		}
	}

	const coverImg = useMemo(() => {
		if (!post) return
		// if (includesImage(post.metadata.media)) return getImageUrl(post.metadata.media)
		// if (post.metadata.cover) {
		// 	return normalizeUrl(post.metadata.cover.original.url)
		// }

		return `https://avatar.tobi.sh/${post.id}.png`
	}, [post])

	const isCurrentItem = useMemo(() => {
		return current?.id === post && post.id && playing
	}, [current, post, playing])

	return (
		<div className="relative">
			<div className="flex-1 absolute space-y-2 group">
				<div className="relative">
					<Link href={`/watch/${post?.id}`}>
						{coverImg ? (
							<Image
								height={176}
								width={176}
								objectFit="cover"
								className="rounded-lg"
								src={coverImg}
								alt=""
							/>
						) : (
							<Skeleton className="!h-44 !w-44" />
						)}
					</Link>
					<button
						onClick={updateCurrent}
						className={`absolute group-hover:flex group-focus:flex bottom-2 right-2 items-center justify-center ${
							!isCurrentItem ? 'hidden' : 'flex'
						}`}
					>
						{!isCurrentItem ? (
							<PlayIcon className="w-14 h-14 fill-green-400" />
						) : (
							<PauseIcon className="text-white w-10 h-10" />
						)}
					</button>
				</div>
				<div className="space-y-2">
					<div className="flex items-start md:space-x-3">
						<Link href={`/channel/${post?.profile?.handle}`} className="hidden md:block">
							{expanded && <LensAvatar width={36} height={36} profile={post?.profile} />}
						</Link>
						<div>
							<Link href={`/watch/${post?.id}`} className="text-sm text-gray-200 font-medium">
								{post?.metadata?.name ?? <Skeleton width={120} />}
							</Link>
							<div>
								{expanded && (
									<Link
										className="text-xs text-gray-300 flex items-center space-x-1"
										href={`/channel/${post?.profile?.handle}`}
									>
										<span>{post?.profile?.handle ?? <Skeleton />}</span>
									</Link>
								)}
								<p className="font-hairline text-xs text-gray-300">
									{post ? (
										`${post?.stats?.totalAmountOfCollects} collects`
									) : (
										<Skeleton width={50} inline />
									)}{' '}
									·{' '}
									<Link href={`/watch/${post?.id}`}>
										{post ? (
											`${formatDistanceToNowStrict(new Date(post.createdAt))} ago`
										) : (
											<Skeleton width={50} inline />
										)}
									</Link>
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
export default VideoCard
