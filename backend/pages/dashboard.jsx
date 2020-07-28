import { withIronSession } from "next-iron-session";

function DashboardPage({ user }) {
    return (
        <div>
            <div className="hero">
                <h1 className="title">DASHHHHHBOARD</h1>
                <p>For my dude {user.email}</p>
            </div>
        </div>
    );
}

export const getServerSideProps = withIronSession(
    async ({ req, res }) => {
        const user = req.session.get("user");

        if (!user) {
            res.statusCode = 404;
            res.end();
            return { props: {} };
        }

        return {
            props: { user },
        };
    },
    {
        cookieName: "MYSITECOOKIE",
        cookieOptions: {
            secure: process.env.NODE_ENV === "production" ? true : false,
        },
        password: process.env.APPLICATION_SECRET,
    }
);

export default DashboardPage;
