type StateDirEnvSnapshot = {
  opensoulStateDir: string | undefined;
  opensoulLegacyStateDir: string | undefined;
};

export function snapshotStateDirEnv(): StateDirEnvSnapshot {
  return {
    opensoulStateDir: process.env.OPENSOUL_STATE_DIR,
    opensoulLegacyStateDir: process.env.OPENSOUL_STATE_DIR,
  };
}

export function restoreStateDirEnv(snapshot: StateDirEnvSnapshot): void {
  if (snapshot.opensoulStateDir === undefined) {
    delete process.env.OPENSOUL_STATE_DIR;
  } else {
    process.env.OPENSOUL_STATE_DIR = snapshot.opensoulStateDir;
  }
  if (snapshot.opensoulStateDir === undefined) {
    delete process.env.OPENSOUL_STATE_DIR;
  } else {
    process.env.OPENSOUL_STATE_DIR = snapshot.opensoulStateDir;
  }
}

export function setStateDirEnv(stateDir: string): void {
  process.env.OPENSOUL_STATE_DIR = stateDir;
  delete process.env.OPENSOUL_STATE_DIR;
}
