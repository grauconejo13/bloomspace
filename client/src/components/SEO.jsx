import { Helmet } from 'react-helmet-async';
import { OG_IMAGE_URL, buildPublicUrl } from '../utils/publicUrl';

const SITE_NAME = 'Bloomspace';
const DEFAULT_DESCRIPTION = 'A community wellness garden where you can draw a flower and plant a positive message for the world to see.';

/**
 * Per-page title/description/canonical/Open Graph/Twitter tags.
 * `path` should be the route's path (e.g. "/garden"); omit it for pages with
 * no single canonical URL (like the 404 catch-all) and pass `noindex` instead.
 */
function SEO({ title, description = DEFAULT_DESCRIPTION, path, noindex = false }) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : SITE_NAME;
  const url = path ? buildPublicUrl(path) : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {noindex && <meta name="robots" content="noindex" />}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={OG_IMAGE_URL} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE_URL} />
    </Helmet>
  );
}

export default SEO;
