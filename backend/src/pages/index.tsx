import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import Router from 'next/router';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import { Grid, Box, Image, Button, Link, Text, Heading } from '../components';

export default () => {
    fetcher('/api/users/data').then((data) => {
        if (data && data.profileInitialised == false) Router.push('/get-started');
    });

    return (
        <>
            <Grid
                templateRows={[null, 'repeat(5, 1fr)']}
                templateColumns={[null, 'auto', null, 'auto 800px auto']}
                gap={6}
                // bgImage="url(/assets/london.jpg)"
                // bgSize="cover"
                // bgPos="center"
                mb={2}
                height="90vh"
            >
                <Box
                    textAlign="center"
                    gridColumn={[null, '1/2', null, '2/3']}
                    gridRow={['2/3', '3/4', null, '3/4']}
                    zIndex={10}
                >
                    <Heading fontSize={['5xl', '6xl']} fontWeight="Bold" color="gray.700">
                        FISE Parlour
                    </Heading>
                </Box>
            </Grid>
        </>
    );
};
