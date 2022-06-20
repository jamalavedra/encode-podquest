import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { useRouter } from 'next/router'

function Navigation() {
	const router = useRouter()

	return (
		<nav className="flex items-center gap-x-4">
			<button
				onClick={() => router.back()}
				className="w-8 h-8 flex items-center justify-center rounded-full bg-black bg-opacity-70"
			>
				<ChevronLeftIcon className="w-5 h-5 text-white" />
			</button>
		</nav>
	)
}

export default Navigation
