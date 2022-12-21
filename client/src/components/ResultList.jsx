import { useEffect, useState } from "react";
import { BackButton } from "./BackButton";
import { request } from "../hooks/Fetch";
import { convertDuration } from "../utils";

export const ResultList = ({ library, timestamp, goBack, selectMedia }) => {
    const date = new Date(timestamp);
    const [media, setMedia] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request({ url: `/api/library/${library}/${timestamp}`, callback: ({ msg, success, json }) => {
            if (success) {
                setMedia(json);
                setLoading(false);
            } else {
                alert("An error occurred fetching media: " + msg);
            }
        }});
    }, []);

    return (
        <div className="flex flex-col w-full h-screen mx-auto pb-4">
            <header className="text-purple-600 text-3xl font-bold text-center py-6 mb-1">
                Media for {date.getMonth()} {date.toLocaleString("en-US", { month: "long" })}
            </header>
            <div className="flex flex-col w-full my-6">
                {
                    !loading && media.length > 0 &&
                    media.map(({ title, thumb, duration, ratingKey }) => (
                        <div key={ratingKey} onClick={() => selectMedia(ratingKey)} className="px-4 py-2 flex
                            hover:bg-sky-600 hover:cursor-pointer">
                            <img src={thumb} className="rounded-sm w-32 h-32"/>
                            <div className="flex flex-col space-y-1 ml-4">
                                <span className="text-lg md:text-2xl font-semibold text-stone-100">{title}</span>
                                <span className="text-base md:text-lg text-stone-300 font-light">
                                    {convertDuration(duration)}</span>
                            </div>
                        </div>
                    ))
                }

                {
                    !loading && media.length < 1 &&
                        <h2 className="text-xl text-slate-50 text-center">No Media added on this date</h2>
                }

                {
                    loading && <h2 className="text-xl text-slate-50 text-center">Loading...</h2>
                }
            </div>
            <BackButton goBack={goBack} />
        </div>
    );
}