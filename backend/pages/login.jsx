import { useForm } from "react-hook-form";

export default function LoginPage() {
    const { handleSubmit, register, errors } = useForm();
    const onSubmit = (values) => {
        console.log(values);
    };

    return (
        <div className="bg-gray-200 flex items-center justify-center h-screen">
            <div className="w-full max-w-xs">
                <form
                    className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email Address
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="email"
                            name="email"
                            placeholder="Email"
                            ref={register({
                                required: "Required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "invalid email address",
                                },
                            })}
                            required
                        />
                        <p className="text-red-500 text-xs italic">
                            {errors.email && errors.email.message}
                        </p>
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        {/* <% if (messages.error) { %>
                <input
                    className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                    type="password"
                    id="password"
                    name="password"
                    placeholder="******************"
                    required
                />
                <p className="text-red-500 text-xs italic">
                    Please enter a password.
                </p>
                <% } else { %> */}
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            type="password"
                            name="password"
                            placeholder="*********"
                            required
                            ref={register({
                                required: "Required",
                            })}
                        />
                        <p className="text-red-500 text-xs italic">
                            {errors.password && errors.password.message}
                        </p>
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="submit"
                        >
                            Sign In
                        </button>
                        <a
                            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                            href="/register"
                        >
                            Create an Account
                        </a>
                    </div>
                </form>
                <a href="#" className="text-center text-gray-500 text-xs">
                    Forgot Password?
                </a>
            </div>
        </div>
    );
}
