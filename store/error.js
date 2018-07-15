let id = 0;

export const state = () => [];

export const mutations = {
  add(current, error) {
    id += 1;
    return current.push({
      ...error,
      id,
    });
  },

  remove(current, error) {
    if (!error.id) {
      return current;
    }
    const idx = current.findIndex(comp => comp.id === error.id);
    if (idx < 0) {
      return current;
    }
    return [
      ...current.splice(0, idx),
      ...current.splice(idx + 1),
    ];
  },

  update(current, error) {
    if (!error.id) {
      return current;
    }
    const idx = current.findIndex(comp => comp.id === error.id);
    if (idx < 0) {
      return current;
    }
    return [
      ...current.splice(0, idx),
      {
        ...current[idx],
        ...error,
      },
      ...current.splice(idx + 1),
    ];
  },
};
