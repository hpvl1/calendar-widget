import { useEffect, useState } from "react";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
} from "date-fns";
import { ru } from "date-fns/locale";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { XCircleIcon } from "@heroicons/react/solid";

import axios from "axios";

import { GET_EVENTS } from "../utils/constants/api.js";

import Tooltip from "./Tooltip/Tooltip.jsx";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];

const daysOfWeek = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];

const Calendar = () => {
  const today = startOfToday();

  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  const [events, setEvents] = useState([
    {
      desc: "Kakoeto sobytie 1 fffgfggfgfg fgfggggffbfbfb",
      endDatetime: "2024-01-24T11:51:20+03:00",
      id: 1,
      startDatetime: "2024-01-24T10:51:20+03:00",
      title: "Event1",
      type: "course",
    },
    {
      desc: "Kakoeto sobytie 2 fffgfggfgfg fgfggggffbfbfb",
      endDatetime: "2024-01-24T09:30:20+03:00",
      id: 2,
      startDatetime: "2024-01-24T09:00:20+03:00",
      title: "Event2",
      type: "course",
    },
    {
      desc: "Kakoeto sobytie 3 fffgfggfgfg fgfggggffbfbfb",
      endDatetime: "2024-01-24T10:30:20+03:00",
      id: 3,
      startDatetime: "2024-01-24T10:00:20+03:00",
      title: "Event3",
      type: "course",
    },
  ]);

  let firstDayCurrentMonth = parse(currentMonth, "LLL-yyyy", new Date());

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const response = axios.get(`${GET_EVENTS}`);

    const { data } = await response;

    // console.log(data);

    // setEvents(data.result);
  }

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function handleCloseTooltip() {
    document.querySelector(".wrap-tooltip").classList.add("hidden");
  }

  function handleOpenTooltip() {
    document.querySelector(".wrap-tooltip").classList.remove("hidden");
  }

  let selectedDayMeetings = events.filter((meeting) =>
    isSameDay(parseISO(meeting.startDatetime), selectedDay)
  );

  return (
    <div className="pt-16">
      <div className="max-w-md px-4 mx-auto sm:px-7 md:px-6">
        <div className="md:divide-x md:divide-gray-200">
          <div className="md:pr-14">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {`${format(firstDayCurrentMonth, "LLLL yyyy", {
                  locale: ru,
                })[0].toUpperCase()}` +
                  `${format(firstDayCurrentMonth, "LLLL yyyy", {
                    locale: ru,
                  }).substring(1)}`}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Предыдущий месяц</span>
                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Следующий месяц</span>
                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
              {daysOfWeek.map((day, index) => (
                <div key={index}>{day}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day - 1)],
                    "py-1.5"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDay(day);
                      handleOpenTooltip();
                    }}
                    className={classNames(
                      isEqual(day, selectedDay) && "text-white",
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "text-red-500",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-900",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-400",
                      isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-gray-900",
                      !isEqual(day, selectedDay) && "hover:bg-gray-200",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                    )}
                  >
                    <time dateTime={format(day, "dd-MM-yyyy")}>
                      {format(day, "d")}
                    </time>
                  </button>
                  <div className="w-4 h-1 mx-auto mt-0.5 flex justify-center gap-x-0.5 pl-0.5">
                    {events.some((meeting) => {
                      if (meeting.type === "adaptation")
                        return isSameDay(parseISO(meeting.startDatetime), day);
                    }) && (
                      <div className="w-2 h-2 rounded-full bg-sky-500 -ml-0.5" />
                    )}
                    {events.some((meeting) => {
                      if (meeting.type === "course")
                        return isSameDay(parseISO(meeting.startDatetime), day);
                    }) && (
                      <div className="w-2 h-2 rounded-full bg-red-500 -ml-0.5" />
                    )}
                    {events.some((meeting) => {
                      if (meeting.type === "other")
                        return isSameDay(parseISO(meeting.startDatetime), day);
                    }) && (
                      <div className="w-2 h-2 rounded-full bg-green-500 -ml-0.5" />
                    )}
                  </div>
                </div>
              ))}
              <ul className="wrap-tooltip">
                <XCircleIcon
                  className="w-5 h-5 ml-auto cursor-pointer"
                  aria-hidden="true"
                  onClick={handleCloseTooltip}
                />
                <strong>{format(selectedDay, "dd.MM.yyyy")}</strong>
                {selectedDayMeetings.length > 0 ? (
                  selectedDayMeetings.map((meeting) => (
                    <Tooltip meeting={meeting} key={meeting.id} />
                  ))
                ) : (
                  <p>Ничего не запланировано</p>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
