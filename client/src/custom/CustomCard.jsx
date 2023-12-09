import React from 'react'
import classNames from 'classnames'

function CustomCard({ className = "", children, ...props }) {
    return (
        <div className={classNames(className)} {...props}>
            {children}
        </div>
    )
}

export default CustomCard