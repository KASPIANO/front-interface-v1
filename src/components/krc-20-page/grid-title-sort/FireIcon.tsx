import { FaFire } from 'react-icons/fa';
import { IconContext } from 'react-icons';
import styled from 'styled-components';

const fireColors = {
    primary: '#FF6600',
    secondary: '#FF9933',
    tertiary: '#FFCC00',
    glow: '#FF3300',
};

interface FireIconWrapperProps {
    selected: boolean;
}

const FireIconWrapper = styled.div<FireIconWrapperProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 5px;
    border-radius: 50%;
    cursor: pointer;
    background-color: ${(props) => (props.selected ? `${fireColors.secondary}40` : 'transparent')};
    transition: all 0.3s ease;

    &:hover {
        background-color: ${fireColors.secondary}20;
    }

    .fire-icon {
        font-size: 1.3rem;
        color: ${(props) => (props.selected ? fireColors.glow : fireColors.primary)};
        filter: drop-shadow(0 0 2px ${fireColors.glow});
        transition: all 0.3s ease;

        &:hover {
            color: ${fireColors.secondary};
            filter: drop-shadow(0 0 4px ${fireColors.glow});
        }
    }
`;
interface FireIconProps {
    selected: boolean;
}
export const FireIcon: React.FC<FireIconProps> = (props) => (
    <FireIconWrapper selected={props.selected}>
        <IconContext.Provider value={{ className: 'fire-icon' }}>
            <FaFire />
        </IconContext.Provider>
    </FireIconWrapper>
);
