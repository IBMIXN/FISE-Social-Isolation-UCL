import { useState } from "react";
import { signin, signout, useSession } from "next-auth/client";
import { Box, Heading, Flex, Text, Button } from "@chakra-ui/core";

const MenuItems = ({ children }) => (
  <Text mt={{ base: 4, md: 0 }} mr={6} display="block">
    {children}
  </Text>
);

export const Nav = ({ props }) => {
  const [session, loading] = useSession();

  const [show, setShow] = useState(true);
  const handleToggle = () => setShow(!show);

  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding="1rem"
      px="1.5rem"
      color="white"
      w={["100%", "100%", 3 / 4]}
      {...props}
    >
      <Flex as="a" href="/" align="center" mr={5}>
        <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
          FISE Lounge
        </Heading>
      </Flex>

      {/* <Box display={["block", "none"]} onClick={handleToggle}>
        <svg
          fill="white"
          width="12px"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Menu</title>
          <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
        </svg>
      </Box> */}

      {/* <Box
        display={[show ? "block" : "none", "flex"]}
        width={["full", "auto"]}
        alignItems="center"
        flexGrow={1}
      >
        <MenuItems>Get S</MenuItems>
        <MenuItems>Examples</MenuItems>
        <MenuItems>Blog</MenuItems>
      </Box> */}

      <Box
        // display={[show ? "block" : "none", "block"]}
        mt={{ base: 4, md: 0 }}
      >
        {!session && (
          <Button
            as="a"
            href="/api/auth/signin"
            onClick={(e) => {
              e.preventDefault();
              signin();
            }}
            bg="transparent"
            border="1px"
            isLoading={loading}
          >
            Get Started
          </Button>
        )}

        {session && (
          <Button as="a" href="/dashboard" bg="transparent" border="1px">
            View Dashboard
          </Button>
        )}
      </Box>
    </Flex>
  );
};
