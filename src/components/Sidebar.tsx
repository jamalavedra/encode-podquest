import Link from 'next/link'
import { HomeIcon, MicrophoneIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { APP_NAME } from '@/lib/consts'
import { useRouter } from 'next/router'

function Sidebar() {
	const router = useRouter()

	return (
		<aside className="h-[92vh] w-60 pt-6 flex flex-shrink-0 flex-col bg-black">
			<div className="flex items-center justify-center mb-7 px-6">
				<Link href="/" className="tracking-tighter flex items-center space-x-2">
					<MicrophoneIcon className="w-6 h-6 text-gray-100" />
					<h1 className="text-gray-100 font-bold tracking-tighter text-2xl">{APP_NAME}</h1>
				</Link>
			</div>

			<nav className="px-2">
				<ul className="flex flex-col">
					<li>
						<Link
							href={'/'}
							className={`h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4 ${
								router.pathname === '/' && 'bg-active text-white'
							}`}
						>
							<span>
								<HomeIcon className="w-4 h-4" />
							</span>
							Home
						</Link>
					</li>
					<li>
						<Link
							href={'/quests'}
							className={`h-10 flex gap-x-4 items-center text-sm font-semibold text-link rounded hover:text-white px-4 ${
								router.pathname === '/quests' && 'bg-active text-white'
							}`}
						>
							<span>
								<QuestionMarkCircleIcon className="w-4 h-4" />
							</span>
							Quests
						</Link>
					</li>
				</ul>
			</nav>
		</aside>
	)
}

export default Sidebar
