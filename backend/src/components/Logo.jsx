/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Box } from '@chakra-ui/core';

export const RawLogo = () => (
    <svg height="100%" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <title>fise</title>
    <defs>
        <linearGradient x1="62.5%" y1="0%" x2="37.5%" y2="100%" id="linearGradient-1">
            <stop stop-color="#2D73DF" offset="0%"></stop>
            <stop stop-color="#3165FF" offset="100%"></stop>
        </linearGradient>
        <linearGradient x1="27.7777778%" y1="0%" x2="72.2222222%" y2="100%" id="linearGradient-2">
            <stop stop-color="#0C5ED6" offset="0%"></stop>
            <stop stop-color="#0530AD" offset="100%"></stop>
        </linearGradient>
    </defs>
    <g id="fise" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <path d="M13,17 C13,19.7614237 10.7614237,22 8,22 C5.23857625,22 3,19.7614237 3,17 L3,17 L3,7 C3,4.23857625 5.23857625,2 8,2 L8,2 L13,2 Z" id="Combined-Shape" fill="url(#linearGradient-1)" transform="translate(8.000000, 12.000000) scale(-1, -1) translate(-8.000000, -12.000000) "></path>
        <path d="M18,11 C18,11.0151296 17.999944,11.030246 17.9998322,11.0453492 L18,17 L12.045,16.999 L12,17 C8.76160306,17 6.12242824,14.4344251 6.00413847,11.2249383 L6,11 L6,11 L6,5 L6.00413847,4.77506174 C6.12242824,1.56557489 8.76160306,-1 12,-1 C15.3137085,-1 18,1.6862915 18,5 L18,5 Z" id="Combined-Shape" fill="url(#linearGradient-2)" transform="translate(12.000000, 8.000000) scale(1, -1) rotate(90.000000) translate(-12.000000, -8.000000) "></path>
    </g>
</svg>
);

const StyledLogo = (props) => {
    return (
        <Box {...props}>
            <RawLogo />
        </Box>
    );
};
export default StyledLogo;
