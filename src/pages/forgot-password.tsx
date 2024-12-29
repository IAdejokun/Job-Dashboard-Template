import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ForgotPasswordView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Admin Forgot Password - ${CONFIG.appName}`}</title>
      </Helmet>

          <ForgotPasswordView/>

    </>
  );
}
