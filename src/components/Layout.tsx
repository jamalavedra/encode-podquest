import Meta from './Meta'
import Link from 'next/link'
import LensAvatar from './LensAvatar'
import { classNames } from '@/lib/utils'
import { Toaster } from 'react-hot-toast'
import ConnectWallet from './ConnectWallet'
import { FC, Fragment, ReactNode } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { useProfile } from '@/context/ProfileContext'
import { UploadIcon } from '@heroicons/react/outline'
import Player from './Player'
import Sidebar from './Sidebar'
import Navigation from './Navigation'

const Layout: FC<{ children: ReactNode }> = ({ children }) => {
	const { profile, isAuthenticated } = useProfile()

	return (
		<div className="min-h-screen flex flex-col overflow-hidden bg-gray-800">
			<Meta />
			<Toaster position="top-center" />

			<main className="flex-1 flex flex-col ">
				<div className="wrapper">
					<Sidebar />
					<div className="w-full">
						<nav className="py-3">
							<div className="flex items-center justify-between px-4 lg:px-6">
								<div className="flex items-center justify-center">
									<Navigation />
								</div>

								<div>
									<div className="flex items-center justify-end space-x-6">
										{isAuthenticated && (
											<>
												<Link
													href="/create/podcast"
													className="rounded-full hover:bg-gray-600 space-x-2 flex p-2 mx-2"
												>
													<UploadIcon className="w-6 h-6 text-white" />
													<span className="font-medium text-white">{'Upload Podcast'}</span>
												</Link>
											</>
										)}
										<ConnectWallet>
											{({ logout }) => (
												<Menu as="div" className="ml-3 relative">
													<div>
														<Menu.Button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
															<span className="sr-only">Open user menu</span>
															<LensAvatar profile={profile} width={32} height={32} />
														</Menu.Button>
													</div>
													<Transition
														as={Fragment}
														enter="transition ease-out duration-200"
														enterFrom="transform opacity-0 scale-95"
														enterTo="transform opacity-100 scale-100"
														leave="transition ease-in duration-75"
														leaveFrom="transform opacity-100 scale-100"
														leaveTo="transform opacity-0 scale-95"
													>
														<Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-20">
															<Menu.Item>
																{({ active }) => (
																	<Link
																		href={`/channel/${profile?.handle}`}
																		className={classNames(
																			active ? 'bg-gray-100' : '',
																			'hover:bg-gray-100 block px-4 py-2 text-sm text-gray-700 transition'
																		)}
																	>
																		Your Channel
																	</Link>
																)}
															</Menu.Item>

															<Menu.Item>
																{({ active }) => (
																	<button
																		onClick={logout}
																		className={classNames(
																			active ? 'bg-gray-100' : '',
																			'hover:bg-gray-100 block w-full text-left px-4 py-2 text-sm text-gray-700 transition'
																		)}
																	>
																		Log out
																	</button>
																)}
															</Menu.Item>
														</Menu.Items>
													</Transition>
												</Menu>
											)}
										</ConnectWallet>
									</div>
								</div>
							</div>
						</nav>
						{children}
					</div>
				</div>
			</main>
			<Player />
		</div>
	)
}

export default Layout
