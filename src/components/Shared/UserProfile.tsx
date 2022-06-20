import { Profile } from '@/types/lens'
import getAvatar from '@/lib/getAvatar'
import clsx from 'clsx'
import Link from 'next/link'
import React, { FC, useState } from 'react'

import Markup from './Markup'
import Slug from './Slug'

interface Props {
	profile: Profile
	showBio?: boolean
	showFollow?: boolean
	followStatusLoading?: boolean
	isFollowing?: boolean
	isBig?: boolean
}

const UserProfile: FC<Props> = ({
	profile,
	showBio = false,
	showFollow = false,
	followStatusLoading = false,
	isFollowing = false,
	isBig = false,
}) => {
	const [following, setFollowing] = useState<boolean>(isFollowing)

	return (
		<div className="flex justify-between items-center">
			<Link href={`/u/${profile?.handle}`} prefetch={false}>
				<a href={`/u/${profile?.handle}`}>
					<div className="flex items-center space-x-3">
						<img
							src={getAvatar(profile)}
							loading="lazy"
							className={clsx(isBig ? 'w-14 h-14' : 'w-10 h-10', 'bg-gray-200 rounded-full border')}
							height={isBig ? 56 : 40}
							width={isBig ? 56 : 40}
							alt={profile?.handle}
						/>
						<div>
							<div className="flex gap-1 items-center max-w-sm truncate">
								<div className={clsx(isBig ? 'font-bold' : 'text-md')}>
									{profile?.name ?? profile?.handle}
								</div>
							</div>
							<Slug className="text-sm" slug={profile?.handle} prefix="@" />
							{showBio && profile?.bio && (
								<div className={clsx(isBig ? 'text-base' : 'text-sm', 'mt-2', 'linkify leading-6')}>
									<Markup>{profile?.bio}</Markup>
								</div>
							)}
						</div>
					</div>
				</a>
			</Link>
		</div>
	)
}

export default UserProfile
