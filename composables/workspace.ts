export interface Workspace {
  name: string;
  members: number;
  icon?: string;
}

const nossWorkspace = ref<Workspace>({
  name: 'Noss',
  members: 2,
});

const secondWorkspace = ref<Workspace>({
  name: 'Aantekeningen minkema',
  members: 7,
});

const workspaces: {
  active: Ref<Workspace>;
  list: Ref<Workspace>[];
} = {
  active: ref(nossWorkspace),
  list: [nossWorkspace, secondWorkspace],
};

export function useWorkspaces(): typeof workspaces {
  return workspaces;
}
