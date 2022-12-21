import { useState } from "react";

import { Calendar } from "./components/Calendar";
import { LibrarySelection } from "./components/LibrarySelection";
import { ResultList } from "./components/ResultList";
import { Details } from "./components/Details";

function App() {
    const [chosenLibrary, setChosenLibrary] = useState(null);
    const [chosenDate, setChosenDate] = useState(null);
    const [selectedMediaId, setSelectedMediaId] = useState(null);
    const [show, setShow] = useState({ calendar: false, libraries: true, result: false, details: false });

    const showCalendar = (id) => {
        if (id)
            setChosenLibrary(id);
        setShow({ calendar: true, libraries: false, result: false, details: false });
    };

    const showLibrary = () => {
        setChosenLibrary(null);
        setShow({ calendar: false, libraries: true, result: false, details: false });
    }

    const showMediaOnDate = (datetime) => {
        if (datetime)
            setChosenDate(datetime);
        setShow({ calendar: false, libraries: false, result: true, details: false });
    }

    const showMediaDetails = (id) => {
        setSelectedMediaId(id);
        setShow({ calendar: false, libraries: false, result: false, details: true });
    }

    if (show.libraries)
        return <LibrarySelection chooseLibrary={showCalendar}/>;
    if (show.calendar)
        return <Calendar goBack={showLibrary} chooseDate={showMediaOnDate}/>
    if (show.result)
        return <ResultList timestamp={chosenDate} library={chosenLibrary} goBack={showCalendar}
            selectMedia={showMediaDetails}/>
    if (show.details)
        return <Details id={selectedMediaId} library={chosenLibrary} goBack={showMediaOnDate}/>
}

export default App