import {revalidateTag} from 'next/cache';
// Called after every admin/reporter save so the cached data (news, categories, talukas, site settings) refreshes at once.
export function rvAll(){for(const t of ['news','cats','talukas','site'])revalidateTag(t)}
