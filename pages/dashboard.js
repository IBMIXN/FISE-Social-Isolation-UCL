import { getSession, signOut, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import useSWR, {mutate} from "swr";

import fetcher from "../utils/fetcher";

import {
  Box,
  Button,
  Link as ChakraLink,
  Text,
  Icon,
  Heading,
  Flex,
  Spinner,
} from "@chakra-ui/core";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/Table";

import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer.js";

const DashboardPage = () => {
  const [session, loading] = useSession();
  const router = useRouter();
  const { data, error } = useSWR("/api/user", fetcher);

  const handleDeleteUser = async () => {
    const options = {
      method: "DELETE",
    };
    await fetch(`/api/user`, options)
      .then((r) => {
        if (r.ok) {
          router.replace("/api/auth/signout")
          signOut();
          return;
        }
        throw r;
      })
      .catch(async (err) => {
        if (err instanceof Error) {
          throw err;
        }
        throw await err.json().then((rJson) => {
          console.error(`HTTP ${err.status} ${err.statusText}: ${rJson.msg}`);
          return;
        });
      });
  };

  if (typeof window !== "undefined") {
    if ((loading || !data) && !error)
      return (
        <Flex justifyContent="center" alignItems="center" height="70vh">
          <Spinner
            thickness="4px"
            speed="0.65s"
            emptyColor="gray.100"
            color="blue.500"
            size="xl"
          />
        </Flex>
      );
    if (!session) {
      router.replace("/");
      return <p>Not authed, sorry</p>;
    } else {
      return (
        <Container>
          <Nav />
          <Main>
            <Heading>Welcome to the Dashboard, {session.user.name}</Heading>
            {error && <Text color="red.400">Error: {error.message}</Text>}

            {data && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Scenes</TableHeader>
                    <TableHeader>Contacts</TableHeader>
                    <TableHeader>One-Time-Code</TableHeader>
                    <TableHeader />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.consumers &&
                    data.consumers.map((consumer, index) => (
                      <TableRow
                        bg={index % 2 === 0 ? "white" : "gray.50"}
                        key={index}
                      >
                        <TableCell>
                          <Text fontSize="sm" color="gray.600">
                            {consumer.name}
                          </Text>
                        </TableCell>
                        <TableCell>
                          <Text fontSize="sm" color="gray.500">
                            {consumer.contacts.length}
                          </Text>
                        </TableCell>
                        <TableCell>
                          <Text fontSize="sm" color="gray.500">
                            {consumer.ar_scenes.length}
                          </Text>
                        </TableCell>
                        <TableCell>
                          <Text fontSize="sm" color="gray.500">
                            {consumer.otc}
                          </Text>
                        </TableCell>
                        <TableCell textAlign="right">
                          <ChakraLink
                            href={`/dashboard/consumer/${consumer._id}`}
                            fontSize="sm"
                            fontWeight="medium"
                            color="blue.600"
                          >
                            Edit
                          </ChakraLink>
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow bg="white">
                    <TableCell>
                      <Button
                        as="a"
                        href="/dashboard/consumer/new"
                        leftIcon="add"
                        color="gray.600"
                      >
                        Add a new user
                      </Button>
                    </TableCell>
                    <TableCell />
                    <TableCell />
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableBody>
              </Table>
            )}
            <Box mt="3rem">
              <Button
                leftIcon="close"
                variantColor="red"
                onClick={handleDeleteUser}
              >
                Delete Your Account
              </Button>
            </Box>
          </Main>

          {/* <DarkModeSwitch /> */}
          <Footer />
        </Container>
      );
    }
  } else {
    return <p>You don't have access to this page</p>;
  }
};

export default DashboardPage;
