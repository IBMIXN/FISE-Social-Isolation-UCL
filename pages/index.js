import { useSession } from "next-auth/client";
// import Footer from "../components/footer";
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
} from "@chakra-ui/core";

import { Nav } from "../components/Nav";
import { Hero } from "../components/Hero";
import { Container } from "../components/Container";
import { Main } from "../components/Main";
import { DarkModeSwitch } from "../components/DarkModeSwitch";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer.js";

const IndexPage = () => {
  const [session, loading] = useSession();
  return (
    <Container>
      <Nav />
      <Hero />
      <Main mt="-30vh">
        <Heading>
          Let your loved ones connect with <strong>you</strong>, not the other
          way around.
        </Heading>

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
      <Footer as={Flex} direction="column" justify="center" align="center">
        <Flex align="center" justify="space-between" wrap="wrap" padding="1rem">
          <Text textAlign="center">
            by Adam Peace, Emil Almazov, Rikaz Rameez <br />
            In association with IBM & University College London
          </Text>
        </Flex>

        <Flex
          align="center"
          justify="space-between"
          wrap="wrap"
          padding="1rem"
          w="60vw"
          maxW="60rem"
        >
          <a href="https://ibm.com">
            <Icon
              name="ibm"
              color="grey.600"
              // color="blue.600"
              w="200px"
              h="50px"
              m="1rem"
            />
          </a>
          <a href="https://ucl.ac.uk">
            <Icon
              name="ucl"
              color="grey.600"
              // color="blue.600"
              w="200px"
              h="50px"
              m="1rem"
            />
          </a>
        </Flex>
      </Footer>
      {!loading && !session && <CTA />}
    </Container>
  );
};

export default IndexPage;
