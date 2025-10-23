import { useTut } from "@/services/store";

const TutorialModal = () => {
	const { showTut, setShowTut } = useTut();
	if (!showTut) return null;

	return (
		<div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
			<div className="bg-blue-600 p-6 w-[80%] max-w-md shadow-xl">
				<h2 className="text-3xl text-red-600 text-center mb-4">
					How&nbsp;&nbsp;&nbsp;to&nbsp;&nbsp;&nbsp;Play Notakto
				</h2>

				<p className="text-white text-lg leading-6 mb-6 whitespace-pre-line">
					• Both players use X marks{"\n"}• Game is played on three 3x3 boards
					{"\n"}• Players alternate placing Xs{"\n"}• Any board with 3 Xs in a
					row becomes dead{"\n"}• Last player to make a valid move loses{"\n"}•
					Strategy: Force opponent to make final move!
				</p>

				<button
					onClick={() => setShowTut(false)}
					className="bg-red-600 text-white text-xl px-6 py-3 rounded text-center w-full"
				>
					Close&nbsp;&nbsp;&nbsp;Tutorial
				</button>
			</div>
		</div>
	);
};

export default TutorialModal;
