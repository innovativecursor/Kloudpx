import React from 'react'

const Title = ({ text }) => {
    return (
        <div>
            <h1 className="text-center font-semibold text-highlight mt-3 letterSpacing text-2xl">
                {text}
            </h1>
        </div>
    )
}

export default Title