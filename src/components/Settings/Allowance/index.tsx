import { gql } from '@apollo/client'

export const ALLOWANCE_SETTINGS_QUERY = gql`
	query ApprovedModuleAllowanceAmount($request: ApprovedModuleAllowanceAmountRequest!) {
		approvedModuleAllowanceAmount(request: $request) {
			currency
			module
			allowance
			contractAddress
		}
		enabledModuleCurrencies {
			name
			symbol
			decimals
			address
		}
	}
`
