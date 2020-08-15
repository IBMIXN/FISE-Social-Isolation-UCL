import { Flex, Stack, Icon, Text } from "@chakra-ui/core";

export const Footer = (props) => (
  <Flex
    as="footer"
    py="8rem"
    direction="column"
    justify="center"
    align="center"
    {...props}
  >
    <Stack p="1rem">
      <Text textAlign="center">by Adam Peace, Emil Almazov, Rikaz Rameez</Text>
      <Text textAlign="center">
        In association with IBM, NHS & University College London
      </Text>
      <Text textAlign="center" color="gray.300">
        Supervised by John MacNamara, Dean Mohammedally
      </Text>
    </Stack>

    <Stack isInline>
      <a href="https://ibm.com">
        <Icon
          name="ibm"
          color="grey.300"
          // color="blue.600"
          w="200px"
          h="50px"
          m="1rem"
        />
      </a>
      <a href="https://nhs.uk">
        <Icon
          name="nhs"
          color="gray.400"
          // color="blue.600"
          w="200px"
          h="50px"
          m="1rem"
        />
      </a>
      <a href="https://ucl.ac.uk">
        <Icon
          name="ucl"
          color="gray.400"
          // color="blue.600"
          w="200px"
          h="50px"
          m="1rem"
        />
      </a>
    </Stack>
  </Flex>
);
