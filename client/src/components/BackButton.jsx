export const BackButton = ({ goBack }) => {
    return (
        <button onClick={() => { if (goBack) goBack()}} className="flex items-center w-fit bg-red-500 px-2 py-2
            rounded-md md:ml-5 ml-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-xl mx-2">Back</span>
        </button>
    )
}