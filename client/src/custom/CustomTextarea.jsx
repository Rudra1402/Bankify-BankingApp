import React from 'react'
import classNames from 'classnames'

function CustomTextarea({
    id,
    name,
    size = "medium",
    value,
    label,
    required = false,
    disabled = false,
    onChange,
    className,
    extraClass,
    labelClass,
    containerClass,
    rows = 3,
    ...props
}) {
    return (
        <div className={classNames('flex flex-col gap-1', containerClass)}>
            <label
                htmlFor={id}
                className={classNames('text-gray-400', labelClass)}>
                {label}
            </label>
            <textarea
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                rows={rows}
                className={classNames(
                    'bg-gray-100 border border-gray-200 text-gray-700 rounded p-2 text-base resize-none',
                    size == "xsmall"
                        ? 'w-48'
                        : size == "small"
                            ? 'w-56'
                            : size == "medium"
                                ? 'w-64'
                                : size == "large"
                                    ? 'w-72'
                                    : size == "xlarge"
                                        ? 'w-80'
                                        : className,
                    extraClass
                )}
                {...props}
            />
        </div>
    )
}

export default CustomTextarea