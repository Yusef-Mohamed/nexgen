"use client";
import { useAuth } from "@/components/auth-provider";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IEvent } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";

const SidebarEvents = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(false);
  const eventText = useTranslations("event");

  useEffect(() => {
    const fetchEvents = async () => {
      if (!token) {
        setLoadingEvents(false);
        return;
      }

      try {
        setLoadingEvents(true);
        const response = await axiosInstance.get("/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventsData = response.data?.data || response.data || [];
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setEvents([]);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [token]);
  console.log(events);
  return (
    <div>
      <h4 className="mb-3 sm:mb-6">{eventText("upComingEvents")}</h4>
      {loadingEvents ? (
        <div className="gap-4 grid md:grid-cols-2 xl:grid-cols-1">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border overflow-hidden border-primary/10 p-4 cardShadowSm"
            >
              {/* Event Image Skeleton */}
              <Skeleton className="w-full aspect-[28/20] rounded-lg" />

              {/* Event Details Skeleton */}
              <div className="mt-4 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
                <div className="flex items-center gap-2 mt-2">
                  <Skeleton className="size-4 rounded" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-10 w-full mt-4 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="gap-4 grid md:grid-cols-2 xl:grid-cols-1">
            {events.map((event) => {
              return (
                <div
                  key={event._id}
                  className="rounded-2xl border overflow-hidden border-primary/10  p-4 cardShadowSm"
                >
                  {/* Event Image */}
                  <div className="relative rounded-lg overflow-hidden w-full aspect-[28/20]">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="mt-4">
                    <h3>{event.title}</h3>
                    <p className="text-sm mb-2">{event.description}</p>
                    <div className="flex items-center text-sm gap-2 text-text-2">
                      <CalendarIcon className="size-4" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <Button className="w-full mt-4 rounded-full" asChild>
                      <a href={event.link} target="_blank">
                        Apply now
                      </a>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SidebarEvents;
