import { useEffect, useState } from "react";
import { request } from "../hooks/Fetch";

export const LibrarySelection = ({ chooseLibrary }) => {
    const [libraries, setLibraries] = useState([]);

    useEffect(() => {
        request({ url: "/api/library", callback: ({ msg, success, json }) => {
            if (success) {
                setLibraries(json);
            } else {
                alert("An error occurred fetching libraries: " + msg);
            }
        }});
    }, []);

    return (
        <div className="flex flex-col w-full h-screen overflow-y-hidden">
            <header className="bg-purple-600 text-3xl text-slate-50 text-center py-4 mb-4">
                Choose a Library
            </header>
            <div className="flex flex-col w-full overflow-y-auto">
                {
                    libraries.map(({ title, key }) => (
                        <div key={key} onClick={() => chooseLibrary(key)} className="bg-slate-800 odd:text-slate-50
                            border-slate-100 mb-1 hover:bg-sky-600 hover:text-slate-100 hover:cursor-pointer
                            even:text-purple-500 text-lg px-4 py-2">
                            { title }
                        </div>
                    ))
                }
            </div>
        </div>
    );
}