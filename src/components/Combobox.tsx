"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const spaces = [
  {
    value: "bango",
    label: "bango",
  },
  {
    value: "teamx",
    label: "TeamX",
  },
  {
    value: "district",
    label: "District",
  },
  {
    value: "spsmarketing",
    label: "SPSMarketing",
  },
];

export function Combobox({
  defaultValue,
}: {
  defaultValue: string | undefined;
}) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(defaultValue);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between text-foreground"
        >
          {value
            ? spaces.find((framework) => framework.value === value)?.label
            : "Select space..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search space..." />
          <CommandEmpty>No spaces found.</CommandEmpty>
          <CommandGroup>
            {spaces.map((space) => (
              <CommandItem
                key={space.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === space.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {space.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
