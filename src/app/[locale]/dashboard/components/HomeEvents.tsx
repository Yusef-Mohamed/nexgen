import { createClientAxiosInstance } from "@/app/lib/utils";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IEvent } from "@/types";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useState } from "react";
import { IoCalendarClearOutline } from "react-icons/io5";

const EventSkeleton = () => {
  return (
    <div className="flex items-center w-full gap-8 p-3 rounded-md cardShadow sm:p-6 bg-background">
      <div className="basis-2/3">
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-full h-3 mt-2" />
        <Skeleton className="w-3/4 h-3 mt-1" />
        <div className="flex items-center gap-2 mt-2 mb-4">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-24 h-4" />
        </div>
        <Skeleton className="rounded h-9 w-28" />
      </div>
      <div className="flex justify-end basis-1/3">
        <Skeleton className="w-full rounded-md max-w-52 aspect-square" />
      </div>
    </div>
  );
};

const HomeEvents = () => {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [isGettingEvents, setIsGettingEvents] = useState(false);
  const { token } = useAuth();
  const text = useTranslations("event");

  useEffect(() => {
    const getEvents = async () => {
      try {
        setIsGettingEvents(true);
        const axiosInstance = createClientAxiosInstance();
        const res = await axiosInstance("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data.data as IEvent[]);
      } catch (e) {
        console.log(e);
      } finally {
        setIsGettingEvents(false);
      }
    };
    if (token) {
      getEvents();
    }
  }, [token]);

  return (
    <div className="space-y-3">
      {isGettingEvents ? (
        <>
          <h2>{text("upComingEvents")}</h2>
          <EventSkeleton />
          <EventSkeleton />
        </>
      ) : events.length ? (
        <>
          <h2>{text("upComingEvents")}</h2>
          {events.map((event) => (
            <div
              className="flex items-center w-full p-3 rounded-md cardShadow sm:p-6 bg-background"
              key={event._id}
            >
              <div className="basis-2/3">
                <h4 className="h2s">{event.title}</h4>
                <p className="max-sm:mt-0.5 mt-1 text-sm text-text-2 max-md:text-sm max-sm:text-xs">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 mt-2 mb-4 max-sm:mt-1 max-sm:mb-2 text-text-3">
                  <IoCalendarClearOutline className="max-sm:text-sm" />
                  <span className="text-sm max-sm:text-xs">
                    {new Date(event.date).toLocaleDateString()}
                  </span>
                </div>
                <Button
                  asChild
                  className="max-sm:h-8 max-sm:text-xs max-sm:rounded max-sm:w-fit max-sm:min-w-24 w-fit"
                >
                  <a href={event.link} target="_blank">
                    {text("applyNow")}
                  </a>
                </Button>
              </div>
              <div className="basis-1/3">
                <Image
                  src={event.image}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="object-cover w-full rounded-md aspect-square max-w-52"
                />
              </div>
            </div>
          ))}
        </>
      ) : null}
    </div>
  );
};

export default HomeEvents;
