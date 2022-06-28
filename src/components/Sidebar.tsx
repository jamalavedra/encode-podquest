import Link from 'next/link'
import { HomeIcon, MicrophoneIcon, QuestionMarkCircleIcon } from '@heroicons/react/solid'
import { APP_NAME } from '@/lib/consts'
import { useRouter } from 'next/router'

function Sidebar() {
	const router = useRouter()

	return (
		<aside className="h-[92vh] w-60 pt-6 flex flex-shrink-0 flex-col bg-black">
			<div className="flex items-center mb-7">
				<Link href="/" className="tracking-tighter flex items-center space-x-2 px-4 ">
					<MicrophoneIcon className="w-8 h-8 text-gray-100" />
					<h1 className="text-gray-100 font-bold tracking-tighter text-3xl">{APP_NAME}</h1>
				</Link>
			</div>

			<nav className="px-2">
				<ul className="flex flex-col">
					<li>
						<Link
							href={'/'}
							className={`h-12 flex gap-x-4 items-center text-md font-semibold text-link rounded hover:text-white px-4 ${
								router.pathname === '/' && 'bg-active text-white'
							}`}
						>
							<span>
								<HomeIcon className="w-5 h-5" />
							</span>
							Home
						</Link>
					</li>
					<li>
						<Link
							href={'/quests'}
							className={`h-12 flex gap-x-4 items-center text-md font-semibold text-link rounded hover:text-white px-4 ${
								router.pathname === '/quests' && 'bg-active text-white'
							}`}
						>
							<span>
								<QuestionMarkCircleIcon className="w-5 h-5" />
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
