export default defineComponent({
  name: 'PageRedirect',
  render: () => {
    return h('div');
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { query = {} } = route || {};
    onBeforeMount(() => {
      router.push({ path: query?.target as string || '/index' });
    });
  },
});
