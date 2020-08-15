import { getSession, useSession } from "next-auth/client";
import { useRouter } from "next/router";
import {
  Link as ChakraLink,
  Text,
  Code,
  Icon,
  Heading,
  List,
  ListIcon,
  ListItem,
  Flex,
  Spinner,
} from "@chakra-ui/core";

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

  if (typeof window !== "undefined" && loading)
    return (
      <Flex justifyContent="center" alignItems="center" height="70vh">
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Flex>
    );
  if (!session) {
    router.replace("/");
    return (
      <p>Not authed, sorry</p>
    )
  } else {
    return (
      <Container>
        <Nav />
        <Main>
          <Heading>Welcome to the Dashboard, {session.user.email}</Heading>
  
          <List spacing={3} my={0}>
            <ListItem>
              <ListIcon icon="check-circle" color="green.500" />
              Intuitive User Interface
            </ListItem>
            <ListItem>
              <ListIcon icon="check-circle" color="green.500" />
              Secure
            </ListItem>
            <ListItem>
              <ListIcon icon="check-circle" color="green.500" />
              Free
            </ListItem>
          </List>
        </Main>
  
        {/* <DarkModeSwitch /> */}
        <Footer as={Flex} direction="column">
          <Flex align="center" justify="space-between" wrap="wrap" padding="1rem">
            <Text>
              by Adam Peace, Emil Almazov, Rikaz Rameez | In association with IBM
              & University College London
            </Text>
          </Flex>
  
          <Flex align="center" justify="space-between" wrap="wrap" padding="1rem">
            <Icon
              name="ibm"
              color="grey.600"
              // color="blue.600"
              w="200px"
              h="50px"
            />
            <Icon
              name="ucl"
              color="grey.600"
              // color="blue.600"
              w="200px"
              h="50px"
            />
          </Flex>
        </Footer>
      </Container>
    );
  }
  
};

export default DashboardPage;
