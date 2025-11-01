const TutorialTitle = ({ text }: { text: string }) => (
	<h2
		className="text-4xl text-red-600 text-center mb-4
			max-[480px]:text-[1.9rem] max-[400px]:text-[1.7rem]">
		{text}
	</h2>
);

export default TutorialTitle;
