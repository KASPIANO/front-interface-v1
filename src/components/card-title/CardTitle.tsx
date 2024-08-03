import { Typography } from '@mui/material';
import React, { FC } from 'react';

interface CardTitleProps {
    icon?: JSX.Element;
    title: string;
    titleStyles?: React.CSSProperties;
    subTitle?: string;
    subTitleStyles?: React.CSSProperties;
    divContainerStyles?: React.CSSProperties;
    others?: JSX.Element;
    subTitleOnClick?: () => void;
}

export const CardTitle: FC<CardTitleProps> = (props) => {
    const { title, others, icon, subTitle, subTitleOnClick, subTitleStyles, divContainerStyles, titleStyles } =
        props;
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                gap: 8,
                padding: 8,
                paddingLeft: '1vw',
                alignItems: 'left',
                ...divContainerStyles,
            }}
        >
            {icon ? icon : null}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="subtitle1" style={{ ...titleStyles }}>
                    {title}
                </Typography>
                <Typography variant="body1" onClick={subTitleOnClick} style={{ ...subTitleStyles }}>
                    {subTitle}
                </Typography>
            </div>
            {others}
        </div>
    );
};

export default CardTitle;
