export default function SkeletonProductPage () {
    return (
        <div className="animate-pulse max-w-6xl px-4 py-4 mx-auto lg:py-8 md:px-6">
            <div className="flex flex-wrap -mx-4">
                <div className="w-full mb-0 md:w-1/2 md:mb-0">
                    <div className="sticky top-0 z-5 overflow-hidden">
                        <div className="relative mb-0 lg:mb-10 lg:h-2/4 bg-gray-300 rounded-lg">
                            {/* Image Skeleton */}
                        </div>
                        <div className="flex-wrap hidden md:flex">
                            {/* Thumbnails Skeleton */}
                            {Array.from({ length: 4 }).map((_, idx) => (
                                <div key={idx} className="w-1/2 p-2 sm:w-1/4">
                                    <div className="block h-24 bg-gray-300 rounded"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="w-full px-4 md:w-1/2 text-gray-50">
                    <div className="lg:pl-20">
                        <div className="md:hidden my-0 text-gray-200">
                            {/* Color Options Skeleton */}
                            <div className="flex space-x-2">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="h-6 w-12 bg-gray-300 rounded-full"
                                    ></div>
                                ))}
                            </div>
                            <div className="w-full mt-4 border-t border-gray-200"></div>
                        </div>

                        <div className="mb-0">
                            {/* Title Skeleton */}
                            <div className="h-8 w-3/4 bg-gray-300 rounded mb-6"></div>
                            {/* Price Skeleton */}
                            <div className="h-6 w-1/4 bg-gray-300 rounded mb-6"></div>
                            {/* Description Skeleton */}
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="h-4 w-full bg-gray-300 rounded"
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <div className="md:block hidden my-0 text-gray-200">
                            {/* Color Options Skeleton */}
                            <div className="flex space-x-2">
                                {Array.from({ length: 5 }).map((_, idx) => (
                                    <div
                                        key={idx}
                                        className="h-6 w-12 bg-gray-300 rounded-full"
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <div className="w-36 mb-8 ">
                            {/* Quantity Skeleton */}
                            <div className="h-10 w-full bg-gray-300 rounded mb-6"></div>
                        </div>
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Button Skeleton */}
                            <div className="h-12 w-32 bg-gray-300 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
