import { useAudio } from 'react-use'
import { secondsToTime } from '@/utils/time'
import CustomRange from './CustomRange'
import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setControls, setPlaying } from '@/stores/player'
import { PauseIcon, PlayIcon } from '@heroicons/react/solid'
import { ChevronLeftIcon, ChevronRightIcon, HeartIcon, VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline'
import { getImageUrl, getVideo, includesImage, normalizeUrl } from '@/lib/media'
import Image from 'next/image'
import Link from 'next/link'
import Mirror from './Mirror'

function Player() {
	const dispatch = useDispatch()
	const { current, sidebar } = useSelector((state: any) => state.player)

	const source = getVideo(current?.metadata?.media ?? [])

	const [audio, state, controls] = useAudio({
		src: source?.url,
	})

	useEffect(() => {
		controls.play()
	}, [current])

	useEffect(() => {
		dispatch(setPlaying(state.playing))
	}, [state.playing])

	useEffect(() => {
		dispatch(setControls(controls))
	}, [])

	const coverImg = useMemo(() => {
		if (!current) return

		if (includesImage(current.metadata.media)) return getImageUrl(current.metadata.media)
		if (current.metadata.cover) {
			return normalizeUrl(current.metadata.cover.original.url)
		}

		return `https://avatar.tobi.sh/${current.id}.png`
	}, [current])

	const volumeIcon = useMemo(() => {
		if (state.volume === 0 || state.muted) return 'volumeMuted'
		return 'volumeFull'
	}, [state.volume, state.muted])

	return (
		<div className="flex border-t border-gray-600 pb-3 bg-gray-800 z-10 px-4 justify-between items-center h-full">
			<div className="min-w-[11.25rem] w-[30%]">
				{current && (
					<div className="flex items-center">
						<div className="flex items-center mr-4">
							{!sidebar && (
								<div className="w-14 h-14 mr-3 relative group flex-shrink-0">
									<Image width={56} height={56} objectFit="cover" src={coverImg} alt="" />
								</div>
							)}
							<div className="block">
								<Link href={'/watch/' + current?.id}>
									<h6 className="hover:underline text-md line-clamp-1 text-white">
										{current?.metadata?.name}
									</h6>
								</Link>
								<Link href={'/channel/' + current?.profile?.handle}>
									<a className="hover:underline text-sm text-white text-opacity-70">
										{current?.profile?.handle}
									</a>
								</Link>
							</div>
						</div>
						<div className="flex justify-between items-center">
							<Mirror post={current} />
						</div>
					</div>
				)}
			</div>
			<div className="max-w-[45.125rem] w-[40%] pt-2 flex flex-col px-4 items-center">
				<div className="flex items-center gap-x-2">
					<button className="w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
						<ChevronLeftIcon className="w-6 h-6" />
					</button>
					<button
						onClick={controls[state?.playing ? 'pause' : 'play']}
						className="w-10 h-10 flex items-center justify-center text-black rounded-full hover:scale-[1.06]"
					>
						{!state?.playing ? (
							<PlayIcon className="w-full h-full fill-white" />
						) : (
							<PauseIcon className="w-full h-full fill-white" />
						)}
					</button>
					<button className="w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100">
						<ChevronRightIcon className="w-6 h-6" />
					</button>
				</div>
				<div className="w-full flex items-center gap-x-2">
					{audio}
					<div className="text-[0.688rem] text-white text-opacity-70">{secondsToTime(state?.time)}</div>
					<CustomRange
						step={0.1}
						min={0}
						max={state?.duration || 1}
						value={state?.time}
						onChange={value => controls.seek(value)}
					/>
					<div className="text-[0.688rem] text-white text-opacity-70">{secondsToTime(state?.duration)}</div>
				</div>
			</div>
			<div className="min-w-[11.25rem] w-[30%] pr-4 flex items-center justify-end">
				<button
					onClick={controls[state.muted ? 'unmute' : 'mute']}
					className="w-8 h-8 flex items-center justify-center text-white text-opacity-70 hover:text-opacity-100"
				>
					{volumeIcon === 'volumeMuted' ? (
						<VolumeOffIcon className="w-5 h-5" />
					) : (
						<VolumeUpIcon className="w-5 h-5" />
					)}
				</button>
				<div className="w-[5.813rem] max-w-full">
					<CustomRange
						step={0.01}
						min={0}
						max={1}
						value={state.muted ? 0 : state?.volume}
						onChange={value => {
							controls.unmute()
							controls.volume(value)
						}}
					/>
				</div>
			</div>
		</div>
	)
}

export default Player
