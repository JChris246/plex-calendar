import { useEffect, useState } from "react";
import { BackButton } from "./BackButton";
import { request } from "../hooks/Fetch";
import { convertDuration } from "../utils";

export const Details = ({ library, id, goBack }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request({ url: `/api/library/details/${library}/${id}`, callback: ({ msg, success, json }) => {
            if (success) {
                setDetails(json);
                setLoading(false);
            } else {
                alert("An error occurred fetching media details: " + msg);
            }
        }});
    }, []);

    if (loading)
        return (
            <div className="h-screen w-full flex justify-center items-center">
                <h2 className="text-xl text-slate-50 text-center">Loading...</h2>
            </div>
        )

    if (!loading)
        return (
            <div className="flex flex-row-reverse w-full h-screen">
                <div className="w-3/5 p-4 hidden md:block">
                    <img src={details.art} />
                </div>
                <div className="w-full md:w-2/5">
                    <div className="flex flex-col w-fit p-4 mx-auto">
                        <div className="flex mb-4 w-full">
                            <img src={details.thumb} className="w-full md:w-72 md:h-72"/>
                        </div>
                        <div className="flex flex-col space-y-1 ml-4">
                            <span className="text-2xl font-semibold text-stone-100">{details.title}</span>
                            <span className="text-lg text-stone-300 font-light">
                                {convertDuration(details.duration)}</span>
                        </div>
                        <div className="w-full my-4">
                            <div className="flex space-x-8">
                                <span className="text-slate-500">Video</span>
                                <span className="text-slate-100">{details.resolution} {details.fps}</span>
                            </div>
                            <div className="flex space-x-8">
                                <span className="text-slate-500">View count</span>
                                <span className="text-slate-100">{details.viewCount ?? 0}</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <a href={details.link} className="px-4 py-2 bg-yellow-600 w-fit text-slate-200 rounded-md
                                hover:text-slate-100">View on Plex</a>
                            <BackButton goBack={goBack} />
                    </div>
                    </div>
                </div>
            </div>
        );
}