import React from 'react'
import { FmlxButton } from 'fmlxcomponent'

function RMButton({ onClick, customStyle = null, Icon = null, children, disabled = false, className=''}) {
    return (
        <FmlxButton
            style={{
                background: '#008F40',
                color: '#ffffff',
                display: 'flex',
                //justifyContent: 'flex-end',
                height: '2rem',
                textTransform: 'uppercase',
                minHeight: '2rem',
                maxHeight: '2rem',
                fontSize: '1rem',
                borderRadius: '0.375rem',
                width: '4.125rem',
                ...customStyle
            }}
            className={className}
            onClick={onClick}
            disabled={disabled}
        >

            {Icon}
            {children}
        </FmlxButton>
    )
}

export default RMButton
