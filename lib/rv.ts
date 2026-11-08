import {revalidateTag} from 'next/cache';
// Called after every admin/reporter save so the cached data refreshes at once.
export function rvAll(){for(const t of ['news','cats','talukas','site','facts','promises'])revalidateTag(t)}
