import React from 'react'

const Title = ({ text }) => {
    return (
        <div>
            <h1 className="text-center font-semibold text-highlight mt-3 tracking-wide text-2xl">
                {text}
            </h1>
        </div>
    )
}

export default Title