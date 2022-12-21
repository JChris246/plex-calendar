import { useEffect, useState } from "react";
import { BackButton } from "./BackButton";

import "./Calendar.css"

// storing full name of all months in array
const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October",
    "November", "December", ];

export const Calendar = ({ goBack, chooseDate }) => {
    const [selectedDate, setSelectedDate] = useState(new Date()); // init with the current live date
    const [currentCalendarView, setCurrentCalendarView] =
        useState(months[selectedDate.getMonth()] + " " + selectedDate.getFullYear());

    useEffect(() =>
        setCurrentCalendarView(months[selectedDate.getMonth()] + " " + selectedDate.getFullYear()), [selectedDate]);

    const renderCalendar = ({ curMonth, curYear }) => {
        const firstDayOfMonth = new Date(curYear, curMonth, 1).getDay(); // getting first day of month
        const lastDateOfMonth = new Date(curYear, curMonth + 1, 0).getDate(); // getting last date of month
        const lastDayOfMonth = new Date(curYear, curMonth, lastDateOfMonth).getDay(); // getting last day of month
        const lastDateOfLastMonth = new Date(curYear, curMonth, 0).getDate(); // getting last date of previous month

        let liTags = [];

        // creating li of previous month last days
        for (let i = firstDayOfMonth; i > 0; i--) {
            liTags.push(<li className="inactive" key={liTags.length}>{lastDateOfLastMonth - i + 1}</li>);
        }

        for (let i = 1; i <= lastDateOfMonth; i++) {
            // creating li of all days of current month
            // adding active class to li if the current day, month, and year matched
            const currentDate = new Date();
            let isToday =
                i === currentDate.getDate() && curMonth === currentDate.getMonth() && curYear === currentDate.getFullYear()
                    ? "active"
                    : "";
            const dateStamp = new Date(curYear, curMonth, i).getTime();
            liTags.push(<li className={isToday} key={liTags.length} onClick={() => chooseDate(dateStamp) }>{i}</li>);
        }

        for (let i = lastDayOfMonth; i < 6; i++) {
            // creating li of next month first days
            liTags.push(<li className="inactive" key={liTags.length}>{i - lastDayOfMonth + 1}</li>);
        }

        return liTags;
    };

    const switchMonth = (increment) => {
        // if clicked icon is previous icon then decrement current month by 1 else increment it by 1
        const newMonth = selectedDate.getMonth() + increment;
        const newYear = selectedDate.getFullYear();

        setSelectedDate(new Date(newYear, newMonth));
    }

    return (
        <div className="flex flex-col md:items-center md:justify-center h-screen space-y-2">
            <div className="wrapper dark-mode">
                <header>
                    <p className="current-date">{currentCalendarView}</p>
                    <div className="icons">
                        <span id="prev" className="material-symbols-rounded" onClick={() => switchMonth(-1)}>chevron_left</span>
                        <span id="next" className="material-symbols-rounded" onClick={() => switchMonth(1)}>chevron_right</span>
                    </div>
                </header>
                <div className="calendar">
                    <ul className="weeks">
                        <li>Sun</li>
                        <li>Mon</li>
                        <li>Tue</li>
                        <li>Wed</li>
                        <li>Thu</li>
                        <li>Fri</li>
                        <li>Sat</li>
                    </ul>
                    <ul className="days">{
                        renderCalendar({ curMonth: selectedDate.getMonth(), curYear: selectedDate.getFullYear() })
                    }</ul>
                </div>
            </div>
            <BackButton goBack={goBack} />
        </div>
    );
}