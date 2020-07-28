export default function IndexPage() {
    return (
        <div
            className="h-screen pb-14 bg-right bg-cover"
            style={{ backgroundImage: "url('assets/bg.svg')" }}
        >
            <div className="container pt-24 md:pt-48 px-6 mx-auto flex flex-wrap flex-col md:flex-row items-center">
                <div className="flex flex-col w-full xl:w-2/5 justify-center lg:items-start overflow-y-hidden">
                    <h1 className="my-4 text-3xl md:text-5xl text-blue-800 font-bold leading-tight text-center md:text-left slide-in-bottom-h1">
                        Finally let your loved ones connect with <i>you</i>.
                    </h1>
                    <p className="leading-normal text-base md:text-2xl mb-8 text-center md:text-left slide-in-bottom-subtitle">
                        FISE Plaza, the easiest way to get in touch with the
                        people you care about!
                    </p>

                    <p className="text-blue-400 font-bold pb-8 lg:pb-6 text-center md:text-left fade-in">
                        Get Started Now:
                    </p>
                    <div className="flex w-full justify-center md:justify-start pb-24 lg:pb-0 fade-in">
                        <a
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            href="/login"
                        >
                            Sign Up Here
                        </a>
                    </div>
                </div>
                <div className="w-full xl:w-3/5 py-6 overflow-y-hidden">
                    <img
                        className="w-5/6 mx-auto lg:mr-0 slide-in-bottom"
                        src="assets/devices.svg"
                    />
                </div>
            </div>
        </div>
    );
}
