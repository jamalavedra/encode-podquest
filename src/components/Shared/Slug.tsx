import clsx from 'clsx'
import React, { FC } from 'react'

interface Props {
	slug: string | undefined | null
	prefix?: string
	className?: string
}

const Slug: FC<Props> = ({ slug, prefix, className = '' }) => {
	return (
		<span
			className={clsx(
				'text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-pink-600 text-xs sm:text-sm',
				className
			)}
		>
			{prefix}
			{slug}
		</span>
	)
}

export default Slug
