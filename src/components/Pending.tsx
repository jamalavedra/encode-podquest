import { gql, useQuery } from '@apollo/client'
import Link from 'next/link'
import React, { FC } from 'react'
import Spinner from './Spinner'

const HAS_PUBLICATION_INDEXED_QUERY = gql`
	query HasPubicationIndexed($request: PublicationQueryRequest!) {
		publication(request: $request) {
			... on Post {
				id
			}
		}
	}
`

interface Props {
	txHash: string
	indexing: string
	indexed: string
	type: string
	urlPrefix: string
}

const Pending: FC<Props> = ({ txHash, indexing, indexed, type, urlPrefix }) => {
	const { data, loading } = useQuery(HAS_PUBLICATION_INDEXED_QUERY, {
		variables: {
			request: { txHash },
		},
		pollInterval: 1000,
	})

	return (
		<div className="p-5 py-10 font-bold text-center">
			{loading || !data?.publication?.id ? (
				<div className="space-y-3">
					<Spinner className="mx-auto" />
					<div>{indexing}</div>
				</div>
			) : (
				<div className="space-y-3">
					<div className="text-[40px]">🌿</div>
					<div>{indexed}</div>
					<div className="pt-3">
						<Link href={`/${urlPrefix}/${data?.publication?.id}`} prefetch={false}>
							<a href={`/${urlPrefix}/${data?.publication?.id}`}>
								<button className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
									Go to {type}
								</button>
							</a>
						</Link>
					</div>
				</div>
			)}
		</div>
	)
}

export default Pending
