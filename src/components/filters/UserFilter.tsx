"use client";

import { Search, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { IUser } from "@/types";
import { useSyncExternalStore } from "react";
import UserAvatar from "../UserAvatar";
const subscribeToHydration = () => () => {};

interface UserFilterProps {
  value: string;
  onChange: (value: string) => void;
  users: IUser[];
  filteredUsers: IUser[];
  userSearchTerm: string;
  onSearchTermChange: (term: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  searchForUserLabel: string;
  myAccount?: IUser;
  meLabel: string;
}

export const UserFilter: React.FC<UserFilterProps> = ({
  value,
  onChange,
  users,
  filteredUsers,
  userSearchTerm,
  onSearchTermChange,
  isOpen,
  onOpenChange,
  label,
  searchForUserLabel,
  myAccount,
  meLabel,
}) => {
  // Find the selected user
  const isHydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );

  const selectedUser = isHydrated
    ? users.find((user) => user._id === value) || myAccount
    : undefined;

  // Determine what to display in the button
  const displayText = !isHydrated
    ? label
    : value === myAccount?._id || value === "me"
      ? meLabel
      : selectedUser
        ? selectedUser.name
        : label;

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="!h-12 w-full justify-between gap-4 rounded-xl border-2 border-transparent border-s-primary bg-background-2 px-3 shadow-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <div className="flex items-center gap-2">
            {selectedUser && selectedUser.profileImg ? (
              <UserAvatar user={selectedUser} size="md" />
            ) : null}
            <span className="truncate">{displayText}</span>
          </div>
          {isOpen ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        style={{
          width: "var(--radix-dropdown-menu-trigger-width )",
        }}
        className="w-auto overflow-hidden p-0"
      >
        <div className="space-y-1 h-64 overflow-y-auto overflow-x-hidden">
          <div className="p-2">
            <div className="relative">
              <Search className="absolute start-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchForUserLabel}
                value={userSearchTerm}
                onChange={(e) => onSearchTermChange(e.target.value)}
                className="!ps-8 !text-sm !h-10"
              />
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onChange(myAccount?._id || "me")}
            className={`flex items-center cursor-pointer gap-2 ${
              value === myAccount?._id || value === "me" ? "bg-primary/10" : ""
            }`}
          >
            <UserAvatar
              className="max-sm:w-8 max-sm:h-8"
              user={myAccount || undefined}
            />
            {meLabel}
          </DropdownMenuItem>
          {filteredUsers.map((user) => (
            <DropdownMenuItem
              key={user._id}
              onClick={() => onChange(user._id)}
              className={`flex items-center cursor-pointer gap-2 ${
                value === user._id ? "bg-primary/10" : ""
              }`}
            >
              <UserAvatar className="max-sm:w-8 max-sm:h-8" user={user} />
              {user.name}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
