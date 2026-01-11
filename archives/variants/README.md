Archives of project variants

What this is:
- This directory contains archived copies of earlier project variants (e.g., AI-Resume-Parser-1, -2, -3). They were moved here to declutter the main repo.

Actions taken:
- Large `node_modules` folders were removed to reclaim space. These can be restored by running `npm install` in the variant directory if needed.
- Nested `.git` folders were backed up into `git-backups/` (timestamped). This preserves commit history if you need to inspect or restore the repo state.

Where backups live:
- `git-backups/` contains the moved `.git` directories for each variant (timestamped).

How to restore a variant (if needed):
1. Copy the variant folder out of `archives/variants` to a working location.
2. To restore Git history, copy the corresponding folder from `git-backups/` back to `your-variant/.git`.
3. Run `npm install` in the variant's root/backend as needed.

If you want me to:
- remove the `git-backups/` after explicit confirmation, or
- extract any unique files from these variants into the canonical project, I can continue.