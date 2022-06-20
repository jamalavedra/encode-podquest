/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
	ID: string
	String: string
	Boolean: boolean
	Int: number
	Float: number
	/** Blockchain data scalar type */
	BlockchainData: any
	/** Broadcast scalar id type */
	BroadcastId: any
	/** ChainId custom scalar type */
	ChainId: any
	/** collect module data scalar type */
	CollectModuleData: any
	/** Contract address custom scalar type */
	ContractAddress: any
	/** create handle custom scalar type */
	CreateHandle: any
	/** Cursor custom scalar type */
	Cursor: any
	/** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
	DateTime: any
	/** Ethereum address custom scalar type */
	EthereumAddress: any
	/** follow module data scalar type */
	FollowModuleData: any
	/** handle custom scalar type */
	Handle: any
	/** handle claim id custom scalar type */
	HandleClaimIdScalar: any
	/** Internal publication id custom scalar type */
	InternalPublicationId: any
	/** jwt custom scalar type */
	Jwt: any
	/** limit custom scalar type */
	LimitScalar: any
	/** Markdown scalar type */
	Markdown: any
	/** mimetype custom scalar type */
	MimeType: any
	/** Nft ownership id type */
	NftOwnershipId: any
	/** Nonce custom scalar type */
	Nonce: any
	/** ProfileId custom scalar type */
	ProfileId: any
	/** Publication id custom scalar type */
	PublicationId: any
	/** Publication url scalar type */
	PublicationUrl: any
	/** reference module data scalar type */
	ReferenceModuleData: any
	/** Query search */
	Search: any
	/** Relayer signature */
	Signature: any
	/** Sources custom scalar type */
	Sources: any
	/** timestamp date custom scalar type */
	TimestampScalar: any
	/** The tx hash */
	TxHash: any
	/** The tx id */
	TxId: any
	/** UnixTimestamp custom scalar type */
	UnixTimestamp: any
	/** Url scalar type */
	Url: any
	/** Represents NULL values */
	Void: any
}
/** The erc20 type */
export type Erc20 = {
	__typename?: 'Erc20'
	/** The erc20 address */
	address: Scalars['ContractAddress']
	/** Decimal places for the token */
	decimals: Scalars['Int']
	/** Name of the symbol */
	name: Scalars['String']
	/** Symbol for the token */
	symbol: Scalars['String']
}
