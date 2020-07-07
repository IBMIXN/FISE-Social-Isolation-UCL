import React, { useState, useEffect } from 'react';
import NextLink from 'next/link';
import useSWR from 'swr';
import fetcher from '../utils/fetcher';
import { Grid, Box, Image, Button, Link, Text, Heading } from '../components';
import { useForm } from 'react-hook-form';
import { FormErrorMessage, FormLabel, FormControl, Input } from '@chakra-ui/core';
import Router from 'next/router';

const redirectToHome = () => {
    setTimeout(() => {
        Router.push('/');
    }, 3000);
};

export default () => {
    const { data, error } = useSWR('/api/users/data', fetcher);
    if (data && data.profileInitialised == true) {
        redirectToHome();
    }
    const { handleSubmit, errors, register, formState } = useForm();

    function validateName(value) {
        let error;
        if (!value) {
            error = 'This field is required';
        }
        return error || true;
    }

    function validateCourse(value) {
        let error;
        if (!value) {
            error = 'Name is required';
        } else if (value !== 'Naruto') {
            error = "Jeez! You're not a fan 😱";
        }
        return error || true;
    }

    function onSubmit(values) {
        const fetchOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
        };
        fetch('/api/users/init', fetchOptions)
            .then((res) => res.json())
            .then((data) => {
                redirectToHome();
            })
            .catch((err) => {
                console.log(err);
            });
    }

    return (
        <>
            <Grid
                templateRows={[null, 'repeat(5, 1fr)']}
                templateColumns={[null, 'auto 400px auto', null, 'auto 800px auto']}
                gap={6}
                bg="gray.700"
                mb={2}
            >
                <Box gridColumn="2/3" gridRow="2/3">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <FormControl isInvalid={errors.firstName} pb={4}>
                            <FormLabel color="white" htmlFor="name">
                                What's your first name?
                            </FormLabel>
                            <Input name="firstName" placeholder="Jane" ref={register({ validate: validateName })} />

                            <FormErrorMessage>{errors.firstName && errors.firstName.message}</FormErrorMessage>
                        </FormControl>
                        <FormControl isInvalid={errors.name} pb={4}>
                            <FormLabel color="white" htmlFor="name">
                                What's your surname?
                            </FormLabel>
                            <Input name="lastName" placeholder="Doe" ref={register({ validate: validateName })} />

                            <FormErrorMessage>{errors.name && errors.name.message}</FormErrorMessage>
                        </FormControl>
                        <Button mt={4} variantColor="teal" isLoading={formState.isSubmitting} type="submit">
                            Submit
                        </Button>
                    </form>
                </Box>
            </Grid>
        </>
    );
};
