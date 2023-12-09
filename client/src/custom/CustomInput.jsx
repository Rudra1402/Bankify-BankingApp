import React from 'react'
import classNames from 'classnames'

function CustomInput({
    id,
    name,
    type = "text",
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
    ...props
}) {
    return (
        <div className={classNames('flex flex-col gap-1', containerClass)}>
            <label
                htmlFor={id}
                className={classNames('text-gray-400', labelClass)}>
                {label}
            </label>
            <input
                id={id}
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                required={required}
                disabled={disabled}
                className={classNames(
                    'bg-gray-100 border border-gray-200 text-gray-700 rounded p-2 text-base',
                    size == "xsmall"
                        ? 'w-48 h-10'
                        : size == "small"
                            ? 'w-56 h-10'
                            : size == "medium"
                                ? 'w-64 h-12'
                                : size == "large"
                                    ? 'w-72 h-12'
                                    : size == "xlarge"
                                        ? 'w-80 h-12'
                                        : className,
                    extraClass
                )}
                {...props}
            />
        </div>
    )
}

export default CustomInput