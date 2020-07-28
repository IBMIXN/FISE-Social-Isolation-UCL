import Link from "next/link";

const links = [{ href: "/login", label: "Dashboard" }];

export default function Nav() {
    return (
        // <nav>
        //     <ul className="flex justify-between items-center p-8">
        //         <li>
        //             <Link href="/">
        //                 <a className="text-blue-500 no-underline">Home</a>
        //             </Link>
        //         </li>
        //         <ul className="flex justify-between items-center space-x-4">
        //             {links.map(({ href, label }) => (
        //                 <li key={`${href}${label}`}>
        //                     <a href={href} className="btn-blue no-underline">
        //                         {label}
        //                     </a>
        //                 </li>
        //             ))}
        //         </ul>
        //     </ul>
        // </nav>
        <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
            <a
                href="/"
                className="flex items-center flex-shrink-0 text-white mr-6"
            >
                <svg
                    className="fill-current h-8 w-8 mr-2"
                    width="54"
                    height="54"
                    width="18px"
                    height="20px"
                    viewBox="0 0 18 20"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient
                            x1="62.5%"
                            y1="0%"
                            x2="37.5%"
                            y2="100%"
                            id="linearGradient-1"
                        >
                            <stop stopColor="#2D73DF" offset="0%"></stop>
                            <stop stopColor="#3165FF" offset="100%"></stop>
                        </linearGradient>
                        <linearGradient
                            x1="27.7777778%"
                            y1="0%"
                            x2="72.2222222%"
                            y2="100%"
                            id="linearGradient-2"
                        >
                            <stop stopColor="#0C5ED6" offset="0%"></stop>
                            <stop stopColor="#0530AD" offset="100%"></stop>
                        </linearGradient>
                    </defs>
                    <g
                        id="Page-1"
                        stroke="none"
                        strokeWidth="1"
                        fill="none"
                        fillRule="evenodd"
                    >
                        <g
                            id="Logo"
                            transform="translate(-3.000000, -2.000000)"
                        >
                            <path
                                d="M13,17 C13,19.7614237 10.7614237,22 8,22 C5.23857625,22 3,19.7614237 3,17 L3,17 L3,7 C3,4.23857625 5.23857625,2 8,2 L8,2 L13,2 Z"
                                id="Combined-Shape"
                                fill="url(#linearGradient-1)"
                                transform="translate(8.000000, 12.000000) scale(-1, -1) translate(-8.000000, -12.000000) "
                            ></path>
                            <path
                                d="M18,11 C18,11.0151296 17.999944,11.030246 17.9998322,11.0453492 L18,17 L12.045,16.999 L12,17 C8.76160306,17 6.12242824,14.4344251 6.00413847,11.2249383 L6,11 L6,11 L6,5 L6.00413847,4.77506174 C6.12242824,1.56557489 8.76160306,-1 12,-1 C15.3137085,-1 18,1.6862915 18,5 L18,5 Z"
                                id="Combined-Shape"
                                fill="url(#linearGradient-2)"
                                transform="translate(12.000000, 8.000000) scale(1, -1) rotate(90.000000) translate(-12.000000, -8.000000) "
                            ></path>
                        </g>
                    </g>
                </svg>
                <span className="font-semibold text-xl tracking-tight">
                    FISE Plaza
                </span>
            </a>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-blue-200 border-blue-400 hover:text-white hover:border-white">
                    <svg
                        className="fill-current h-3 w-3"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <title>Menu</title>
                        <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                    </svg>
                </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    {links.map(({ href, label }) => (
                        <Link href={href} key={href+label}>
                            <a className="block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4">
                                {label}
                            </a>
                        </Link>
                    ))}
                </div>
                <div>
                    <a
                        href="/login"
                        className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-blue-500 hover:bg-white mt-4 lg:mt-0"
                    >
                        Go to App
                    </a>
                </div>
            </div>
        </nav>
    );
}
