<template>
  <span>{{ greeting }}</span>
</template>

<script>
export default {
  computed: {
    greeting: {
      get() {
        const i = Math.floor(Math.random() * this.greetings.length);
        return this.greetings[i];
      },
    },
  },
  data() {
    return {
      greetings: [
        'Hello',
        'Hi',
        'Howdy',
        'G\'day',
        'Hey',
      ],
    };
  },
};
</script>
