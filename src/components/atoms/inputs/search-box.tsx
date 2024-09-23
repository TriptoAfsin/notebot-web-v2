"use client";
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
  placeholder: string;
  defaultValue?: string | null;
  queryParams?: any;
};

export const SearchBox = forwardRef<HTMLButtonElement, SearchProps>(
  (
    {
      className,
      inputClassName,
      label,
      onSubmit,
      onClear,
      placeholder,
      name,
      defaultValue,
      queryParams,
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
        <label className="flex w-full items-center rounded-md bg-white dark:!bg-steel-600/20 border border-steel-200 dark:border-steel-500 focus-within:border-black dark:focus-within:border-steel-300">
          <span className="absolute top-0 left-0 flex items-center justify-center w-10 h-full transition-colors duration-200 text-steel-300 dark:text-steel-500 focus:outline-none">
            <span className="sr-only">search</span>
            <Search className="w-5 h-5 text-inherit" />
          </span>
          <input
            id={label}
            type="text"
            name={name}
            value={searchValue}
            onChange={e => setSearchValue(e.target.value)}
            aria-label={label}
            autoComplete="off"
            className={cn(
              "h-[45px] w-full appearance-none border-0 bg-transparent py-1 px-10 text-sm text-steel-700 dark:text-steel-100 outline-none ring-0 ring-transparent transition-colors duration-200 placeholder:text-sm placeholder:text-steel-400 focus:ring-0",
              inputClassName
            )}
            placeholder={placeholder}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                if (onClear) onClear();
              }}
              ref={ref}
              className={cn(
                "flex h-full w-10 absolute right-0 top-0 cursor-pointer items-center justify-center px-2 text-steel-500 transition-colors duration-200 hover:text-steel-700 dark:hover:text-steel-100 dark:focus:text-steel-100 focus:text-steel-700 focus:outline-none"
              )}
            >
              <span className="sr-only">close</span>
              <XIcon strokeWidth={1.5} size={18} />
            </button>
          )}
        </label>
      </form>
    );
  }
);

SearchBox.displayName = "SearchBox";

export default SearchBox;
