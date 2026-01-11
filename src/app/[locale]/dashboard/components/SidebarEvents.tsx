"use client";
import { useAuth } from "@/components/auth-provider";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { IEvent } from "@/types";
import { axiosInstance } from "@/app/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HiLocationMarker } from "react-icons/hi";
import { IoPeopleOutline } from "react-icons/io5";

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

  return (
    <div className="mt-8">
      <h4 className="mb-3 sm:mb-6">{eventText("upComingEvents")}</h4>
      {loadingEvents ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-lg border overflow-hidden border-primary/20 cardShadowSm"
            >
              <Skeleton className="w-full h-32" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-8 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <>
          <div className="space-y-4">
            {events.slice(0, 3).map((event) => {
              const eventDate = new Date(event.date);
              const day = eventDate.getDate();
              const month = eventDate.toLocaleDateString("en-US", {
                month: "short",
              });
              const time = eventDate.toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={event._id}
                  className="rounded-lg border overflow-hidden border-primary/20 cardShadowSm"
                >
                  {/* Event Image */}
                  <div className="relative w-full h-32">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Event Details */}
                  <div className="p-3">
                    <div className="flex gap-3">
                      {/* Date/Time Block */}
                      <div className="flex-shrink-0 w-16 text-center border-r border-border pr-3">
                        <div className="text-2xl font-bold text-foreground">
                          {day}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {month}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {time}
                        </div>
                      </div>

                      {/* Event Info */}
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm mb-2 line-clamp-2">
                          {event.title}
                        </h5>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                          <HiLocationMarker className="w-3 h-3" />
                          <span className="truncate">
                            {eventText("online") || "Online"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                          <IoPeopleOutline className="w-3 h-3" />
                          <span>{eventText("attendees") || "+200 Joined"}</span>
                        </div>
                        <Button
                          asChild
                          size="sm"
                          className="w-full text-xs h-8"
                        >
                          <a
                            href={event.link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {eventText("joinNow") || "Join Now"}
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {events.length > 3 && (
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link href="/dashboard/events">
                {eventText("viewAll") || "View All"}
              </Link>
            </Button>
          )}
        </>
      ) : null}
    </div>
  );
};

export default SidebarEvents;
