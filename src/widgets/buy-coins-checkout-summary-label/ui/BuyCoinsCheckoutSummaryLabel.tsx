interface BuyCoinsCheckoutSummaryLabelProps {
	title: string;
	content: string;
	textColor: string;
}

const BuyCoinsCheckoutSummaryLabel = ({
	title,
	content,
	textColor,
}: BuyCoinsCheckoutSummaryLabelProps) => {
	return (
		<div className="flex justify-between gap-4 border-b-3 border-border-pixel py-3 uppercase leading-5 text-cream-dim">
			<span className="text-xs">{title}</span>
			<strong className={`text-right text-xs font-normal ${textColor}`}>
				{content}
			</strong>
		</div>
	);
};
export default BuyCoinsCheckoutSummaryLabel;
