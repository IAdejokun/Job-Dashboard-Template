import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VerifyView } from 'src/sections/auth';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Admin Verify - ${CONFIG.appName}`}</title>
      </Helmet>

      <VerifyView/>
    </>
  );
}
