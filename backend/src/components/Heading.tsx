import styled from '@emotion/styled';
import { Heading as CoreHeading } from '@chakra-ui/core';
import type { HeadingProps } from '@chakra-ui/core/dist/Heading';

const Underline = styled.span({
    background: `linear-gradient( 
        0deg,rgba(255,0,255,0) 0%, 
        rgba(255,0,255,0) 15%, 
        #0530ad 15%, 
        #0530ad 35%, 
        rgba(255,0,255,0) 35% 
        )`,
});

const Heading: React.FC<HeadingProps> = (props, { children }) => (
    <CoreHeading {...props}>
        <Underline>{props.children}</Underline>
    </CoreHeading>
);

export default Heading;
