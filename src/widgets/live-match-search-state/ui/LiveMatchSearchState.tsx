import LiveMatchSearchSpinner from "@/widgets/live-match-search-spinner/ui/LiveMatchSearchSpinner";
import SearchContainer from "@/widgets/search-container/ui/SearchContainer";
import SearchLabel from "@/widgets/search-label/ui/SearchLabel";

export default function LiveMatchSearchState() {
	return (
		<SearchContainer>
			<LiveMatchSearchSpinner />
			<SearchLabel text="Searching for opponent..." />
		</SearchContainer>
	);
}
