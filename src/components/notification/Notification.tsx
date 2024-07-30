import React from 'react';
import { Checkmark, CloseButton, NotificationContainer, NotificationText } from './Notification.s';

interface NotificationProps {
    message: string;
    onClose: () => void;
}

const NotificationComponent: React.FC<NotificationProps> = ({ message, onClose }) => (
    <NotificationContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Checkmark />
            <NotificationText>
                <strong>Wallet Connected</strong>
                <span>{message}</span>
            </NotificationText>
        </div>
        <CloseButton onClick={onClose}>×</CloseButton>
    </NotificationContainer>
);

export default NotificationComponent;
