import React from "react";

export default function CartSkeleton(props: { count: number }) {
    return (
        <>
            {Array.from({ length: props.count }, (_, index) => (
                <div
                    key={index}
                    className="flex border rounded-lg p-4 m-2 text-black animate-pulse"
                >
                    <div className="w-1/3 bg-gray-300 h-32" />
                    <div className="w-2/3 flex flex-col justify-between p-2">
                        <div className="flex justify-between gap-4">
                            <div className="h-6 bg-gray-300 rounded w-3/4" />
                            <div className="h-6 bg-gray-300 rounded w-1/4" />
                        </div>
                        <div className="flex justify-end gap-4 items-center">
                            <div className="flex items-center border-t border-b border-gray-300">
                                <div className="bg-gray-300 h-8 w-16" />
                                <div className="bg-gray-300 h-8 w-16" />
                                <div className="bg-gray-300 h-8 w-16" />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
}
