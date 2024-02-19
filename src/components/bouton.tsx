import React, { FC, ButtonHTMLAttributes } from 'react';
import '../styles/bouton.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    label: string;
    color: string;
    textSize: string;
}

const Button: FC<ButtonProps> = ({ label, color, textSize, ...props }) => {
    const buttonStyle = {
        backgroundColor: color,
        borderRadius: '10px',
        fontSize: textSize,
    };

    return (
        <button style={buttonStyle} className="custom-button" {...props}>
            {label}
        </button>
    );
};

export default Button;