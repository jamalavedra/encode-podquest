import { ChangeEventHandler, FC } from 'react'

interface Props {
	onChange: ChangeEventHandler<HTMLInputElement>
}

const ChooseFile: FC<Props> = ({ onChange }) => {
	return (
		<input
			className="pr-1 text-sm text-gray-700 bg-gray-500 rounded border border-gray-300 shadow-sm cursor-pointer focus:outline-none dark:border-gray-700/80 focus:border-brand-400"
			type="file"
			accept="image/*"
			onChange={onChange}
		/>
	)
}

export default ChooseFile
