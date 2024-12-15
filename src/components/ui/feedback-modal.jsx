"use client";

import { MdError } from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";

export function FeedbackModal({ request, message }) {

    return (
        <div className={`${ request ? "bg-green-700" : "bg-red-600" } 
            rounded-md p-4 absolute top-8 left-1/2 -translate-x-1/2 border border-white flex justify-between items-center gap-4`}
        >
            { request ? (
                <div className="flex justify-between items-center gap-4">
                    <FaCheckCircle className="text-2xl text-green-400" />
                    <p className="text-white text-xl font-extrabold">
                        {message}
                    </p>
                </div>
            ) : (
                <div className="flex justify-between items-center gap-4">
                    <MdError className="text-4xl" />
                    <p className="text-white text-xl font-extrabold">
                        {message}
                    </p>
                </div>
            )}
        </div>
    );
}
