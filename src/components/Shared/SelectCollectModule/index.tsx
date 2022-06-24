import { Modal } from '@/components/UI/Modal'
import { EnabledModule } from '@/types/lens'
import { CashIcon } from '@heroicons/react/outline'
import { FEE_DATA_TYPE } from '@/lib/getModule'
import { Dispatch, FC, useState } from 'react'

import Modules from './Modules'

interface Props {
	feeData: FEE_DATA_TYPE
	setFeeData: Dispatch<FEE_DATA_TYPE>
	setSelectedModule: Dispatch<EnabledModule>
	selectedModule: EnabledModule
}

const SelectCollectModule: FC<Props> = ({ feeData, setFeeData, setSelectedModule, selectedModule }) => {
	const [showModal, setShowModal] = useState<boolean>(false)

	return (
		<>
			<button
				className="p-2 border-gray-200 border rounded items-center flex mt-2 text-gray-200 font-medium	"
				type="button"
				onClick={() => {
					setShowModal(!showModal)
				}}
				aria-label="Choose Collect Module"
			>
				<CashIcon className="w-5 h-5 mr-2" />
				Set podcast minting as NFT
			</button>
			<Modal
				title="Set podcast minting as NFT"
				icon={<CashIcon className="w-5 h-5 text-white" />}
				show={showModal}
				onClose={() => setShowModal(!showModal)}
			>
				<Modules
					feeData={feeData}
					setFeeData={setFeeData}
					selectedModule={selectedModule}
					setSelectedModule={setSelectedModule}
					setShowModal={setShowModal}
				/>
			</Modal>
		</>
	)
}

export default SelectCollectModule
