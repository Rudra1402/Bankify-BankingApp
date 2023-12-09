import React from 'react'
import classNames from 'classnames'

function CustomButton({
    type,
    text,
    onClick,
    size = "medium",
    sizeClass,
    className,
    ...props
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={classNames(
                'bg-red-600 text-gray-200 font-medium text-lg rounded-md',
                'flex items-center justify-center',
                size == "small"
                    ? 'w-32 h-10'
                    : size == "medium"
                        ? 'w-48 h-12'
                        : size == "large"
                            ? 'w-64 h-12'
                            : sizeClass,
                className
            )}
            {...props}
        >
            {text}
        </button>
    )
}

export default CustomButton