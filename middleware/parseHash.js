export default function parseHash({ route }) {
  if (route.hash) {
    const parsed = {};
    const sanitized = route.hash.startsWith('#') ? route.hash.substring(1) : route.hash;
    const segments = sanitized.split('&');
    if (segments.length === 0) {
      return parsed;
    }
    segments.forEach((segment) => {
      const contents = segment.split('=');
      parsed[decodeURIComponent(contents[0])] = decodeURIComponent(contents[1]);
    });
    /* eslint-disable-next-line no-param-reassign */
    route.meta = {
      ...route.meta,
      ...parsed,
    };
    return parsed;
  }
  return {};
}
