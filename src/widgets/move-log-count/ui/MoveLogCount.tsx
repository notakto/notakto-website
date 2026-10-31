interface MoveLogCountProps {
	count: number;
}

export default function MoveLogCount({ count }: MoveLogCountProps) {
	return <span className=" text-[8px] text-gray-500">{count}</span>;
}
