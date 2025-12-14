"use client";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search, XIcon } from "lucide-react";
import React, { forwardRef, useEffect, useState } from "react";

type SearchProps = {
  inputClassName?: string;
  className?: string;
  label?: string;
  name: string;
  onSubmit: (value: string) => void;
  onClear: () => void;
  onChange?: (value: string) => void;
  placeholder: string;
  defaultValue?: string | null;
  queryParams?: any;
  disabled?: boolean;
};

export const SearchBox = forwardRef<HTMLButtonElement, SearchProps>(
  (
    {
      className,
      inputClassName,
      label,
      onSubmit,
      onClear,
      onChange,
      placeholder,
      name,
      defaultValue,
      queryParams,
      disabled,
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState<string>(defaultValue ?? "");

    function handleSubmit(e: React.SyntheticEvent) {
      e.stopPropagation(); //this is necessary if it's used with another form, it triggers the other form to submit as well
      e.preventDefault();
      onSubmit(searchValue);
    }

    const param = queryParams?.[name];

    useEffect(() => {
      if (param === undefined) {
        setSearchValue("");
      } else {
        setSearchValue(param);
      }
    }, [param]);

    return (
      <form
        noValidate
        onSubmit={handleSubmit}
        className={cn("relative w-full", className)}
      >
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <span className="sr-only">search</span>
          <Search className="w-4 h-4" />
        </span>
        <Input
          id={label}
          type="text"
          name={name}
          value={searchValue}
          onChange={e => {
            const value = e.target.value;
            setSearchValue(value);
            onChange?.(value);
          }}
          aria-label={label}
          autoComplete="off"
          disabled={disabled}
          className={cn(
            "pr-10 pl-9 h-11 text-base bg-background",
            inputClassName
          )}
          placeholder={placeholder}
        />
        {searchValue && (
          <button
            type="button"
            onClick={() => {
              setSearchValue("");
              if (!disabled && onClear) onClear();
            }}
            ref={ref}
            disabled={disabled}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <span className="sr-only">clear</span>
            <XIcon strokeWidth={1.5} size={16} />
          </button>
        )}
      </form>
    );
  }
);

SearchBox.displayName = "SearchBox";

export default SearchBox;
