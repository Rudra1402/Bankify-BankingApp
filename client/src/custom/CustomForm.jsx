import React from 'react'
import classNames from 'classnames'

function CustomForm({ className, children, onSubmit, ...props }) {
    return (
        <form
            onSubmit={onSubmit}
            className={classNames('flex flex-col', className)}
            {...props}
        >
            {children}
        </form>
    )
}

export default CustomForm