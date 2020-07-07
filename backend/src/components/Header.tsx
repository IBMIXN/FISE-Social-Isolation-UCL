import React, { useState } from 'react';
import NextLink from 'next/link';
import { Box, Flex, Text, Link, Button, IconButton, PseudoBox } from '@chakra-ui/core';
import { Heading, Logo } from '.';
import { FlexProps } from '@chakra-ui/core/dist/Flex';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';

interface IHeader {}

type HeaderProps = IHeader & FlexProps;

const Header: React.FC<HeaderProps> = (props) => {
    const [show, setShow] = useState(false);
    const handleToggle = () => setShow(!show);
    const { data, error } = useSWR('/api/auth/profile', fetcher);

    const isAuthenticated = Boolean(data);

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            padding="0.8rem"
            bg="gray.600"
            color="white"
            {...props}
        >
            <NextLink href="/">
                <Flex as="a" cursor="pointer" align="center" mr={5}>
                    <Box>
                        <Logo css={{ height: '3rem' }} />
                    </Box>

                    <Heading size="lg" letterSpacing={'-.1rem'}>
                        Parlour
                    </Heading>
                </Flex>
            </NextLink>

            <PseudoBox display={['block', 'none']} onClick={handleToggle} _hover={{ cursor: 'pointer' }}>
                <svg fill="white" width="12px" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </PseudoBox>

            <Box display={[show ? 'block' : 'none', 'flex']} width={['full', 'auto']} alignItems="center" flexGrow={1}>
                {/* <NextLink href="/partners" as={`/partners`}>
                    <Link mt={[4, 0]} mr={6} display="block">
                        Partners
                    </Link>
                </NextLink> */}
            </Box>

            <Box display={[show ? 'block' : 'none', 'block']} mt={[4, 0]}>
                {isAuthenticated ? (
                    <NextLink href="/profile" as={`/profile`}>
                        <Button bg="transparent" border="1px">
                            Profile
                        </Button>
                    </NextLink>
                ) : (
                    <NextLink href="/login" as={`/login`}>
                        <Button bg="transparent" border="1px">
                            Sign In
                        </Button>
                    </NextLink>
                )}
            </Box>
        </Flex>
    );
};

export default Header;
