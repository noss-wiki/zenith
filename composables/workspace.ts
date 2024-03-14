interface Workspace {
  name: string;
  icon?: string;
}

const defaultWorkspace: Workspace = {
  name: 'New Workspace',
};

const workspaces: {
  active: Ref<Workspace>;
  list: Workspace[];
} = {
  active: ref(defaultWorkspace),
  list: [defaultWorkspace],
};

export function useWorkspaces(): typeof workspaces {
  return workspaces;
}
