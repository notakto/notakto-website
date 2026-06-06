interface MoveLogCountProps {
	count: number;
}

export default function MoveLogCount({ count }: MoveLogCountProps) {
	return <span className="font-pixel text-[8px] text-muted">{count}</span>;
}
