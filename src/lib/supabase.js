import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://xstxxbpvksbrgdbbhieo.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_s5_3bbG0uEyiAyxkyHFz9w_mc87bTJI'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
