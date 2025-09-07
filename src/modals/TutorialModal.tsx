import { useTut } from "@/services/store";

const TutorialModal = () => {
  const { showTut, setShowTut } = useTut();
  if (!showTut) return null;

  return (
    <aside className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center" role="dialog">
    <article className="bg-blue-600 p-6 w-[80%] max-w-md shadow-xl"
    role="dialog" 
    aria-modal="true" 
    aria-labelledby="tutorial-title"
    aria-describedby="tutorial-points" 
    tabIndex={-1}>
      <header>
        <h1 className="text-3xl text-red-600 text-center mb-4">
          Howto Play Notakto
        </h1>
      </header>
      <section id="tutorial-points" className="text-white text-lg leading-6 mb-6">
        <ul className="list-disc pl-6 space-y-2">
          <li>Both players use X marks</li>
          <li>Game is played on three 3x3 boards</li>
          <li>Players alternate placing Xs</li>
          <li>Any board with 3 Xs in a row becomes dead</li>
          <li>Last player to make a valid move loses</li>
          <li>Strategy: Force opponent to make final move!</li>
        </ul>
      </section>
      <button
        onClick={()=>setShowTut(false)}
        className="bg-red-600 text-white text-xl px-6 py-3 rounded text-center w-full"
      >
        Close&nbsp;&nbsp;&nbsp;Tutorial
      </button>
    </article>
  </aside>
);
};

export default TutorialModal;