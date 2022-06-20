import { FC } from 'react'
import Spinner from '../Spinner'

interface Props {
	message: string
}

const Loader: FC<Props> = ({ message }) => {
	return (
		<div className="p-5 space-y-2 font-bold text-center">
			<Spinner />
			<div>{message}</div>
		</div>
	)
}

export default Loader
