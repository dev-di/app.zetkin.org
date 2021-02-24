import { GetServerSideProps } from 'next';
import Z from 'zetkin';

import stringToBool from '../utils/stringToBool';

export const getServerSideProps : GetServerSideProps = async () => {
    const z = Z.construct({
        clientId: process.env.ZETKIN_CLIENT_ID,
        clientSecret: process.env.ZETKIN_CLIENT_SECRET,
        ssl: stringToBool(process.env.ZETKIN_USE_TLS),
        zetkinDomain: process.env.ZETKIN_API_HOST,
    });

    const protocol = stringToBool(process.env.NEXT_PUBLIC_APP_USE_TLS)? 'https' : 'http';
    const host = process.env.NEXT_PUBLIC_APP_HOST;

    return {
        redirect: {
            destination: z.getLoginUrl(`${protocol}://${host}`),
            permanent: true,
        },
    };
};

export default function NotUsed() : JSX.Element {
    return null;
}