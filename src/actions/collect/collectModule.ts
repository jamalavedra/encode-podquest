import { gql } from '@apollo/client'

export const CollectModuleFields = gql`
	fragment CollectModuleFields on CollectModule {
		... on FreeCollectModuleSettings {
			type
			contractAddress
			followerOnly
		}
		... on FeeCollectModuleSettings {
			type
			recipient
			referralFee
			contractAddress
			followerOnly
			amount {
				asset {
					symbol
					address
				}
				value
			}
		}
		... on LimitedFeeCollectModuleSettings {
			type
			collectLimit
			recipient
			referralFee
			contractAddress
			followerOnly
			amount {
				asset {
					symbol
					address
				}
				value
			}
		}
		... on LimitedTimedFeeCollectModuleSettings {
			type
			collectLimit
			recipient
			endTimestamp
			referralFee
			contractAddress
			followerOnly
			amount {
				asset {
					symbol
					address
				}
				value
			}
		}
		... on TimedFeeCollectModuleSettings {
			type
			recipient
			endTimestamp
			referralFee
			contractAddress
			followerOnly
			amount {
				asset {
					symbol
					address
				}
				value
			}
		}
	}
`
export const COLLECT_QUERY = gql`
	query CollectModule($request: PublicationQueryRequest!) {
		publication(request: $request) {
			... on Post {
				collectNftAddress
				collectModule {
					...CollectModuleFields
				}
			}
			... on Comment {
				collectNftAddress
				collectModule {
					...CollectModuleFields
				}
			}
			... on Mirror {
				collectNftAddress
				collectModule {
					...CollectModuleFields
				}
			}
		}
	}
	${CollectModuleFields}
`
