<script>
export default {
  asyncData({ error, req }) {
    const fallback = {
      error: 'Error',
      error_description: 'Something just happened we can\'t really explain yet...',
    };
    if (!req.meta || !req.meta.error) {
      return error(fallback);
    }
    return error({
      ...fallback,
      ...req.meta,
    });
  },
};
</script>
