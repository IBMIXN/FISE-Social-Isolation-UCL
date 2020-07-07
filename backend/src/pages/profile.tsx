import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Router from 'next/router';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import { Grid, Box, Image, Button, Link, Text, Heading } from '../components';
import { Spinner } from '@chakra-ui/core';

export default () => {
    const { data, error } = useSWR('/api/users/data', fetcher);
    if (data && data.profileInitialised == false) Router.push('/get-started');

    return (
        <>
            <Grid
                templateRows={[null, 'repeat(5, 1fr)']}
                templateColumns={[null, 'auto 400px auto', null, 'auto 800px auto']}
                gap={6}
                bgImage="url(/assets/london.jpg)"
                bgSize="cover"
                bgPos="center"
                mb={2}
                height="90vh"
            >
                <Box
                    textAlign="center"
                    gridColumn={[null, '1/2', null, '2/3']}
                    gridRow={['2/3', '3/4', null, '3/4']}
                    zIndex={10}
                >
                    {data ? (
                        <>
                            <Heading fontSize={['5xl', '6xl']} fontWeight="Bold" color="gray.700">
                                Welcome Back, <br /> {data.firstName}
                            </Heading>
                            <NextLink href="/logout">
                                <Button bg="transparent" border="1px">
                                    Log Out
                                </Button>
                            </NextLink>
                        </>
                    ) : (
                        <Spinner size="xl" color="white" thickness="6px" />
                    )}
                </Box>
            </Grid>
        </>
    );
};
