"use client";

export function Input(props) {
    return (
        <div
            className={
                props.type !== "checkbox" &&
                props.type !== "search" &&
                props.type !== "file"
                    ? "w-full border border-[--bg_3] has-[:focus]:border-primary_color h-8 rounded-md"
                    : "has-[:focus]:border-primary_color h-8 rounded-md"
            }
        >
            <input
                className={
                    props.type !== "checkbox" && props.type !== "search"
                        ? "bg-transparent flex-1 h-full p-1 outline-none rounded-md"
                        : `bg-transparent flex-1 h-full p-1 outline-none rounded-md focus:border-[1px] focus:border-primary_color ${
                              props.type === "checkbox" &&
                              "hover:cursor-pointer"
                          }`
                }
                type={props.type}
                id={props.id}
                name={props.name}
                placeholder={props.placeholder}
                onChange={props.onChange}
                accept={props.accept}
                hidden={props.hidden}
                capture={props.capture}
            />
        </div>
    );
}
