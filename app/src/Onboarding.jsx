import React from "react";
import { Redirect } from "react-router-dom";
import { Formik, Field } from "formik";
import {
  Text,
  Heading,
  FormErrorMessage,
  FormLabel,
  FormControl,
  Input,
  Button,
} from "@chakra-ui/core";
import { useState } from "react";
import { useEffect } from "react";

// THIS FOR POST REQUEST
// const contact_id = "7c9c0aee-70af-44e1-b343-d177219e40a3";

// await fetch(`${process.env.REACT_APP_SERVER_URL}/api/otc/${values.otc}`, {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/x-www-form-urlencoded",
//   },
//   body: `contact_id=${contact_id}`,
// })
//   .then((r) => {
//     if (r.ok) {
//       return r.json();
//     }
//     throw r;
//   })
//   .then(({ message, data }) => {
//     // setTimeout(() => {
//     // router.replace("/dashboard");
//     console.log(message, data);
//     actions.setSubmitting(false);
//     // }, 500);
//   })
//   .catch(async (err) => {
//     actions.setSubmitting(false);
//     if (err instanceof Error) {
//       throw err;
//     }
//     throw await err.json().then((rJson) => {
//       console.error(
//         `HTTP ${err.status} ${err.statusText}: ${rJson.message}`
//       );
//       return;
//     });
//   });
// END POST REQUEST

function Onboarding() {
  const [userIsValid, setUserIsValid] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) setUserIsValid(true);
  }, []);

  console.log(process.env.REACT_APP_SERVER_URL);
  function validateOtc(value) {
    let error = "";
    if (!value) {
      error = "Required";
    }
    // else if (value.length > 15) {
    //   error = "Must be 15 characters or less";
    // } else if (!/^[a-z]+$/i.test(value)) {
    //   error = "Invalid characters, we only want your first otc!";
    // }
    return error;
  }

  const handleFormSubmit = async (values, actions) => {
    await fetch(`${process.env.REACT_APP_SERVER_URL}/api/otc/${values.otc}`)
      .then((r) => {
        if (r.ok) {
          return r.json();
        }
        throw r;
      })
      .then(({ message, data }) => {
        console.log(message, data);
        localStorage.setItem("otc", values.otc);
        localStorage.setItem("user", JSON.stringify(data));
        actions.setSubmitting(false);
        setUserIsValid(true);
        return;
      })
      .catch(async (err) => {
        actions.setSubmitting(false);
        if (err instanceof Error) {
          throw err;
        }
        throw await err.json().then((rJson) => {
          console.error(
            `HTTP ${err.status} ${err.statusText}: ${rJson.message}`
          );
          return;
        });
      });
  };

  return (
    <div>
      {userIsValid && <Redirect to="/" />}
      <Formik initialValues={{ otc: "" }} onSubmit={handleFormSubmit}>
        {({
          isSubmitting,
          getFieldProps,
          handleChange,
          handleBlur,
          handleSubmit,
          values,
        }) => (
          <form onSubmit={handleSubmit}>
            <Field name="otc" validate={validateOtc}>
              {({ field, form }) => (
                <FormControl isInvalid={form.errors.otc && form.touched.otc}>
                  <FormLabel htmlFor="otc">First otc</FormLabel>
                  <Input {...field} id="otc" placeholder="One-time-code" />
                  <FormErrorMessage>{form.errors.otc}</FormErrorMessage>
                </FormControl>
              )}
            </Field>

            <Button
              mt={4}
              variantColor="blue"
              isLoading={isSubmitting}
              type="submit"
            >
              Save Changes
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
}

export default Onboarding;
