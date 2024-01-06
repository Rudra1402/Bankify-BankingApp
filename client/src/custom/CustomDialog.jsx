import React from 'react'
import CustomButton from './CustomButton'
import CustomCard from './CustomCard'

function CustomDialog({
    title = "",
    message = "",
    noTitle = "",
    yesTitle = "",
    onNo,
    onYes
}) {
    return (
        <CustomCard
            className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-h-[33%] h-fit w-11/12 md:w-2/3 lg:w-1/3 rounded-md shadow-md flex flex-col gap-y-2'
        >
            <div className='w-full p-1 text-center'>{title}</div>
            <div className='p-2 text-center flex-1'>{message}</div>
            <div className='w-full p-1 flex items-center justify-between'>
                <CustomButton
                    text={noTitle}
                    onClick={onNo}
                />
                <CustomButton
                    text={yesTitle}
                    onClick={onYes}
                    className='!bg-blue-600'
                />
            </div>
        </CustomCard>
    )
}

export default CustomDialog