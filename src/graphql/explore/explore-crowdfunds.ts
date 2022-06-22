import { gql } from '@apollo/client'

const EXPLORE_PUBLICATIONS = gql`
	query ExplorePublications {
		explorePublications(
			request: {
				limit: 28
				publicationTypes: [POST]
				sortCriteria: TOP_MIRRORED
				sources: ["podquest Crowdfund"]
			}
		) {
			items {
				... on Post {
					...PostFields
				}
			}
			pageInfo {
				prev
				next
				totalCount
			}
		}
	}

	fragment MediaFields on Media {
		url
		width
		height
		mimeType
	}

	fragment ProfileFields on Profile {
		id
		name
		bio
		attributes {
			displayType
			traitType
			key
			value
		}
		metadata
		isDefault
		handle
		picture {
			... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			}
			... on MediaSet {
				original {
					...MediaFields
				}
				small {
					...MediaFields
				}
				medium {
					...MediaFields
				}
			}
		}
		coverPicture {
			... on NftImage {
				contractAddress
				tokenId
				uri
				verified
			}
			... on MediaSet {
				original {
					...MediaFields
				}
				small {
					...MediaFields
				}
				medium {
					...MediaFields
				}
			}
		}
		ownedBy
		dispatcher {
			address
		}
		stats {
			totalFollowers
			totalFollowing
			totalPosts
			totalComments
			totalMirrors
			totalPublications
			totalCollects
		}
		followModule {
			... on FeeFollowModuleSettings {
				type
				amount {
					asset {
						name
						symbol
						decimals
						address
					}
					value
				}
				recipient
			}
			... on ProfileFollowModuleSettings {
				type
			}
			... on RevertFollowModuleSettings {
				type
			}
		}
	}

	fragment PublicationStatsFields on PublicationStats {
		totalAmountOfMirrors
		totalAmountOfCollects
		totalAmountOfComments
	}

	fragment MetadataOutputFields on MetadataOutput {
		name
		description
		content
		media {
			original {
				...MediaFields
			}
		}
		cover {
			original {
				...MediaFields
			}
		}
		attributes {
			displayType
			traitType
			value
		}
	}

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

	fragment PostFields on Post {
		id
		profile {
			...ProfileFields
		}
		stats {
			...PublicationStatsFields
		}
		metadata {
			...MetadataOutputFields
		}
		createdAt
		collectModule {
			...CollectModuleFields
		}
		referenceModule {
			... on FollowOnlyReferenceModuleSettings {
				type
			}
		}
		appId
		hidden
		hasCollectedByMe
	}
`

export default EXPLORE_PUBLICATIONS
