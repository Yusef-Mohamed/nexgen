"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { Search } from "lucide-react";

import { CommandSelect } from "@/components/ui/command-select";
import { CountryInput } from "@/components/ui/country-input";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type InputsFormValues = {
  country: string;
  phone: string;
};

const commandOptions = [
  {
    value: "profile",
    label: "Profile settings",
    searchLabel: "Profile settings",
  },
  {
    value: "security",
    label: "Security review",
    searchLabel: "Security review",
  },
  {
    value: "billing",
    label: "Billing details",
    searchLabel: "Billing details",
  },
  {
    value: "learning",
    label: "Learning preferences",
    searchLabel: "Learning preferences",
  },
];

const statusOptions = [
  { value: "active", label: "Active" },
  { value: "review", label: "Under review" },
  { value: "draft", label: "Draft" },
];

export default function DashboardInputsPage() {
  const [textValue, setTextValue] = React.useState("Nexgen learner");
  const [passwordValue, setPasswordValue] = React.useState("password123");
  const [bioValue, setBioValue] = React.useState(
    "Building discipline through focused learning, community feedback, and consistent practice.",
  );
  const [statusValue, setStatusValue] = React.useState("active");
  const [commandValue, setCommandValue] = React.useState("profile");

  const form = useForm<InputsFormValues>({
    defaultValues: {
      country: "ps",
      phone: "+970",
    },
  });

  return (
    <main className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-primary/10 bg-clear-ground p-5 shadow-sm sm:p-6">
        <div
          aria-hidden
          className="pointer-events-none absolute -end-20 -top-24 size-56 rounded-full bg-primary/10 blur-[90px]"
        />
        <div className="relative max-w-3xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <span className="size-1.5 rounded-full bg-current" />
            Form system
          </div>
          <h1 className="h2 text-text-1">Dashboard inputs</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-2 md:text-base">
            A single review page for the shared input shell, textarea, phone,
            country, normal select, and command select primitives.
          </p>
        </div>
      </section>

      <Form {...form}>
        <section className="grid gap-5 lg:grid-cols-2">
          <InputPreview
            title="Text input"
            description="Default text entry state."
          >
            <Label htmlFor="system-text-input">Name</Label>
            <Input
              id="system-text-input"
              value={textValue}
              onChange={(event) => setTextValue(event.target.value)}
              placeholder="Enter name"
            />
          </InputPreview>

          <InputPreview
            title="Password input"
            description="Same shell, protected text."
          >
            <Label htmlFor="system-password-input">Password</Label>
            <Input
              id="system-password-input"
              type="password"
              value={passwordValue}
              onChange={(event) => setPasswordValue(event.target.value)}
              placeholder="Enter password"
            />
          </InputPreview>

          <InputPreview
            title="Textarea"
            description="Longer writing area for profile bios."
          >
            <Label htmlFor="system-textarea">Bio</Label>
            <Textarea
              id="system-textarea"
              value={bioValue}
              onChange={(event) => setBioValue(event.target.value)}
              placeholder="Write a short bio"
            />
          </InputPreview>

          <InputPreview
            title="Phone input"
            description="Flag addon with shared input shell."
          >
            <PhoneInput
              input={{
                type: "phone",
                label: "Phone",
                placeholder: "Enter phone",
                name: "phone",
              }}
              form={form}
            />
          </InputPreview>

          <InputPreview
            title="Country input"
            description="Built on the same command select base."
          >
            <CountryInput
              input={{
                type: "select",
                label: "Country",
                placeholder: "Select country",
                name: "country",
              }}
              form={form}
            />
          </InputPreview>

          <InputPreview
            title="Normal select"
            description="Radix select aligned to input shell."
          >
            <Label>Status</Label>
            <Select value={statusValue} onValueChange={setStatusValue}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </InputPreview>

          <InputPreview
            title="Command select"
            description="Input-like trigger with popover search and command items."
          >
            <Label>Command select</Label>
            <CommandSelect
              value={commandValue}
              onValueChange={setCommandValue}
              options={commandOptions.map((option) => ({
                ...option,
                leading: <Search className="size-4 text-primary" />,
              }))}
              placeholder="Select destination"
              searchPlaceholder="Search destinations..."
              emptyText="No destination found."
            />
          </InputPreview>

          <InputPreview
            title="Disabled state"
            description="Shared disabled language."
          >
            <Label htmlFor="system-disabled-input">Readonly information</Label>
            <Input id="system-disabled-input" value="Locked value" disabled />
          </InputPreview>
        </section>
      </Form>
    </main>
  );
}

function InputPreview({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-primary/10 bg-clear-ground p-4 shadow-sm sm:p-5">
      <div className="mb-4 border-b border-primary/10 pb-4">
        <h2 className="text-base font-semibold text-text-1">{title}</h2>
        <p className="mt-1 text-sm text-text-3">{description}</p>
      </div>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
